import { HeartIcon } from '@/assets/icons/SvgIcon';
import React from 'react';

interface MemoryData {
  title: string;
  text: string;
  date: string;
  dday: number;
}

interface MemoryPolaroidItemProps {
  data: MemoryData;
}

export default function MemoryPolaroidItem3({ data }: MemoryPolaroidItemProps) {
  return (
    <div className='w-[332px] h-[468px] flex flex-col gap-1 items-center py-4 px-4'>
      {/* 사진 영역 */}
      <div className='w-[300px] h-[384px] flex flex-col gap-4'>
        <div className='w-[300px] h-[300px] bg-[#eeeeee]'></div>
        <div className='w-[296px] h-[76px] flex flex-col gap-2 px-0.5 mx-0.5'>
          <span className='h-7 text-xl text-[#333333] font-bold'>{data.title}</span>
          <span className='h-10 text-[#767676]'>{data.text}</span>
        </div>
      </div>

      {/* 좋아요 & 날짜 영역 */}
      <div className='w-auto h-[48px] flex flex-col justify-center items-center self-end px-0.5'>
        <div className='flex flex-row gap-0.5 text-[#FF9BB3] items-center'>
          <HeartIcon className='h-5 w-5' />
          <span className='h-7 text-lg font-bold'>+ {data.dday}</span>
        </div>
        <span className='h-5 text text-[#333333]'>{data.date}</span>
      </div>
    </div>
  );
}
