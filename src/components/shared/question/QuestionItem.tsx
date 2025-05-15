import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { QuestionsIcon } from '@/assets/icons/SvgIcon'; // 아이콘 컴포넌트 import
import { ForwardIcon } from '@/assets/icons/SvgIcon';

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
    <header className={`relative h-[52px] w-full max-w-[412px] border-b border-[#EEEEEE] ${className}`} onClick={handleClick}>
      <div className='flex items-center '>
        {/* 아이콘 */}
        <div className='ml-4 pt-1.5 w-5 h-5 '>
          <QuestionsIcon />
        </div>

        {/* 번호 */}
        <span className='ml-1 pt-3 text-lg font-bold text-[#FF9BB3] leading-tight'>{number}</span>

        {/* 질문 */}
        <span className='ml-2 pt-3 text-base font-medium text-[#333333] leading-tight'>{question}</span>
        <div className='ml-auto pt-3 mr-4'>
          <ForwardIcon />
        </div>
      </div>
    </header>
  );
}
