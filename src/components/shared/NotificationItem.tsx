import React from 'react';
import { useRouter } from 'next/router';
import { AlertOnIcon, AlertOffIcon } from '@/assets/icons/SvgIcon';

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
  // 줄바꿈 문자를 기준으로 분리
  const descriptionLines = processedDescription.split('\n');

  const handleItemClick = () => {
    if (detailPageUrl) {
      router.push(detailPageUrl);
    }
  };

  // 이벤트 버블링을 신경쓰지 않고 토글 버튼만 처리하기 위한 접근법
  const handleToggleIconContainer = (e: React.MouseEvent) => {
    // 아이템 전체 클릭 이벤트(페이지 이동)가 발생하지 않도록 함
    e.stopPropagation();
  };

  return (
    <div
      className='relative w-[380px] h-auto min-h-[80px] px-4 py-3 border-b border-[#EEEEEE] flex items-start cursor-pointer'
      onClick={handleItemClick}
    >
      {/* 텍스트 */}
      <div className='flex flex-col pr-10'>
        <div className='text-[#333333] text-xl font-bold'>{title}</div>
        <div className='text-[#767676] text-base font-medium leading-tight'>
          {descriptionLines.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < descriptionLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 토글 버튼 - 버블링 방지를 위한 컨테이너 */}
      <div className='absolute right-4 top-1/2 transform -translate-y-1/2 z-10' onClick={handleToggleIconContainer}>
        {/* 
          중요: onClick을 직접 onToggle로 설정하여 
          아이콘을 클릭하면 바로 상태가 변경되도록 함
        */}
        {isOn ? <AlertOnIcon onClick={onToggle} /> : <AlertOffIcon onClick={onToggle} />}
      </div>
    </div>
  );
}
