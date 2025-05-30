import React, { ReactNode } from 'react';
import BottomSheet from './BottomSheet';
import SwipeSlider from './SwipeSlider';
import MemoryPolaroidItem1 from './memory/MemoryPolaroidItem1';
import MemoryPolaroidItem2 from './memory/MemoryPolaroidItem2';
import MemoryPolaroidItem3 from './memory/MemoryPolaroidItem3';
import MemoryPolaroidItem4 from './memory/MemoryPolaroidItem4';
import MemoryPolaroidItem5 from './memory/MemoryPolaroidItem5';

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
    id: 1,
    title: '제주도 여행',
    text: '우도에서 찍은 사진',
    date: '2025.05.25',
    dday: 150,
  },
  {
    id: 2,
    title: '첫 만남',
    text: '처음 본 날의 기억',
    date: '2024.08.15',
    dday: 300,
  },
  {
    id: 3,
    title: '카페 데이트',
    text: '딸기 케이크 맛있었지',
    date: '2025.01.12',
    dday: 200,
  },
  {
    id: 4,
    title: '영화관 데이트',
    text: '재밌던 영화 기억나?',
    date: '2025.02.14',
    dday: 180,
  },
  {
    id: 5,
    title: '놀이공원',
    text: '후렌치 후라이 최고!',
    date: '2025.04.01',
    dday: 90,
  },
];

const memoryPolaroidComponents = [MemoryPolaroidItem1, MemoryPolaroidItem2, MemoryPolaroidItem3, MemoryPolaroidItem4, MemoryPolaroidItem5];

export default function BottomSheetMemoryItem({ className, isOpen, onClose, onSelectComponent }: BottomSheetMemoryItemProps) {
  const memoryItemComponents = memoryItems.map((item, index) => {
    const Component = memoryPolaroidComponents[index % memoryPolaroidComponents.length];
    return (
      <Component
        key={item.id}
        data={{
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
    <BottomSheet height={'680px'} className={className} isOpen={isOpen} onClose={onClose}>
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
