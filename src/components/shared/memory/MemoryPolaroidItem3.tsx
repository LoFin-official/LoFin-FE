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
}

const getImageUrl = (url?: string) => {
  if (!url) return '/images/1.png';
  if (url.startsWith('http')) return url;
  return `${backendUrl}${url}`;
};

export default function MemoryPolaroidItem3({
  data,
  defaultX = 0,
  defaultY = 0,
  defaultRotation = 0,
  onDragStart,
  onDragEnd,
  onPositionChange,
}: MemoryPolaroidItemProps) {
  const router = useRouter();

  const handleUpdate = async (pos: { x: number; y: number; rotation: number }) => {
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
        console.log('저장 위치:', pos);
        if (onPositionChange) {
          onPositionChange(pos.x, pos.y, pos.rotation);
        }
      }
    } catch (error) {
      console.error('위치 저장 중 에러', error);
    }
  };

  const handleDoubleClick = () => {
    router.push(`/memory/${data._id}`);
  };

  return (
    <DraggablePolaroid
      key={`${data._id}-${defaultX}-${defaultY}-${defaultRotation}`}
      defaultX={defaultX}
      defaultY={defaultY}
      defaultRotation={defaultRotation}
      width={332}
      height={468}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onUpdate={handleUpdate}
    >
      <div className='w-[332px] h-[468px] flex flex-col gap-1 items-center py-4 px-4 bg-white' onDoubleClick={handleDoubleClick}>
        {/* 사진 영역 */}
        <div className='w-[300px] h-[384px] flex flex-col gap-4'>
          <div className='w-[300px] h-[300px] bg-[#eeeeee] overflow-hidden'>
            <img src={getImageUrl(data.imageUrl)} alt='memory' className='w-full h-full object-cover' />
          </div>
          <div className='w-[296px] h-[76px] flex flex-col gap-2 px-0.5 mx-0.5'>
            <span className='h-7 text-xl text-[#333333] font-bold truncate'>{data.title}</span>
            <span className='h-10 text-[#767676] line-clamp-3'>{data.text}</span>
          </div>
        </div>

        {/* 좋아요 & 날짜 영역 */}
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
