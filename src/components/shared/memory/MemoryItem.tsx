import { HeartIcon } from '@/assets/icons/SvgIcon';
import React from 'react';

interface Memory {
  title: string;
  text: string;
  date: string;
  dday: number;
}

interface MemoryItemProps {
  border?: boolean;
}

export default function MemoryItem({ border = true }: MemoryItemProps) {
  const memories: Memory[] = [
    { title: '제목1', text: '내용1', date: '2025.03.31', dday: 100 },
    { title: '제목2', text: '내용2', date: '2025.04.01', dday: 300 },
    { title: '제목3', text: '내용3', date: '2025.04.02', dday: 9000 },
  ];

  return (
    <>
      {memories.map((item: Memory, index: number) => (
        <div key={index} className={`w-[388px] h-[336px] flex gap-0.5 items-center my-4 mx-3 ${index % 2 === 1 ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* 사진 영역 */}
          <div className={`w-[296px] h-[336px] flex flex-col gap-2 rounded-[18px] p-4 ${border ? 'border border-[#FF4C80]' : ''}`}>
            <div className='w-[264px] h-[252px] rounded-[18px] bg-[#eeeeee]'></div>
            <div className='w-[256px] h-[52px] flex flex-col gap-1 px-1'>
              <span className='h-7 text-xl text-[#333333] font-bold'>{item.title}</span>
              <span className='h-5 text-[#767676]'>{item.text}</span>
            </div>
          </div>

          {/* 좋아요 & 날짜 영역 */}
          <div className='w-[90px] h-[48px] flex flex-col justify-center items-center'>
            <div className='flex flex-row gap-0.5 text-[#FF9BB3] items-center'>
              <HeartIcon className='h-5 w-5' />
              <span className='h-7 text-lg font-bold'>+ {item.dday}</span>
            </div>
            <span className='h-5 text text-[#333333]'>{item.date}</span>
          </div>
        </div>
      ))}
    </>
  );
}
