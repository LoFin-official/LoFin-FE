import React from 'react';
import { HeartIcon } from '@/assets/icons/SvgIcon';
import DraggablePolaroid from '@/components/shared/memory/DraggablePolaroid';
import { backendUrl } from '@/config/config';
import { useRouter } from 'next/router';

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
  onPositionChange?: (x: number, y: number, rotation?: number) => void;
  mode?: 'view' | 'edit';
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
  mode = 'view',
}: MemoryPolaroidItemProps) {
  const router = useRouter();

  // 편집 모드일 때는 API 호출하지 않고 부모 컴포넌트에만 알림
  const handleUpdate = async (pos: { x: number; y: number; rotation: number }) => {
    if (mode === 'edit') {
      // 편집 모드에서는 부모 컴포넌트의 draftPositions만 업데이트
      if (onPositionChange) {
        onPositionChange(pos.x, pos.y, pos.rotation);
      }
      return;
    }

    // view 모드에서만 실시간 저장 (기존 로직 유지)
    try {
      const response = await fetch(`${backendUrl}/memory/location/${data._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: { x: pos.x, y: pos.y },
          rotation: pos.rotation,
        }),
      });
      if (!response.ok) {
        console.error('위치 저장 실패', await response.text());
      } else {
        console.log('위치 저장 성공');
        if (onPositionChange) {
          onPositionChange(pos.x, pos.y, pos.rotation);
        }
      }
    } catch (error) {
      console.error('위치 저장 중 에러', error);
    }
  };

  // 클릭 핸들러
  const handleClick = () => {
    if (mode === 'view') {
      router.push(`/memory/${data._id}`);
    }
  };

  return (
    <DraggablePolaroid
      key={`${data._id}-${defaultX}-${defaultY}-${defaultRotation}`}
      defaultX={defaultX}
      defaultY={defaultY}
      defaultRotation={defaultRotation}
      width={172}
      height={197}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onUpdate={handleUpdate}
      mode={mode}
    >
      <div
        className={`w-[172px] h-[197px] flex flex-col gap-1 items-center py-2 px-2 bg-white ${mode === 'view' ? 'cursor-pointer' : 'cursor-move'}`}
        onClick={handleClick}
      >
        <div className='w-[156px] h-[173px]'>
          <div className='w-[156px] h-[138px] bg-[#eeeeee] overflow-hidden'>
            <img src={getImageUrl(data.imageUrl)} alt={data.title} className='w-full h-full object-cover' />
          </div>
        </div>
        <div className='w-auto h-[48px] flex flex-col justify-center items-center self-end px-0.5'>
          <div className='flex flex-row gap-0.5 text-[#FF9BB3] items-center'>
            <HeartIcon className='h-4 w-4' />
            <span className='h-5 font-bold'>+ {data.dday}</span>
          </div>
          <span className='h-4 text-xs text-[#333333]'>{data.date}</span>
        </div>
      </div>
    </DraggablePolaroid>
  );
}
