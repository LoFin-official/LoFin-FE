import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { BackIcon, CloseIcon, MemoryIcon, MemoryImageIcon, QuestionEditIcon } from '@/assets/icons/SvgIcon';

interface HeaderProps {
  children: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const router = useRouter();
  const { pathname } = router;

  // 추억, 질문 작성 = X / 경로 수정 예정
  const noIconPages = ['/memory', '/question', '/present', '/account/profile', '/account/wish', '/account/couple-connect'];
  const closeIconPages = ['/question/edit'];
  const memoryEditPages = ['/memory'];
  const questionEditPages = ['/question'];
  const imagePages = ['/memory/edit'];
  const nextPages = ['/account/WishForm'];

  let IconComponent: React.ElementType | null = BackIcon;

  if (noIconPages.includes(pathname)) {
    IconComponent = null;
  } else if (closeIconPages.includes(pathname)) {
    IconComponent = CloseIcon;
  }

  let RightComponent: React.ReactNode = null;

  if (memoryEditPages.includes(pathname)) {
    RightComponent = <MemoryIcon className='cursor-pointer' />;
  } else if (questionEditPages.includes(pathname)) {
    RightComponent = <QuestionEditIcon className='cursor-pointer' />;
  } else if (imagePages.includes(pathname)) {
    RightComponent = <MemoryImageIcon className='cursor-pointer' />;
  } else if (nextPages.includes(pathname)) {
    RightComponent = (
      <button className='h-5 text-sm text-[#767676] cursor-pointer' onClick={() => router.push('/account/couple-connect')}>
        건너뛰기
      </button>
    );
  }

  return (
    <div className='w-[412px] h-[56px] relative bg-white border-b border-[#eee] flex items-center justify-between px-2'>
      <div className='cursor-pointer pl-2'>{IconComponent && <IconComponent onClick={() => router.back()} />}</div>
      <div className='absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-[#333333]'>{children}</div>
      <div className='text-right pr-2'>{RightComponent}</div>
    </div>
  );
}
