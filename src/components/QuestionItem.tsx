import React, { ReactNode } from 'react';
import { useRouter } from 'next/router'; // Next.js 사용시

interface QuestionItemProps {
  number: string;
  question: string;
  className?: string;
  isComplete: boolean;
  onClick?: () => void;
  detailPageUrl: string; // 상세 페이지 URL
  children?: ReactNode;
}

export default function QuestionItem({ number, question, className = '', isComplete, onClick, detailPageUrl }: QuestionItemProps) {
  const router = useRouter(); // Router 훅 사용

  // 클릭 시 상세 페이지로 이동
  const handleClick = () => {
    router.push(detailPageUrl);
    if (onClick) onClick(); // 추가적인 onClick 기능이 있다면 호출
  };

  return (
    <header className={`relative h-[52px] w-[412px] border-b border-zinc-100 ${className}`} onClick={handleClick}>
      {/* 뒤로가기 화살표 (예시용, 실제 아이콘으로 교체 추천) */}
      {isComplete && (
        <div className='absolute left-[396px] top-[38px] w-6 h-6 -rotate-180 origin-top-left overflow-hidden'>
          <div className='absolute left-[8.33px] top-[5.36px] w-2 h-[13.31px] bg-zinc-800' />
        </div>
      )}

      {/* 번호 */}
      <span className="absolute left-[40px] top-[14px] text-rose-300 text-lg font-bold font-['Pretendard'] leading-tight">{number}</span>

      {/* 질문 */}
      <span className="absolute left-[69px] top-[16px] text-zinc-800 text-base font-medium font-['Pretendard'] leading-tight">{question}</span>

      {/* 아이콘 */}
      <div className='absolute left-[16px] top-[16px] w-5 h-5 overflow-hidden'>
        <div className='absolute left-[1.25px] top-[2.55px] w-[17.49px] h-[14.95px] bg-rose-300' />
      </div>
    </header>
  );
}
