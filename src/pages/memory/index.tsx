import React, { useEffect, useState, ReactNode } from 'react';
import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import NoItemText from '@/components/shared/NoItemText';

interface Memory {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  position: { x: number; y: number };
  rotation: number;
  createdAt: string;
  updatedAt: string;
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const memberId = '사용자_아이디_또는_토큰에서_추출'; // 실제 사용시 토큰 등에서 memberId를 가져와야 합니다.

  useEffect(() => {
    async function fetchMemories() {
      try {
        const res = await fetch(`http://192.168.35.111:5000/memories/${memberId}`);
        if (!res.ok) throw new Error('메모리 불러오기 실패');
        const data = await res.json();
        setMemories(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMemories();
  }, [memberId]);

  const hasMemories = memories.length > 0;

  return (
    <>
      <div className='w-full max-w-[412px] mx-auto'>
        {hasMemories ? (
          <div>
            {memories.map((memory) => (
              <div key={memory._id}>
                <h3>{memory.title}</h3>
                <p>{memory.content}</p>
                {memory.imageUrl && <img src={memory.imageUrl} alt={memory.title} style={{ maxWidth: '200px' }} />}
                {/* 위치와 회전 정보 */}
                <p>
                  위치: ({memory.position.x}, {memory.position.y})
                </p>
                <p>회전: {memory.rotation}도</p>
              </div>
            ))}
          </div>
        ) : (
          <NoItemText title='아직 우리만의 기록이 없어요.' subtitle='작은 순간부터 하나씩, 추억을 쌓아볼까요?' />
        )}
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
