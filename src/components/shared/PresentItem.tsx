import React from 'react';

interface PresentItemProps {
  sectionTitle: string;
  sectionSubtitle: string;
  items: { label: string; title: string; description: string }[];
}

export default function PresentItem({ sectionTitle, sectionSubtitle, items }: PresentItemProps) {
  return (
    <div>
      <div className='flex flex-col gap-[2px] mb-4'>
        {/* 섹션 제목 */}
        <div className='ml-2 text-[#333333] text-xl font-bold '>{sectionTitle}</div>
        {/* 섹션 부제목 */}
        {sectionSubtitle && <div className='ml-2 text-[#767676]'>{sectionSubtitle}</div>}
      </div>

      {/* 선물 리스트 */}
      <div className='flex flex-col gap-4'>
        {items.map((item, index) => (
          <div key={index} className='bg-[#ffffff] rounded-[16px] px-6 py-4 w-full max-w-[348px] mx-auto'>
            <div className='text-[#999999]'>{item.label}</div>
            <div className='text-[#333333] text-lg ml-1 break-words'>{item.title}</div>
            <div className='text-[#767676] ml-1.5 break-words'>{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
