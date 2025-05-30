import React from 'react';
import { HeartIcon } from '@/assets/icons/SvgIcon';
import DraggablePolaroid from '@/components/shared/memory/DraggablePolaroid';

interface MemoryPolaroidItemProps {
  data: {
    title: string;
    text: string;
    date: string;
    dday: number;
    imageUrl?: string;
    border?: boolean;
    rotation?: number;
  };
  defaultX?: number;
  defaultY?: number;
  defaultRotation?: number;
}

export default function MemoryPolaroidItem5({ data, defaultX = 0, defaultY = 0, defaultRotation = 0 }: MemoryPolaroidItemProps) {
  return (
    <DraggablePolaroid defaultX={defaultX} defaultY={defaultY} defaultRotation={defaultRotation} width={380} height={430}>
      <div className='w-[380px] h-[430px] flex flex-col gap-1 items-center py-4 px-4 bg-white'>
        {/* 사진 영역 */}
        <div className='w-[348px] h-[346px] flex flex-col gap-4'>
          <div className='w-[348px] h-[262px] bg-[#eeeeee]'>
            <img src='/images/1.png' alt='memory' className='w-full h-full object-cover' />
          </div>
          <div className='w-[344px] h-[76px] flex flex-col gap-2 px-0.5 mx-0.5'>
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
    </DraggablePolaroid>
  );
}
