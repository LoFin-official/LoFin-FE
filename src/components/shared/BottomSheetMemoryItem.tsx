import React, { ReactNode } from 'react';
import BottomSheet from './BottomSheet';
import SwipeSlider from './SwipeSlider';
import MemoryPolaroidItem1 from './memory/MemoryPolaroidItem1';
import MemoryPolaroidItem2 from './memory/MemoryPolaroidItem2';

interface BottomSheetMemoryItemProps {
  className?: string;
  children?: ReactNode;
  isOpen: boolean;
  height: string;
  onClose: () => void;
  onSelectComponent: (Component: any) => void;
}

const memoryItems = [
  {
    id: '1',
    title: '첫 만남',
    text: '처음 본 날의 기억',
    date: '2024.08.15',
    dday: 150,
  },
  {
    id: '2',
    title: '첫 만남',
    text: '처음 본 날의 기억',
    date: '2024.08.15',
    dday: 150,
  },
];

const memoryPolaroidComponents = [MemoryPolaroidItem1, MemoryPolaroidItem2];

export default function BottomSheetMemoryItem({ className, isOpen, onClose, onSelectComponent }: BottomSheetMemoryItemProps) {
  const memoryItemComponents = memoryItems.map((item, index) => {
    const Component = memoryPolaroidComponents[index % memoryPolaroidComponents.length];
    return (
      <Component
        key={item.id}
        data={{
          _id: item.id.toString(),
          title: item.title,
          text: item.text,
          date: item.date,
          dday: item.dday,
        }}
        defaultX={0}
        defaultY={0}
        defaultRotation={0}
      />
    );
  });

  const handleSelect = (index: number) => {
    const SelectedComponent = memoryPolaroidComponents[index];
    onSelectComponent(SelectedComponent);
    onClose();
  };

  return (
    <BottomSheet height={'492px'} className={className} isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col gap-4 px-4 py-8 bg-[#FFD9E1]/35 rounded-t-xl'>
        <div className='flex flex-col w-full max-w-[380px] h-[46px] mx-auto gap-0.5 items-center'>
          <div className='h-6 text-[#333333] text-xl font-bold'>이 순간, 어떤 모습으로 남기고 싶나요?</div>
          <div className='h-5 text-[#767676]'>폴라로이드 사진은 화면 속에서 직접 배치할 수 있어요!</div>
        </div>
        {/* 가로 스크롤 캐러셀 */}
        <SwipeSlider items={memoryItemComponents} onSelect={handleSelect} />
      </div>
    </BottomSheet>
  );
}
