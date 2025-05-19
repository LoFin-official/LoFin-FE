import BottomBar from '@/components/shared/BottomBar';
import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import { useRouter } from 'next/router';
import React, { ReactNode, useState, useEffect } from 'react';
import { backendUrl } from '@/config/config';

export default function ProfileEditPage() {
  const router = useRouter();

  interface InitialDataType {
    nickname: string;
    birth: string;
    profileImageUrl: string | null;
  }

  interface ProfileFormData {
    nickname: string;
    birth: string;
    profileImageFile: File | null;
    previewUrl: string | null;
  }

  const [initialData, setInitialData] = useState<InitialDataType>({
    nickname: '',
    birth: '',
    profileImageUrl: null,
  });

  const [formData, setFormData] = useState<ProfileFormData>({
    nickname: '',
    birth: '',
    profileImageFile: null,
    previewUrl: null,
  });

  //  사용자 정보 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('로그인이 필요합니다.');
          router.push('/login');
          return;
        }

        const response = await fetch(`${backendUrl}/profileUpdate/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          const profile = data.data;
          const { nickname, birth, profilePicture } = profile;

          // 백엔드에서 받은 경로에 서버 주소 붙이기
          const profileImageUrl = profilePicture ? backendUrl + profilePicture : null;

          setInitialData({
            nickname: nickname || '',
            birth: birth ? birth.split('T')[0] : '',
            profileImageUrl,
          });

          setFormData({
            nickname: nickname || '',
            birth: birth ? birth.split('T')[0] : '',
            profileImageFile: null,
            previewUrl: profileImageUrl,
          });
        } else {
          alert('프로필 정보를 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('프로필 불러오기 오류:', error);
      }
    };

    fetchProfile();
  }, [router]);

  //  이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImageFile: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  // 유효성 검사
  const nicknameTrimmed = formData.nickname?.trim() || '';
  const isOnlyConsonantsOrVowels = /^[ㄱ-ㅎㅏ-ㅣ]+$/.test(nicknameTrimmed);
  const isValidNickname = nicknameTrimmed.length >= 2 && nicknameTrimmed.length <= 8 && !isOnlyConsonantsOrVowels;

  const isValidDate = (dateString: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  };

  const birthTrimmed = formData.birth?.trim() || '';
  const isValidBirth = isValidDate(birthTrimmed);

  // 변경 여부 체크
  const isChanged = nicknameTrimmed !== initialData.nickname || birthTrimmed !== initialData.birth || formData.profileImageFile !== null;

  const isComplete = isValidNickname && isValidBirth && isChanged;

  // 생년월일 포맷팅
  const formatBirthInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    const parts = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(Boolean);
    return parts.join('-');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'birth' ? formatBirthInput(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleProfile = async () => {
    if (!isComplete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인 상태가 아닙니다.');
        router.push('/login');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('nickname', nicknameTrimmed);
      formDataToSend.append('birth', birthTrimmed);

      if (formData.profileImageFile) {
        formDataToSend.append('profilePicture', formData.profileImageFile);
      }

      const response = await fetch(`${backendUrl}/profileUpdate/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert('프로필이 성공적으로 수정되었습니다.');
        router.push('/my-page/profile');
      } else {
        alert(data.message || '프로필 수정 실패');
      }
    } catch (error) {
      console.error('프로필 수정 에러:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    }
  };
  console.log('previewUrl:', formData.previewUrl);
  return (
    <div className='flex flex-col justify-between min-h-[calc(100vh-112px)] pt-16 items-center'>
      <div className='flex flex-col gap-16 items-center w-full max-w-[412px] px-4'>
        {/* 이미지 미리보기 */}
        <div className='relative w-[150px] h-[150px] rounded-full overflow-hidden bg-[#CCCCCC]'>
          {formData.previewUrl ? (
            <img key={formData.previewUrl} src={formData.previewUrl} alt='프로필 이미지' className='w-full h-full object-cover' />
          ) : (
            <span className='flex justify-center items-center w-full h-full text-gray-500'>프로필 이미지</span>
          )}
          <input type='file' accept='image/*' onChange={handleImageChange} className='absolute inset-0 opacity-0 cursor-pointer' />
        </div>

        {/* 입력 필드 */}
        <div className='flex flex-col gap-8 w-full max-w-[348px]'>
          <Input
            width='w-full max-w-[348px]'
            label='닉네임'
            placeholder='닉네임 입력'
            helperText='ㆍ닉네임은 최소 두 글자, 최대 여덟 글자입니다.'
            name='nickname'
            maxLength={8}
            value={formData.nickname}
            onChange={handleChange}
          />
          <Input
            width='w-full max-w-[348px]'
            label='생년월일'
            placeholder='YYYY-MM-DD'
            helperText='ㆍ연도-월-일(YYYY-MM-DD) 형식으로 입력해 주세요.'
            name='birth'
            maxLength={10}
            value={formData.birth}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className='mt-16 w-full max-w-[412px] mx-auto px-4'>
        <Button isComplete={isComplete} onClick={handleProfile} className='mb-4'>
          변경 완료
        </Button>
      </div>
    </div>
  );
}

ProfileEditPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>프로필 변경</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
