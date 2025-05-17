import React from 'react';

interface QuestionTabsProps {
  selectedTab: 'direct' | 'random';
  onSelectTab: (tab: 'direct' | 'random') => void;
  className?: string;
}

export default function QuestionTabs({ selectedTab, onSelectTab, className = '' }: QuestionTabsProps) {
  return (
    <div className={`w-full max-w-[412px] h-[56px] relative ${className}`}>
      {/* 탭 내용 */}
      <div className='flex justify-between items-center w-full h-[52px] px-24 py-[5px]'>
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
      <div className='w-full h-[1px] bg-[#CCCCCC]' />

      {/* 선택된 탭 하이라이트 라인 */}
      <div className='relative'>
        <div
          className={`
          absolute w-[74px] h-0.5 bg-[#333333] transition-all duration-300 mt-[-2px]
          ml-[88px]            // 기본 (작은 화면, 앱일 가능성 높음)
          md:ml-[88px]          // 중간 이상 화면일 때 (웹 등)
          ${selectedTab === 'direct' ? '' : 'translate-x-[110px] md:translate-x-[162px]'}
        `}
        />
      </div>
    </div>
  );
}
