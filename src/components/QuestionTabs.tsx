import React from 'react';

interface QuestionTabsProps {
  selectedTab: 'direct' | 'random';
  onSelectTab: (tab: 'direct' | 'random') => void;
  className?: string;
}

export default function QuestionTabs({ selectedTab, onSelectTab, className = '' }: QuestionTabsProps) {
  return (
    <div className={`w-[412px] h-[56px] relative ${className}`}>
      {/* 탭 내용 */}
      <div className='flex justify-between items-center w-full h-[48px] px-24 py-[5px]'>
        <button
          onClick={() => onSelectTab('direct')}
          className={`text-base font-medium leading-9 transition-colors duration-200 ${
            selectedTab === 'direct' ? 'text-[#333333]' : 'text-[#999999]'
          }`}
        >
          직접 질문
        </button>
        <button
          onClick={() => onSelectTab('random')}
          className={`text-base font-medium leading-9 transition-colors duration-200 ${
            selectedTab === 'random' ? 'text-[#333333]' : 'text-[#999999]'
          }`}
        >
          랜덤 질문
        </button>
      </div>

      {/* 하단 전체 라인 */}
      <div className='w-full h-[1px] bg-[#CCCCCC] mt-1' />

      {/* 선택된 탭 하이라이트 라인 */}
      <div className='relative'>
        <div
          className={`absolute w-[74px] h-0.5 bg-[#333333] transition-all duration-300 mt-[-2px] ${selectedTab === 'direct' ? 'ml-[88px]' : 'ml-[250px]'}`}
        />
      </div>
    </div>
  );
}
