import React, { ReactNode, useEffect, useState } from 'react';

interface BottomSheetProps {
  className?: string;
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  height?: string;
}

export default function BottomSheet({ className = '', children, isOpen, onClose, height = '354px' }: BottomSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 먼저 요소를 보이게 하고
      setIsVisible(true);
      // 다음 프레임에서 애니메이션 시작
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      // 닫을 때는 애니메이션 먼저 실행
      setIsAnimating(false);
      // 애니메이션 완료 후 요소 숨김
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 바텀시트가 보이지 않을 때는 렌더링하지 않음
  if (!isVisible && !isOpen) {
    return null;
  }

  return (
    <div className={`fixed inset-0 flex justify-center items-end z-50 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      {/* 뒷배경 */}
      <div
        className={`absolute w-[412px] h-full bg-[#1b1b1b] transition-opacity duration-300 ${isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'}`}
        onClick={onClose}
      ></div>

      {/* 바텀시트 */}
      <div
        style={{ height }}
        className={`relative max-w-[412px] w-full rounded-t-xl bg-[#ffffff] z-10 transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
