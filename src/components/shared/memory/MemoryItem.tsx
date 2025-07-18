import { HeartIcon } from '@/assets/icons/SvgIcon';
import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { backendUrl } from '@/config/config';

interface Memory {
  title: string;
  text: string;
  date: string;
  dday: number;
  imageUrl?: string;
  _id: string;
  position?: { x: number; y: number };
  rotation?: number;
  border?: boolean;
}

interface MemoryItemProps {
  memories: Memory[];
  onDelete?: (id: string) => void;
}

// 이미지 URL을 올바르게 가져오는 헬퍼 함수
const getImageUrl = (url?: string) => {
  if (!url) return '/images/1.png'; // 기본 이미지 경로
  if (url.startsWith('http')) return url; // 이미 완전한 URL인 경우 그대로 반환
  return `${backendUrl}${url}`; // 상대 경로인 경우 backendUrl을 앞에 붙여 반환
};

export default function MemoryItem({ memories, onDelete }: MemoryItemProps) {
  const router = useRouter();

  // 메모리 상세 페이지로 이동
  const handleMemoryClick = (id: string) => {
    router.push(`/memory/${id}`);
  };

  return (
    <>
      {memories.map((item: Memory, index: number) => (
        <div
          key={item._id}
          className={`w-[388px] h-[336px] flex gap-0.5 items-center my-4 mx-3 ${index % 2 === 1 ? 'flex-row-reverse' : 'flex-row'}`}
          onClick={() => handleMemoryClick(item._id)}
        >
          {/* 사진 영역 */}
          <div className={`w-[296px] h-[336px] flex flex-col gap-2 rounded-[18px] p-4 bg-white ${item.border ? 'border border-[#FF4C80]' : ''}`}>
            <div className='w-[264px] h-[252px] rounded-[18px] bg-[#eeeeee] overflow-hidden'>
              {item.imageUrl ? (
                // getImageUrl 헬퍼 함수를 사용하여 이미지 src 설정
                <img src={getImageUrl(item.imageUrl)} alt={item.title} className='w-full h-full object-cover' />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-[#999999]'>사진이 없습니다</div>
              )}
            </div>
            <div className='w-[256px] h-[52px] flex flex-col gap-1 px-1'>
              <span className='h-7 text-xl text-[#333333] font-bold truncate'>{item.title}</span>
              <span className='h-5 text-[#767676] truncate'>{item.text}</span>
            </div>
          </div>

          {/* 좋아요 & 날짜 영역 */}
          <div className='w-[90px] h-[48px] flex flex-col justify-center items-center'>
            <div className='flex flex-row gap-0.5 text-[#FF9BB3] items-center'>
              <HeartIcon className='h-5 w-5' />
              <span className='h-7 text-lg font-bold'>+ {item.dday}</span>
            </div>
            <span className='h-5 text text-[#333333]'>{item.date}</span>
          </div>
        </div>
      ))}
    </>
  );
}
