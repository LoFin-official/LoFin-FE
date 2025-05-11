import React, { ReactNode, useState } from 'react';
import Header from '@/components/shared/Header';
import BottomBar from '@/components/shared/BottomBar';
import Input from '@/components/shared/Input';
import BottomSheetDate from '@/components/shared/BottomSheetDate';
import Button from '@/components/shared/Button';

export default function AnniversaryCreatePage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [anniversaryName, setAnniversaryName] = useState('');

  const handleDateSelect = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
    setIsDateSheetOpen(false);
  };

  const isComplete = anniversaryName.trim() !== '' && selectedDate !== '';

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
        <Button isComplete={isComplete} className=''>
          변경 완료
        </Button>
      </div>
      <BottomSheetDate isOpen={isDateSheetOpen} onClose={() => setIsDateSheetOpen(false)} height={'380px'} onSelectDate={handleDateSelect} />
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
