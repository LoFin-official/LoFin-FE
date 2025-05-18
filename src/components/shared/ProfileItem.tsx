import { HeartIcon, VitalIcon, QuestionsIcon } from '@/assets/icons/SvgIcon';
import React from 'react';
import { useRouter } from 'next/router';

interface ProfileProps {
  type?: 'profile' | 'date' | 'none' | 'question';
  id?: string;
  number?: string;
  myNickname?: string;
  partnerNickname?: string;
  myProfileImageUrl?: string | null;
  partnerProfileImageUrl?: string | null;
}

export default function ProfileItem({
  type = 'none',
  id,
  number,
  myNickname = '제리',
  partnerNickname = '제리',
  myProfileImageUrl = null,
  partnerProfileImageUrl = null,
}: ProfileProps) {
  const router = useRouter();

  const formatNumber = (val?: string) => {
    if (!val) return '';
    const num = Number(val);
    if (isNaN(num)) return '';
    return num < 10 ? `0${num}` : `${num}`;
  };

  const questionText = `${formatNumber(number)}번째 질문`;

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
    } else if (type === 'question' && id) {
      router.push({
        pathname: `/question/${id}`,
        query: { number },
      });
    }
  };

  return (
    <div
      className={`w-full max-w-[380px] h-auto px-6 pt-6 pb-4 bg-[#ffffff] rounded-[18px] flex flex-col mx-auto ${
        type === 'profile' || type === 'question' ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      {/* 프로필 이미지 섹션 */}
      <div className='relative w-full max-w-[332px] h-[120px] flex items-center justify-between'>
        {/* 왼쪽 프로필 */}
        <div className='w-[110px] h-[110px] rounded-full bg-[#eeeeee] md:w-[120px] md:h-[120px] overflow-hidden'>
          {myProfileImageUrl ? (
            <img src={myProfileImageUrl} alt='내 프로필 이미지' className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full bg-[#cccccc]' />
          )}
        </div>

        {/* 오른쪽 프로필 */}
        <div className='w-[110px] h-[110px] rounded-full bg-[#eeeeee] md:w-[120px] md:h-[120px] overflow-hidden'>
          {partnerProfileImageUrl ? (
            <img src={partnerProfileImageUrl} alt='애인 프로필 이미지' className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full bg-[#cccccc]' />
          )}
        </div>

        {/* 가운데 심장 아이콘 */}
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
          <VitalIcon />
        </div>
      </div>

      {/* 닉네임 또는 질문 헤더 */}
      <div className='w-full max-w-[332px] h-6 mt-2 flex items-center justify-center'>
        {type === 'question' ? (
          <span className='flex text-xl font-bold text-[#333333]'>질문 하나, 추억 하나</span>
        ) : (
          <>
            <span className='flex-1 text-right pr-2 text-xl font-bold text-[#333333]'>{myNickname}</span>
            <HeartIcon className='text-[#FF4C80]' />
            <span className='flex-1 text-left pl-2 text-xl font-bold text-[#333333]'>{partnerNickname}</span>
          </>
        )}
      </div>

      {/* 하단 텍스트: 질문 번호 / 날짜 / 프로필 안내 */}
      {type !== 'none' && (
        <div className='w-full max-w-[332px] h-5 mt-4 flex items-center justify-center'>
          {type === 'question' && <QuestionsIcon className='mr-[2px] text-[#767676]' />}
          <span className={`text-base font-bold text-[#767676] ${type === 'question' ? 'font-medium text-[14px]' : ''}`}>
            {type === 'profile' ? '프로필 정보 확인하기' : type === 'question' ? questionText : today}
          </span>
        </div>
      )}
    </div>
  );
}
