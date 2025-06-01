import React, { ReactNode, useState } from 'react';
import Header from '@/components/shared/Header';
import BottomBar from '@/components/shared/BottomBar';
import Input from '@/components/shared/Input';
import BottomSheetDate from '@/components/shared/BottomSheetDate';
import Button from '@/components/shared/Button';
import { useRouter } from 'next/router';
import { backendUrl } from '@/config/config';

export default function AnniversaryCreatePage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [anniversaryName, setAnniversaryName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const today = new Date();
  const handleDateSelect = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
    setIsDateSheetOpen(false);
  };

  const isComplete = anniversaryName.trim() !== '' && selectedDate !== '';

  const handleDday = async () => {
    if (!isComplete) return;

    try {
      setLoading(true);

      const token = localStorage.getItem('token'); // 토큰 불러오기

      const response = await fetch(`${backendUrl}/anniversary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: anniversaryName,
          date: selectedDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('기념일 생성 실패: ' + (errorData.message || '알 수 없는 오류'));
        setLoading(false);
        return;
      }

      router.replace('/my-page/anniversary');
    } catch (error) {
      console.error('기념일 생성 중 오류:', error);
      alert('서버 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex flex-col gap-16 min-h-[calc(100vh-178px)] items-center pt-16'>
        <span className='h-6 text-[#333333] font-bold text-xl'>우리만의 D-Day, 설레는 순간을 기록해요.</span>
        <div className='flex flex-col gap-8 w-full max-w-[380px] px-4'>
          <Input
            label='이 날을 뭐라고 부를까요?'
            placeholder='ex) 100일, 200일'
            width='w-full max-w-[348px]'
            value={anniversaryName}
            onChange={(e) => setAnniversaryName(e.target.value)}
          />
          <Input
            label='이 날은 언제인가요?'
            placeholder='날짜를 선택해 주세요.'
            width='w-full max-w-[348px]'
            value={selectedDate}
            readOnly
            onClick={() => setIsDateSheetOpen(true)}
          />
        </div>
      </div>
      <div className='flex-grow w-full max-w-[412px] mx-auto px-4'>
        <Button isComplete={isComplete} onClick={handleDday}>
          {loading ? '생성 중...' : '디데이 생성'}
        </Button>
      </div>
      <BottomSheetDate
        isOpen={isDateSheetOpen}
        onClose={() => setIsDateSheetOpen(false)}
        height={'380px'}
        onSelectDate={handleDateSelect}
        minDate={today}
      />
    </>
  );
}

AnniversaryCreatePage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>기념일 생성</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
