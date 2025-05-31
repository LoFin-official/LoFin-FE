import React from 'react';

interface PresentItemProps {
  sectionTitle: string;
  sectionSubtitle: string;
  items: {
    label: string;
    title: string;
    description: string;
    href?: string; // 🔹 G마켓 링크 (선택)
  }[];
}

export default function PresentItem({ sectionTitle, sectionSubtitle, items }: PresentItemProps) {
  return (
    <div>
      {/* 제목 섹션 */}
      <div className='flex flex-col gap-[2px] mb-4'>
        <div className='ml-2 text-[#333333] text-xl font-bold'>{sectionTitle}</div>
        {sectionSubtitle && <div className='ml-2 text-[#767676]'>{sectionSubtitle}</div>}
      </div>

      {/* 카드 리스트 */}
      <div className='flex flex-col gap-4'>
        {items.map((item, index) => {
          const cardContent = (
            <div className='bg-[#ffffff] rounded-[16px] px-6 py-4 w-full max-w-[348px] mx-auto hover:shadow-md transition'>
              <div className='text-[#999999]'>{item.label}</div>
              <div className='text-[#333333] text-lg ml-1 break-words'>{item.title}</div>
              <div className='text-[#767676] ml-1.5 break-words'>{item.description}</div>
            </div>
          );

          // 🔹 href가 있을 경우 링크로 감싸기
          return item.href ? (
            <a key={index} href={item.href} target='_blank' rel='noopener noreferrer' className='no-underline'>
              {cardContent}
            </a>
          ) : (
            <div key={index}>{cardContent}</div>
          );
        })}
      </div>
    </div>
  );
}
