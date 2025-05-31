import BottomBar from '@/components/shared/BottomBar';
import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import ProfileItem from '@/components/shared/ProfileItem';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { backendUrl } from '@/config/config';

export default function CoupleSinceEditPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ coupleSince: '' });
  const [initialDate, setInitialDate] = useState('');
  const [profileData, setProfileData] = useState<{
    myProfile: { nickname: string; profilePicture?: string };
    partnerProfile: { nickname: string; profilePicture?: string };
  } | null>(null);

  // 첫 만남 날짜 불러오기 및 프로필 정보 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      try {
        // 첫 만남 날짜
        const dateResponse = await fetch(`${backendUrl}/firstMet/firstmet`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const dateContentType = dateResponse.headers.get('content-type');
        let dateResult;

        if (dateContentType?.includes('application/json')) {
          dateResult = await dateResponse.json();
        } else {
          const text = await dateResponse.text();
          throw new Error(`잘못된 응답 형식입니다: ${text}`);
        }

        if (dateResponse.ok && dateResult.firstMetDate) {
          setFormData({ coupleSince: dateResult.firstMetDate });
          setInitialDate(dateResult.firstMetDate);
        } else {
          console.error('날짜 불러오기 실패:', dateResult.message || '서버 응답 오류');
        }

        // 프로필 정보 불러오기 (예: /profile API 호출 가정)
        const profileResponse = await fetch(`${backendUrl}/coupleprofile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileContentType = profileResponse.headers.get('content-type');
        let profileResult;

        if (profileContentType?.includes('application/json')) {
          profileResult = await profileResponse.json();
        } else {
          const text = await profileResponse.text();
          throw new Error(`프로필 정보 잘못된 응답 형식입니다: ${text}`);
        }

        if (profileResponse.ok) {
          setProfileData(profileResult);
        } else {
          console.error('프로필 정보 불러오기 실패:', profileResult.message || '서버 응답 오류');
        }
      } catch (error) {
        console.error('데이터 불러오기 오류:', error);
      }
    };

    fetchData();
  }, []);

  const isValidDate = (dateString: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  };

  const isValidBirth = isValidDate(formData.coupleSince);
  const isChanged = formData.coupleSince.trim() !== initialDate;
  const isComplete = isValidBirth && isChanged;

  const formatBirthInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    const parts = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(Boolean);
    return parts.join('-');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'coupleSince' ? formatBirthInput(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const updateFirstMetDate = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/firstMet/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstMetDate: formData.coupleSince }),
      });

      const contentType = response.headers.get('content-type');
      const result = contentType?.includes('application/json') ? await response.json() : { message: await response.text() };

      if (response.ok) {
        alert('첫 만남 날짜가 성공적으로 수정되었습니다.');
        router.replace('/my-page/profile');
      } else {
        alert(result.message || '날짜 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('날짜 수정 오류:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  const handleProfile = () => {
    if (isComplete) {
      updateFirstMetDate();
    }
  };

  return (
    <div className='flex flex-col justify-between min-h-[calc(100vh-112px)] pt-16 items-center overflow-auto pb-40'>
      <div className='flex flex-col gap-16 items-center'>
        {profileData && (
          <ProfileItem
            type='none'
            myNickname={profileData.myProfile.nickname}
            partnerNickname={profileData.partnerProfile.nickname}
            myProfileImageUrl={
              profileData.myProfile.profilePicture ? `${backendUrl}/${profileData.myProfile.profilePicture.replace(/^\/?/, '')}` : undefined
            }
            partnerProfileImageUrl={
              profileData.partnerProfile.profilePicture ? `${backendUrl}/${profileData.partnerProfile.profilePicture.replace(/^\/?/, '')}` : undefined
            }
          />
        )}
        <div className='flex flex-col gap-8'>
          <Input
            width='w-full max-w-[348px]'
            label='첫 만남'
            placeholder='YYYY-MM-DD'
            helperText='ㆍ연도-월-일(YYYY-MM-DD) 형식으로 입력해 주세요.'
            name='coupleSince'
            maxLength={10}
            value={formData.coupleSince}
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

CoupleSinceEditPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>커플 정보 변경</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
