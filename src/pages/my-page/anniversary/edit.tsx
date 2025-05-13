import React, { ReactNode, useEffect, useState } from 'react';
import Header from '@/components/shared/Header';
import BottomBar from '@/components/shared/BottomBar';
import Input from '@/components/shared/Input';
import BottomSheetDate from '@/components/shared/BottomSheetDate';
import Button from '@/components/shared/Button';
import { useRouter } from 'next/router';

export default function AnniversaryEditPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [anniversaryName, setAnniversaryName] = useState('');
  const router = useRouter();

  const [initialSelectedDate, setInitialSelectedDate] = useState('');
  const [initialAnniversaryName, setInitialAnniversaryName] = useState('');

  useEffect(() => {
    const initialName = '100일';
    const initialDate = '2024-05-20';

    setAnniversaryName(initialName);
    setSelectedDate(initialDate);
    setInitialAnniversaryName(initialName);
    setInitialSelectedDate(initialDate);
  }, []);

  const handleDateSelect = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
    setIsDateSheetOpen(false);
  };

  // 기존 값과 다른 경우에만 버튼 활성화
  const isComplete =
    anniversaryName.trim() !== '' && selectedDate !== '' && (anniversaryName !== initialAnniversaryName || selectedDate !== initialSelectedDate);

  const handleDday = () => {
    if (isComplete) {
      // 변경된 경우에만 동작
      router.push('/my-page/anniversary');
    }
  };

  return (
    <>
      <div className='flex flex-col gap-16 min-h-[calc(100vh-178px)] items-center pt-16'>
        <span className='h-6 text-[#333333] font-bold text-xl'>우리만의 D-Day, 설레는 순간을 기록해요.</span>
        <div className='flex flex-col gap-8'>
          <Input
            label='이 날을 뭐라고 부를까요?'
            placeholder='ex) 100일, 200일'
            width='w-[348px]'
            value={anniversaryName}
            onChange={(e) => setAnniversaryName(e.target.value)}
          />
          <Input
            label='이 날은 언제인가요?'
            placeholder='날짜를 선택해 주세요.'
            width='w-[348px]'
            value={selectedDate}
            readOnly
            onClick={() => setIsDateSheetOpen(true)}
          />
        </div>
      </div>
      <div className='flex-grow'>
        <Button isComplete={isComplete} onClick={handleDday}>
          디데이 수정
        </Button>
      </div>
      <BottomSheetDate isOpen={isDateSheetOpen} onClose={() => setIsDateSheetOpen(false)} height={'380px'} onSelectDate={handleDateSelect} />
    </>
  );
}

AnniversaryEditPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>기념일 수정</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
