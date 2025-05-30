import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';

interface SwipeSliderProps {
  items: React.ReactNode[];
  onSelect: (selectedIndex: number) => void;
}

export default function SwipeSlider({ items, onSelect }: SwipeSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 터치 위치 기록용
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // 다음 이미지 이동
  const nextItem = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prevItem = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      const threshold = 50;
      if (diff > threshold) nextItem();
      else if (diff < -threshold) prevItem();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevItem();
      if (e.key === 'ArrowRight') nextItem();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (!items.length) return null;

  return (
    <>
      <div
        className='w-full max-w-[400px] min-h-[530px] relative rounded-md flex items-center justify-center'
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* 이전 버튼 */}
        {items.length > 1 && (
          <button
            onClick={prevItem}
            className='w-8 h-8 absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full z-10 hover:bg-black/50 transition-colors'
            aria-label='이전 항목'
          >
            &#8592;
          </button>
        )}

        {/* 메인 콘텐츠 */}
        <div className='w-full h-full flex items-center justify-center pointer-events-none'>{items[currentIndex]}</div>

        {/* 다음 버튼 */}
        {items.length > 1 && (
          <button
            onClick={nextItem}
            className='w-8 h-8 absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full z-10 hover:bg-black/50 transition-colors'
            aria-label='다음 항목'
          >
            &#8594;
          </button>
        )}
      </div>
      <Button isComplete onClick={() => onSelect(currentIndex)}>
        선택하기
      </Button>
    </>
  );
}
