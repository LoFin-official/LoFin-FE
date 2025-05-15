import React from 'react';
import { useRouter } from 'next/router';

interface NotificationItemProps {
  title: string;
  description: string;
  isOn: boolean;
  onToggle: () => void;
  detailPageUrl?: string;
}

export default function NotificationItem({ title, description, isOn, onToggle, detailPageUrl }: NotificationItemProps) {
  const router = useRouter();

  // '\n' 문자열을 실제 줄바꿈으로 변환
  const processedDescription = description.replace(/\\n/g, '\n');
  const descriptionLines = processedDescription.split('\n');

  const handleItemClick = () => {
    if (detailPageUrl) {
      router.push(detailPageUrl);
    }
  };

  return (
    <div
      className='relative w-full h-auto min-h-[80px] px-2 py-3 border-b border-[#eeeeee] flex items-start cursor-pointer'
      onClick={handleItemClick}
    >
      {/* 텍스트 */}
      <div className='flex flex-col'>
        <div className='text-[#333333] text-xl font-bold mb-1'>{title}</div>
        <div className='text-[#767676] text-base font-medium leading-tight ml-1'>
          {descriptionLines.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < descriptionLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 토글 버튼 컨테이너 - 크기 축소 (버튼 크기에 맞게 조정됨) */}
      <div
        className='absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-[49px] h-[30px] rounded-full p-0.5 cursor-pointer'
        style={{
          backgroundColor: isOn ? '#FF7A99' : '#999999',
          transition: 'background-color 0.3s ease',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        {/* 슬라이딩 원형 버튼 - 5x5로 축소 */}
        <div
          className='w-4 h-4 bg-[#ffffff] rounded-full shadow-md'
          style={{
            transform: isOn ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform 0.3s ease',
            marginTop: '5px', // 세로 중앙 정렬 보정
            marginLeft: '5px',
          }}
        />
      </div>
    </div>
  );
}
