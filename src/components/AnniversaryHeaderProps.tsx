import React from 'react';

interface AnniversaryHeaderProps {
  iconColor?: string; // 아이콘 색상 (기본: 'bg-pink-500')
  title: string; // 예: "100일"
  dDay: string; // 예: "D-38"
  date: string; // 예: "2025. 05. 19. (월)"
  className?: string;
}

export default function AnniversaryHeader({ iconColor = 'bg-pink-500', title, dDay, date, className = '' }: AnniversaryHeaderProps) {
  return (
    <div className={`self-stretch h-14 relative bg-white border-b border-zinc-100 overflow-hidden ${className}`}>
      {/* 아이콘 */}
      <div className='w-6 h-6 left-[16px] top-[16px] absolute'>
        <div className={`w-5 h-5 left-[1.5px] top-[3.74px] absolute ${iconColor}`} />
      </div>

      {/* 기념일 제목 */}
      <div className="w-12 h-5 left-[48px] top-[18px] absolute justify-center text-zinc-800 text-base font-bold font-['Pretendard'] leading-tight">
        {title}
      </div>

      {/* D-day */}
      <div className="w-12 h-5 left-[301px] top-[8px] absolute text-right justify-end text-rose-300 text-sm font-bold font-['Pretendard']">
        {dDay}
      </div>

      {/* 날짜 */}
      <div className="left-[244px] top-[28px] absolute text-right justify-center text-neutral-500 text-sm font-medium font-['Pretendard'] leading-tight">
        {date}
      </div>

      {/* 우측 세로 아이콘 (옵션) */}
      <div className='w-5 h-5 left-[356px] top-[8px] absolute overflow-hidden'>
        <div className='w-5 h-5 left-0 top-0 absolute' />
        <div className='w-[2.5px] h-3.5 left-[8.75px] top-[2.5px] absolute bg-neutral-500' />
      </div>
    </div>
  );
}
