import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import { BackIcon, CloseIcon, MemoryIcon, MemoryImageIcon, QuestionEditIcon } from '@/assets/icons/SvgIcon';
import QuestionBottomSheet from './question/QuestionBottomSheet';

interface HeaderProps {
  children: ReactNode;
  onBack?: () => void;
  rightElement?: ReactNode;
  showBackButton?: boolean;
  hasAnswer?: boolean;
  onAnswerDeleted?: () => void; // 답변 삭제 후 콜백 함수 추가
}

export default function Header({ children, onBack, showBackButton, rightElement, hasAnswer, onAnswerDeleted }: HeaderProps) {
  const router = useRouter();
  const { pathname, query } = router;

  const id = query.id;

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const noIconPages = ['/memory', '/question', '/present', '/account/profile', '/account/wish', '/account/couple-connect'];
  const closeIconPages = ['/question/create', '/question/[id]/answer', '/question/[id]/edit', '/memory/create', '/chat/emoji/create'];
  const memoryPages = ['/memory'];
  const memoryEditPages = ['/memory/create', '/memory/[id]', '/memory/edit'];
  const questionEditPages = ['/question', '/question/[id]', '/my-page/anniversary'];
  const imagePages = ['/memory/edit'];
  const nextPages = ['/account/WishForm'];

  let IconComponent: React.ElementType | null = BackIcon;

  if (noIconPages.includes(pathname)) {
    IconComponent = null;
  } else if (showBackButton === false) {
    IconComponent = null;
  } else if (closeIconPages.includes(pathname)) {
    IconComponent = CloseIcon;
  }

  let RightComponent: React.ReactNode = rightElement;

  if (RightComponent === undefined) {
    if (pathname === '/memory/[id]') {
      RightComponent = <MemoryIcon className='cursor-pointer' onClick={() => router.push(`/memory/edit?id=${id}`)} />;
    } else if (memoryPages.includes(pathname)) {
      RightComponent = <MemoryIcon className='cursor-pointer' onClick={() => router.push('/memory/create')} />;
    } else if (memoryEditPages.includes(pathname)) {
      RightComponent = <MemoryImageIcon className='cursor-pointer' />;
    } else if (questionEditPages.includes(pathname)) {
      RightComponent =
        pathname === '/question/[id]' ? (
          <QuestionEditIcon onClick={() => setIsSheetOpen(true)} />
        ) : pathname === '/my-page/anniversary' ? (
          <QuestionEditIcon onClick={() => router.push('/my-page/anniversary/create')} />
        ) : (
          <QuestionEditIcon onClick={() => router.push('/question/create')} />
        );
    } else if (imagePages.includes(pathname)) {
      RightComponent = <MemoryImageIcon className='cursor-pointer' />;
    } else if (nextPages.includes(pathname)) {
      RightComponent = (
        <button className='h-5 text-sm text-[#767676] cursor-pointer' onClick={() => router.push('/account/couple-connect')}>
          건너뛰기
        </button>
      );
    }
  }

  return (
    <>
      <div className='w-full max-w-[412px] h-[56px] relative bg-white border-b border-[#eee] text-[#333333] flex items-center justify-between px-2'>
        <div className='cursor-pointer pl-2'>{IconComponent && <IconComponent onClick={onBack ?? (() => router.back())} />}</div>
        <div className='absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold'>{children}</div>
        <div className='text-right pr-2'>{RightComponent}</div>
      </div>

      {/* 질문 답변, 수정, 삭제 바텀 시트 */}
      <QuestionBottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        hasAnswer={hasAnswer}
        id={id}
        onAnswerDeleted={onAnswerDeleted} // 답변 삭제 콜백 전달
      />
    </>
  );
}
