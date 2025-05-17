import BottomBar from '@/components/shared/BottomBar';
import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import ProfileItem from '@/components/shared/ProfileItem';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';

export default function CoupleSinceEditPage() {
  const router = useRouter();

  const initialData = {
    coupleSince: '1940-02-10',
  };

  const [formData, setFormData] = useState(initialData);

  const isValidDate = (dateString: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  };

  const isValidBirth = /^\d{4}-\d{2}-\d{2}$/.test(formData.coupleSince) && isValidDate(formData.coupleSince);

  // 변경 여부 체크
  const isChanged = formData.coupleSince.trim() !== initialData.coupleSince;

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

  const handleProfile = () => {
    if (isComplete) {
      // 변경된 경우에만 동작
      router.push('/my-page/profile');
    }
  };

  return (
    <div className='flex flex-col justify-between min-h-[calc(100vh-112px)] pt-16 items-center'>
      <div className='flex flex-col gap-16 items-center'>
        <ProfileItem />
        <div className='flex flex-col gap-8'>
          <Input
            width='w-full max-w-[348px]'
            label='첫 만남'
            placeholder='1940. 02. 10.'
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
