import React, { ReactNode, useEffect, useState } from 'react';
import Header from '@/components/shared/Header';
import BottomBar from '@/components/shared/BottomBar';
import Input from '@/components/shared/Input';
import BottomSheetDate from '@/components/shared/BottomSheetDate';
import Button from '@/components/shared/Button';
import { useRouter } from 'next/router';
import { backendUrl } from '@/config/config';

export default function AnniversaryEditPage() {
  const router = useRouter();
  const { id } = router.query;

  const [selectedDate, setSelectedDate] = useState('');
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [anniversaryName, setAnniversaryName] = useState('');

  const [initialSelectedDate, setInitialSelectedDate] = useState('');
  const [initialAnniversaryName, setInitialAnniversaryName] = useState('');
  const [loading, setLoading] = useState(true);

  // 날짜 형식 변환 함수
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 서버에서 기념일 정보 불러오기
  useEffect(() => {
    if (!router.isReady || !id) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    const fetchAnniversary = async () => {
      try {
        const res = await fetch(`${backendUrl}/anniversary/anniversaryedit/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('기념일 정보를 불러오는데 실패했습니다.');
        }

        const data = await res.json();
        const formattedDate = formatDate(data.date);

        setAnniversaryName(data.title);
        setSelectedDate(formattedDate);
        setInitialAnniversaryName(data.title);
        setInitialSelectedDate(formattedDate);
      } catch (error) {
        console.error(error);
        alert('기념일 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnniversary();
  }, [id, router.isReady]);

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
    setIsDateSheetOpen(false);
  };

  //  수정 여부 확인
  const isComplete =
    anniversaryName.trim() !== '' && selectedDate !== '' && (anniversaryName !== initialAnniversaryName || selectedDate !== initialSelectedDate);

  //  수정 요청
  const handleDday = async () => {
    if (!isComplete) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/anniversary/anniversaries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: anniversaryName,
          date: selectedDate,
        }),
      });

      if (!res.ok) {
        throw new Error('기념일 수정에 실패했습니다.');
      }

      alert('기념일이 성공적으로 수정되었습니다.');
      router.replace('/my-page/anniversary');
    } catch (error) {
      console.error(error);
      alert('기념일 수정에 실패했습니다.');
    }
  };

  if (loading) return <div>로딩 중...</div>;

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
