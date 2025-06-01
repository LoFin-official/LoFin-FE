import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import { BackIcon, CloseIcon, MemoryIcon, MemoryImageIcon, QuestionEditIcon } from '@/assets/icons/SvgIcon';
import QuestionBottomSheet from './question/QuestionBottomSheet';
import { backendUrl } from '@/config/config';

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
  const memoryEditPages = ['/memory/[id]', '/memory/edit'];
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

  const handleSkip = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/wishlist/selection/skip`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`건너뛰기 실패: ${errorData.message}`);
        return;
      }

      router.push('/account/couple-connect');
    } catch (error) {
      console.error('건너뛰기 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

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
        <button className='h-5 text-sm text-[#767676] cursor-pointer' onClick={handleSkip}>
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

      <QuestionBottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        hasAnswer={hasAnswer}
        id={id}
        onAnswerDeleted={onAnswerDeleted}
      />
    </>
  );
}
