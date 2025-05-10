import { HeartIcon, VitalIcon, QuestionsIcon } from '@/assets/icons/SvgIcon';
import React from 'react';
import { useRouter } from 'next/router';

interface ProfileProps {
  type?: 'profile' | 'date' | 'none' | 'question';
  id?: number;
}

export default function ProfileItem({ type = 'none', id }: ProfileProps) {
  const router = useRouter();

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

  const handleClick = () => {
    if (type === 'profile') {
      router.push('/my-page/profile');
    }
  };

  const questionText = `${id}번째 질문`;

  return (
    <>
      <div
        className={`w-[380px] h-auto px-6 pt-6 pb-4 bg-[#ffffff] rounded-[18px] flex flex-col mx-auto ${type === 'profile' && 'cursor-pointer'}`}
        onClick={handleClick}
      >
        <div className='w-[332px] h-[120px] flex flex-row gap-[30px] items-center justify-center'>
          <div className='w-[120px] h-[120px] rounded-full bg-[#eeeeee]'></div>
          <VitalIcon />
          <div className='w-[120px] h-[120px] rounded-full bg-[#eeeeee]'></div>
        </div>
        <div className='w-[332px] h-6 mt-2 flex items-center justify-center'>
          {type === 'question' ? (
            <span className='flex text-xl font-bold text-[#333333]'>질문 하나, 추억 하나</span>
          ) : (
            <>
              <span className='flex-1 text-right pr-2 text-xl font-bold text-[#333333]'>제리</span>
              <HeartIcon />
              <span className='flex-1 text-left pl-2 text-xl font-bold text-[#333333]'>제리</span>
            </>
          )}
        </div>
        {type !== 'none' && (
          <div className='w-[332px] h-5 mt-4 flex items-center justify-center'>
            {type === 'question' && <QuestionsIcon className='mr-[2px] text-[#767676]' />}
            <span className={`text-base font-bold text-[#767676] ${type === 'question' && 'font-medium text-[14px]'}`}>
              {type === 'profile' ? '프로필 정보 확인하기' : type === 'question' ? questionText : today}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
