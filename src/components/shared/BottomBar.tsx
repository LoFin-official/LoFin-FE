import React, { ReactNode } from 'react';
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

  const handleNavigate = (path: string) => {
    stackRouterPush(router, path);
  };

  return (
    <div>
      {children}
      <div className='fixed bottom-0 w-full max-w-[412px] h-[56px] bg-white border-t flex justify-around items-center'>
        <button className={`flex flex-col items-center ${getActiveClass('/present')}`} onClick={() => handleNavigate('/present')}>
          <GiftIcon className='fill-current' />
          <span className='text-xs font-bold'>선물</span>
        </button>
        <button className={`flex flex-col items-center ${getActiveClass('/chat')}`} onClick={() => handleNavigate('/chat')}>
          <ChatIcon className='fill-current' />
          <span className='text-xs font-bold'>채팅</span>
        </button>
        <button className={`flex flex-col items-center ${getActiveClass('/memory')}`} onClick={() => handleNavigate('/memory')}>
          <MemoryIcon className='fill-current' />
          <span className='text-xs font-bold'>추억</span>
        </button>
        <button className={`flex flex-col items-center ${getActiveClass('/question')}`} onClick={() => handleNavigate('/question')}>
          <QuestionsIcon className='fill-current w-6 h-6' />
          <span className='text-xs font-bold'>질문</span>
        </button>
        <button className={`flex flex-col items-center ${getActiveClass('/my-page')}`} onClick={() => handleNavigate('/my-page')}>
          <MyIcon className='fill-current' />
          <span className='text-xs font-bold'>마이</span>
        </button>
      </div>
    </div>
  );
}
