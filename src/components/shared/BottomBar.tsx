import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GiftIcon, ChatIcon, MemoryIcon, QuestionsIcon, MyIcon } from '@/assets/icons/SvgIcon';
import { stackRouterPush } from '@/store/stackRouter';

interface BottomBarProps {
  children?: ReactNode;
}

export default function BottomBar({ children }: BottomBarProps) {
  const router = useRouter();
  const { pathname } = router;

  const getActiveClass = (targetPath: string) =>
    pathname === targetPath || pathname.startsWith(targetPath + '/') ? 'text-[#FF9BB3]' : 'text-[#333333]';

  const handleNavigate = () => {
    // 다른 페이지로 이동
    stackRouterPush(router, '/present');
  };

  return (
    <div>
      {children}
      <div className='fixed bottom-0 w-full max-w-[412px] h-[56px] bg-white border-t flex justify-around items-center'>
        <Link href={'/present'}>
          <button className='flex flex-col items-center' onClick={handleNavigate}>
            <GiftIcon className='fill-current' />
            <span className='text-xs font-bold'>선물</span>
          </button>
        </Link>
        <Link href={'/chat'}>
          <button className={`flex flex-col items-center ${getActiveClass('/chat')}`}>
            <ChatIcon className='fill-current' />
            <span className='text-xs font-bold'>채팅</span>
          </button>
        </Link>
        <Link href={'/memory'}>
          <button className={`flex flex-col items-center ${getActiveClass('/memory')}`}>
            <MemoryIcon className='fill-current' />
            <span className='text-xs font-bold'>추억</span>
          </button>
        </Link>
        <Link href={'/question'}>
          <button className={`flex flex-col items-center ${getActiveClass('/question')}`}>
            <QuestionsIcon className='fill-current w-6 h-6' />
            <span className='text-xs font-bold'>질문</span>
          </button>
        </Link>
        <Link href={'/my-page'}>
          <button className={`flex flex-col items-center ${getActiveClass('/my-page')}`}>
            <MyIcon className='fill-current' />
            <span className='text-xs font-bold'>마이</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
