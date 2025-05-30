import React, { useEffect, useState, ReactNode } from 'react';
import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import NoItemText from '@/components/shared/NoItemText';
import MemoryItem from '@/components/shared/memory/MemoryItem';
import { useRouter } from 'next/router';
import { backendUrl } from '@/config/config';

interface Memory {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string | string[]; // 단일 또는 배열 가능
  position: { x: number; y: number };
  rotation: number;
  createdAt: string;
  updatedAt: string;
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coupleSince, setCoupleSince] = useState<string | null>(null); // 첫 만남 날짜
  const router = useRouter();

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('첫 만남 날짜 불러오기 실패');

        const data = await res.json();

        // 서버에서 날짜가 ISO 문자열이면 날짜 부분만 가져오기
        const dateString = data.firstMetDate ? data.firstMetDate.split('T')[0] : null;
        setCoupleSince(dateString);
      } catch (error) {
        console.error(error);
        setError('첫 만남 날짜를 불러오는 중 오류가 발생했습니다.');
      }
    }

    fetchCoupleSince();
  }, []);

  useEffect(() => {
    async function fetchMemories() {
      if (!coupleSince) return; // 첫 만남 날짜를 먼저 받아야 함

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('메모리 불러오기 실패');

        const data = await res.json();

        // 날짜 기준 최신순 정렬
        const sortedData = data.sort((a: Memory, b: Memory) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  // D-day 계산 함수 (첫 만남 날짜와 메모리 날짜 차이)
  const calculateDDay = (firstMetDate: string, targetDate: string) => {
    const first = new Date(firstMetDate);
    const target = new Date(targetDate);

    const firstWithoutTime = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    const targetWithoutTime = new Date(target.getFullYear(), target.getMonth(), target.getDate());

    const diffTime = Math.abs(targetWithoutTime.getTime() - firstWithoutTime.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // MemoryItem에 맞게 데이터 변환
  const prepareMemoryData = (memories: Memory[]) => {
    if (!coupleSince) return [];

    const prepared = memories.map((memory) => {
      let firstImageUrl = '';

      if (Array.isArray(memory.imageUrl)) {
        firstImageUrl = memory.imageUrl[0] || '';
      } else if (typeof memory.imageUrl === 'string') {
        firstImageUrl = memory.imageUrl;
      }

      return {
        title: memory.title,
        text: memory.content,
        date: formatDate(memory.createdAt),
        dday: calculateDDay(coupleSince, memory.createdAt),
        imageUrl: firstImageUrl, // 첫 번째 이미지 URL만 전달
        _id: memory._id,
        position: memory.position,
        rotation: memory.rotation,
        original: memory,
        border: true,
      };
    });

    prepared.sort((a, b) => a.dday - b.dday);

    return prepared;
  };

  const hasMemories = memories.length > 0;

  return (
    <>
      <div className='w-full max-w-[412px] mx-auto py-14 '>
        {hasMemories ? (
          <div>
            <MemoryItem memories={prepareMemoryData(memories)} />
          </div>
        ) : (
          <NoItemText title='아직 우리만의 기록이 없어요.' subtitle='작은 순간부터 하나씩, 추억을 쌓아볼까요?' />
        )}
      </div>
    </>
  );
}

// 페이지 레이아웃 지정 (Header + BottomBar)
MemoryPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>추억</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
