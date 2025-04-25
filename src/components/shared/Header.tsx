import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { BackIcon, CloseIcon } from '@/assets/icons/SvgIcon';

interface HeaderProps {
  children: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const router = useRouter();
  const { pathname } = router;

  // 추억, 질문 작성 = X / 경로 수정 예정
  const noIconPages = ['/memory', '/question', '/present', '/account/profile', '/account/wish', '/account/couple-connect'];
  const closeIconPages = ['/question/edit'];

  let IconComponent: React.ElementType | null = BackIcon;

  if (noIconPages.includes(pathname)) {
    IconComponent = null;
  } else if (closeIconPages.includes(pathname)) {
    IconComponent = CloseIcon;
  }

  return (
    <div className='w-[412px] h-[56px] relative bg-white border-b border-[#eee] flex items-center'>
      <div className='cursor-pointer pl-2'>{IconComponent && <IconComponent onClick={() => router.back()} />}</div>
      <div className='absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-[#333333]'>{children}</div>
    </div>
  );
}
