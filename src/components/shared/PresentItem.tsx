import React from 'react';

interface PresentItemProps {
  sectionTitle: string;
  sectionSubtitle: string;
  items: { label: string; title: string; description: string }[];
}

export default function PresentItem({ sectionTitle, sectionSubtitle, items }: PresentItemProps) {
  return (
    <div>
      {/* 섹션 제목 */}
      <div className='ml-6 text-[#333333] text-xl font-bold '>{sectionTitle}</div>
      {/* 섹션 부제목 */}
      <div className='ml-6 text-[#737373] text-sm font-medium mb-4'>{sectionSubtitle}</div>

      {/* 선물 리스트 */}
      <div className='space-y-4 px-4'>
        {items.map((item, index) => (
          <div
            key={index}
            className='bg-[#ffffff] rounded-[16px] px-6 py-4'
            style={{
              width: '348px',
              paddingBottom: '4px',
            }}
          >
            <div className='text-[#999999] text-sm font-medium mb-0'>{item.label}</div>
            <div className='text-[#333333] text-[18px] font-medium ml-1.5 break-words'>{item.title}</div>
            <div className='text-[#767676] text-sm font-medium mb-4 ml-1.5 break-words'>{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
