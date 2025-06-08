import React, { useEffect, useState, ReactNode } from 'react';
import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import NoItemText from '@/components/shared/NoItemText';
import MemoryItem from '@/components/shared/memory/MemoryItem';
import MemoryPolaroidItem1 from '@/components/shared/memory/MemoryPolaroidItem1';
import MemoryPolaroidItem2 from '@/components/shared/memory/MemoryPolaroidItem2';
import MemoryPolaroidItem3 from '@/components/shared/memory/MemoryPolaroidItem3';
import MemoryPolaroidItem4 from '@/components/shared/memory/MemoryPolaroidItem4';
import MemoryPolaroidItem5 from '@/components/shared/memory/MemoryPolaroidItem5';
import { useRouter } from 'next/router';
import { backendUrl } from '@/config/config';

interface Memory {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string | string[];
  position: { x: number; y: number };
  rotation: number;
  memoryDate: string;
  updatedAt: string;
  styleType?: string;
}

interface PreparedMemory {
  _id: string;
  title: string;
  text: string;
  date: string;
  dday: number;
  imageUrl: string;
  position: { x: number; y: number };
  rotation: number;
  border: boolean;
  styleType: string;
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coupleSince, setCoupleSince] = useState<string | null>(null);
  const router = useRouter();

  // 첫 만남 날짜 불러오기
  useEffect(() => {
    async function fetchCoupleSince() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('로그인이 필요합니다.');
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${backendUrl}/firstMet/firstmet`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('첫 만남 날짜 불러오기 실패');

        const data = await res.json();
        const dateString = data.firstMetDate ? data.firstMetDate.split('T')[0] : null;
        setCoupleSince(dateString);
      } catch (error) {
        console.error(error);
        setError('첫 만남 날짜를 불러오는 중 오류가 발생했습니다.');
      }
    }
    fetchCoupleSince();
  }, []);

  // 추억 데이터 불러오기
  useEffect(() => {
    async function fetchMemories() {
      if (!coupleSince) return;

      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('로그인이 필요합니다.');
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${backendUrl}/memory`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('메모리 불러오기 실패');

        const data: Memory[] = await res.json();

        // 최신순 정렬
        const sortedData = data.sort((a, b) => new Date(b.memoryDate).getTime() - new Date(a.memoryDate).getTime());

        setMemories(sortedData);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('추억을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchMemories();
  }, [coupleSince]);

  // 날짜 포맷팅 함수 (yyyy.mm.dd)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  // D-day 계산 함수 (첫 만남 날짜부터 경과 일수 계산)
  const calculateDDay = (firstMetDate: string, targetDate: string) => {
    const first = new Date(firstMetDate);
    const target = new Date(targetDate);
    const diffTime = target.getTime() - first.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // 1일부터 시작
    return diffDays;
  };

  // MemoryItem 또는 MemoryPolaroidItem1에 맞게 데이터 변환
  const prepareMemoryData = (memories: Memory[]): PreparedMemory[] => {
    if (!coupleSince) return [];

    return memories
      .map((memory) => {
        let firstImageUrl = '';

        if (Array.isArray(memory.imageUrl)) {
          firstImageUrl = memory.imageUrl[0] || '';
        } else if (typeof memory.imageUrl === 'string') {
          firstImageUrl = memory.imageUrl;
        }

        return {
          _id: memory._id,
          title: memory.title,
          text: memory.content,
          date: formatDate(memory.memoryDate),
          dday: calculateDDay(coupleSince, memory.memoryDate),
          imageUrl: firstImageUrl,
          position: memory.position,
          rotation: memory.rotation,
          border: true,
          styleType: memory.styleType || 'MemoryItem',
        };
      })
      .sort((a, b) => a.dday - b.dday);
  };

  const preparedMemories = prepareMemoryData(memories);
  const hasMemories = preparedMemories.length > 0;

  const handleMemoryPositionChange = (id: string, newX: number, newY: number, newRotation?: number) => {
    setMemories((prevMemories) =>
      prevMemories.map((memory) =>
        memory._id === id
          ? { ...memory, position: { x: newX, y: newY }, rotation: newRotation !== undefined ? newRotation : memory.rotation }
          : memory
      )
    );
  };

  return (
    <>
      <div className='w-full max-w-[412px] mx-auto h-[calc(100vh-112px)] overflow-y-auto overflow-hidden bg-[#FFD9E1]/35'>
        <div className='relative min-h-full pb-10'>
          {' '}
          {isLoading && <p className='p-4'>로딩 중...</p>}
          {error && <p className='text-red-500 p-4'>{error}</p>}
          {!isLoading && !error && (
            <div className='relative bg-[#FFD9E1]/35'>
              {' '}
              {hasMemories ? (
                preparedMemories.map((memory) => {
                  switch (memory.styleType) {
                    case 'MemoryPolaroidItem1':
                      return (
                        <MemoryPolaroidItem1
                          key={memory._id}
                          data={memory}
                          defaultX={memory.position?.x}
                          defaultY={memory.position?.y}
                          defaultRotation={memory.rotation}
                          onPositionChange={(x, y, rotation) => handleMemoryPositionChange(memory._id, x, y, rotation)}
                          mode='view'
                        />
                      );
                    case 'MemoryPolaroidItem2':
                      return (
                        <MemoryPolaroidItem2
                          key={memory._id}
                          data={memory}
                          defaultX={memory.position?.x}
                          defaultY={memory.position?.y}
                          defaultRotation={memory.rotation}
                          onPositionChange={(x, y, rotation) => handleMemoryPositionChange(memory._id, x, y, rotation)}
                          mode='view'
                        />
                      );
                  }
                })
              ) : (
                <NoItemText title='아직 우리만의 기록이 없어요.' subtitle='작은 순간부터 하나씩, 추억을 쌓아볼까요?' />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

MemoryPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>추억</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
