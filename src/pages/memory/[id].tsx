import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/shared/Header';
import BottomBar from '@/components/shared/BottomBar';
import NoItemText from '@/components/shared/NoItemText';
import { MemoryDateIcon } from '@/assets/icons/SvgIcon';
import { backendUrl } from '@/config/config';

interface Memory {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string[]; // 여러 이미지 URL 배열
  position: { x: number; y: number };
  rotation: number;
  createdAt: string;
  updatedAt: string;
}

export default function MemoryDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 현재 보여줄 이미지 인덱스 상태
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    async function fetchMemory() {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('로그인이 필요합니다.');
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${backendUrl}/memory/detail/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('추억 상세 불러오기 실패');

        const data = await res.json();
        console.log('받은 데이터:', data);

        // imageUrl이 문자열이거나 배열이 아닐 경우 배열로 강제 변환
        if (data.imageUrl && !Array.isArray(data.imageUrl)) {
          data.imageUrl = [data.imageUrl];
        }

        setMemory(data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError('추억 상세를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMemory();
  }, [id]);

  // memory.imageUrl가 바뀔 때마다 currentIndex 초기화
  useEffect(() => {
    setCurrentIndex(0);
  }, [memory?.imageUrl]);

  // 이전 이미지로 이동
  const prevImage = () => {
    if (!memory?.imageUrl) return;
    setCurrentIndex((prev) => (prev === 0 ? memory.imageUrl!.length - 1 : prev - 1));
  };

  // 다음 이미지로 이동
  const nextImage = () => {
    if (!memory?.imageUrl) return;
    setCurrentIndex((prev) => (prev === memory.imageUrl!.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return <div className='text-center py-20'>로딩중...</div>;
  }

  if (error) {
    return <NoItemText title='오류' subtitle={error} />;
  }

  if (!memory) {
    return <NoItemText title='추억을 찾을 수 없습니다.' subtitle='존재하지 않는 추억입니다.' />;
  }

  return (
    <>
      <div className='flex flex-col h-[calc(100vh-112px)] w-full max-w-[412px] mx-auto px-4 pt-8 pb-4'>
        {/* 제목 영역 */}
        <div className='w-full max-w-[380px] h-9 py-2 px-0.5 border-b border-[#cccccc] mb-4'>
          <h1 className='text-xl font-bold text-[#333333]'>{memory.title}</h1>
        </div>

        {/* 내용 영역 */}
        <div className='flex-grow w-full max-w-[380px]'>
          <div className='w-full max-w-[364px] h-auto mx-2 mb-4'>
            <p className='text-base text-[#767676] whitespace-pre-wrap leading-relaxed'>{memory.content}</p>
          </div>
        </div>

        {/* 하단 고정 영역 */}
        <div className='flex-shrink-0'>
          {/* 이미지 슬라이더 영역 */}
          {memory.imageUrl && memory.imageUrl.length > 0 ? (
            <div className='w-full max-w-[380px] h-[240px] relative mb-4 rounded-md bg-[#eeeeee] overflow-hidden shadow-md flex items-center justify-center'>
              {/* 좌측 버튼 */}
              {memory.imageUrl.length > 1 && (
                <button
                  onClick={prevImage}
                  className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-2 z-10 hover:bg-opacity-50'
                  aria-label='이전 이미지'
                >
                  &#8592;
                </button>
              )}

              {/* 현재 이미지 */}
              <img
                src={`${backendUrl}${memory.imageUrl[currentIndex]}`}
                alt={`memory-${currentIndex}`}
                className='w-full h-full object-cover rounded-md'
              />

              {/* 우측 버튼 */}
              {memory.imageUrl.length > 1 && (
                <button
                  onClick={nextImage}
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-2 z-10 hover:bg-opacity-50'
                  aria-label='다음 이미지'
                >
                  &#8594;
                </button>
              )}

              {/* 이미지 인덱스 표시 */}
              <div className='absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm select-none'>
                {currentIndex + 1} / {memory.imageUrl.length}
              </div>
            </div>
          ) : (
            <div className='w-full max-w-[380px] h-[216px] flex items-center justify-center text-[#999999] mb-4 rounded-md border border-dashed border-[#cccccc]'>
              사진이 없습니다
            </div>
          )}

          {/* 날짜 영역 */}
          <div className='w-full max-w-[380px] h-[52px] px-2 py-4 flex items-center gap-2 text-base text-[#333333]'>
            <MemoryDateIcon />
            <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </>
  );
}

// 페이지 레이아웃 지정 (Header + BottomBar)
MemoryDetailPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>추억 상세페이지</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
