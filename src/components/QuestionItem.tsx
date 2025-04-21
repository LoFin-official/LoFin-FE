import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { QuestionsIcon } from '@/assets/icons/SvgIcon'; // 아이콘 컴포넌트 import
import { BackIcon } from '@/assets/icons/SvgIcon';

interface QuestionItemProps {
  number: string;
  question: string;
  className?: string;
  isComplete: boolean;
  onClick?: () => void;
  detailPageUrl: string;
  children?: ReactNode;
}

export default function QuestionItem({ number, question, className = '', isComplete, onClick, detailPageUrl }: QuestionItemProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(detailPageUrl);
    if (onClick) onClick();
  };

  return (
    <header className={`relative h-[52px] w-[412px] border-b border-zinc-100 ${className}`} onClick={handleClick}>
      {/* 완료 시 아이콘 표시 (좌우 반전) */}
      {isComplete && (
        <div className='absolute right-[16px] top-[14px] transform rotate-180'>
          <BackIcon onClick={() => {}} />
        </div>
      )}

      {/* 번호 */}
      <span className="absolute left-[40px] top-[14px] text-rose-300 text-lg font-bold font-['Pretendard'] leading-tight">{number}</span>

      {/* 질문 */}
      <span className="absolute left-[69px] top-[16px] text-zinc-800 text-base font-medium font-['Pretendard'] leading-tight">{question}</span>

      {/* 아이콘 */}
      <div className='absolute left-[16px] top-[16px] w-5 h-5 overflow-hidden'>
        <QuestionsIcon className='w-5 h-5' />
      </div>
    </header>
  );
}
