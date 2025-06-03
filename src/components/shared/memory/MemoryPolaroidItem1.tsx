import React from 'react';
import { HeartIcon } from '@/assets/icons/SvgIcon';
import DraggablePolaroid from '@/components/shared/memory/DraggablePolaroid';
import { backendUrl } from '@/config/config';
import { useRouter } from 'next/router'; // useRouter 임포트

interface MemoryPolaroidItemProps {
  data: {
    _id: string;
    title: string;
    text: string;
    date: string;
    dday: number;
    imageUrl?: string;
    border?: boolean;
    rotation?: number;
  };
  defaultX?: number;
  defaultY?: number;
  defaultRotation?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onPositionChange?: (x: number, y: number, rotation?: number) => void; // 위치 변경 콜백 추가
}

const getImageUrl = (url?: string) => {
  if (!url) return '/images/1.png';
  if (url.startsWith('http')) return url;
  return `${backendUrl}${url}`;
};

export default function MemoryPolaroidItem1({
  data,
  defaultX = 0,
  defaultY = 0,
  defaultRotation = 0,
  onDragStart,
  onDragEnd,
  onPositionChange,
}: MemoryPolaroidItemProps) {
  const router = useRouter(); // useRouter 초기화

  // 위치 저장 API 호출 함수
  const handleUpdate = async (pos: { x: number; y: number; rotation: number }) => {
    try {
      const response = await fetch(`${backendUrl}/memory/location/${data._id}`, {
        // /:id 엔드포인트 사용
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: { x: pos.x, y: pos.y }, // 백엔드에서 position을 객체로 기대
          rotation: pos.rotation, // rotation도 함께 전달
        }),
      });
      if (!response.ok) {
        console.error('위치 저장 실패', await response.text());
      } else {
        console.log('위치 저장 성공');
        console.log('저장 위치:', pos); // 저장하려는 좌표 출력
        // 부모 컴포넌트에 위치 변경 알림
        if (onPositionChange) {
          onPositionChange(pos.x, pos.y, pos.rotation); // 업데이트된 실제 rotation 값 전달
        }
      }
    } catch (error) {
      console.error('위치 저장 중 에러', error);
    }
  };

  // 더블 클릭 핸들러
  const handleDoubleClick = () => {
    router.push(`/memory/${data._id}`);
  };

  return (
    <DraggablePolaroid
      key={`${data._id}-${defaultX}-${defaultY}-${defaultRotation}`}
      defaultX={defaultX}
      defaultY={defaultY}
      defaultRotation={defaultRotation}
      width={280}
      height={490}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onUpdate={handleUpdate} // 위치 저장 함수 전달
    >
      <div
        className='w-[280px] h-[490px] flex flex-col gap-1 items-center py-4 px-4 bg-white'
        onDoubleClick={handleDoubleClick} // 더블 클릭 이벤트 추가
      >
        <div className='w-[248px] h-[414px] flex flex-col gap-4'>
          <div className='w-[248px] h-[330px] bg-[#eeeeee] overflow-hidden'>
            <img src={getImageUrl(data.imageUrl)} alt={data.title} className='w-full h-full object-cover' />
          </div>
          <div className='w-[244px] h-[76px] flex flex-col gap-2 px-0.5 mx-0.5'>
            <span className='h-7 text-xl text-[#333333] font-bold truncate'>{data.title}</span>
            <span className='h-10 text-[#767676] line-clamp-3'>{data.text}</span>
          </div>
        </div>
        <div className='w-auto h-[48px] flex flex-col justify-center items-center self-end px-0.5'>
          <div className='flex flex-row gap-0.5 text-[#FF9BB3] items-center'>
            <HeartIcon className='h-5 w-5' />
            <span className='h-7 text-lg font-bold'>+ {data.dday}</span>
          </div>
          <span className='h-5 text-[#333333]'>{data.date}</span>
        </div>
      </div>
    </DraggablePolaroid>
  );
}
