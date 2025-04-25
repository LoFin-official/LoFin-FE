import { HeartIcon, VitalIcon } from '@/assets/icons/SvgIcon';
import React from 'react';

interface ProfileProps {
  type?: 'profile' | 'date' | 'none';
}

export default function ProfileItem({ type = 'none' }: ProfileProps) {
  const today = (() => {
    const now = new Date();
    const weekday = now.toLocaleDateString('ko-KR', { weekday: 'short' });
    const date = now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `${date} (${weekday})`;
  })();

  return (
    <>
      <div className='w-[380px] h-[auto] px-6 py-6 flex flex-col mx-auto'>
        <div className='w-[332px] h-[120px] flex flex-row gap-[30px] items-center justify-center'>
          <div className='w-[120px] h-[120px]'></div>
          <VitalIcon />
          <div className='w-[120px] h-[120px]'></div>
        </div>
        <div className='w-[332px] h-6 mt-2 flex items-center justify-center'>
          <span className='flex-1 text-right pr-2 text-xl font-bold text-[#333333]'>제리</span>
          <HeartIcon />
          <span className='flex-1 text-left pl-2 text-xl font-bold text-[#333333]'>제리</span>
        </div>
        {type !== 'none' && (
          <div className='w-[332px] h-5 mt-4 flex items-center justify-center'>
            <span className='text-base font-bold text-[#767676]'>{type === 'profile' ? '프로필 정보 확인하기' : today}</span>
          </div>
        )}
      </div>
    </>
  );
}
