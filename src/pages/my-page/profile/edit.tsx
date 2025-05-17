import BottomBar from '@/components/shared/BottomBar';
import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';

export default function ProfileEditPage() {
  const router = useRouter();

  const initialData = {
    nickname: '제리',
    birth: '1940-02-10',
  };

  const [formData, setFormData] = useState(initialData);

  const isOnlyConsonantsOrVowels = /^[ㄱ-ㅎㅏ-ㅣ]+$/.test(formData.nickname.trim());
  const isValidNickname = formData.nickname.trim().length >= 2 && formData.nickname.trim().length <= 8 && !isOnlyConsonantsOrVowels;

  const isValidDate = (dateString: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  };

  const isValidBirth = /^\d{4}-\d{2}-\d{2}$/.test(formData.birth) && isValidDate(formData.birth);

  // 변경 여부 체크
  const isChanged = formData.nickname.trim() !== initialData.nickname || formData.birth.trim() !== initialData.birth;

  const isComplete = isValidNickname && isValidBirth && isChanged;

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

  const handleProfile = () => {
    if (isComplete) {
      // 변경된 경우에만 동작
      router.push('/my-page/profile');
    }
  };

  return (
    <div className='flex flex-col justify-between min-h-[calc(100vh-112px)] pt-16 items-center'>
      <div className='flex flex-col gap-16 items-center w-full max-w-[412px] px-4'>
        <div className='w-[150px] h-[150px] bg-[#CCCCCC] rounded-full'></div>
        <div className='flex flex-col gap-8 w-full max-w-[348px]'>
          <Input
            width='w-full max-w-[348px]'
            label='닉네임'
            placeholder='제리'
            helperText='ㆍ닉네임은 최소 두 글자, 최대 여덟 글자입니다.'
            name='nickname'
            maxLength={8}
            value={formData.nickname}
            onChange={handleChange}
          />
          <Input
            width='w-full max-w-[348px]'
            label='생년월일'
            placeholder='1940. 02. 10.'
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
