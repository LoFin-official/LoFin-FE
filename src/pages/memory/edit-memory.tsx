import React, { useEffect, useState, ReactNode } from 'react';
import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import NoItemText from '@/components/shared/NoItemText';
import MemoryPolaroidItem1 from '@/components/shared/memory/MemoryPolaroidItem1';
import MemoryPolaroidItem2 from '@/components/shared/memory/MemoryPolaroidItem2';
import { fetchMemoriesFromAPI, prepareMemoryData } from '@/utils/memoryUtils';
import type { Memory, PreparedMemory } from '@/utils/memoryUtils';
import { backendUrl } from '@/config/config';

// 임시 위치 정보를 저장할 타입
interface DraftPosition {
  x: number;
  y: number;
  rotation: number;
}

export default function EditMemoryPage() {
  const [memories, setMemories] = useState<PreparedMemory[]>([]);
  // 임시 위치 정보를 저장하는 상태 (메모리 ID를 키로 사용)
  const [draftPositions, setDraftPositions] = useState<Record<string, DraftPosition>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coupleSince, setCoupleSince] = useState<string | null>(null);

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
    const loadMemories = async () => {
      if (!coupleSince) return;

      try {
        setIsLoading(true);
        const rawMemories = await fetchMemoriesFromAPI();
        const preparedMemories = prepareMemoryData(rawMemories, coupleSince);
        setMemories(preparedMemories);

        // 초기 위치를 draftPositions에도 설정
        const initialDraftPositions: Record<string, DraftPosition> = {};
        preparedMemories.forEach((memory) => {
          initialDraftPositions[memory._id] = {
            x: memory.position?.x || 0,
            y: memory.position?.y || 0,
            rotation: memory.rotation || 0,
          };
        });
        setDraftPositions(initialDraftPositions);

        setError(null);
      } catch (error) {
        console.error(error);
        setError('추억 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMemories();
  }, [coupleSince]);

  // 저장 함수 - draftPositions의 값을 서버에 저장
  // 저장 함수 - draftPositions의 값을 서버에 저장
  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('token');
    try {
      for (const memory of memories) {
        const draftPosition = draftPositions[memory._id];
        if (draftPosition) {
          // MemoryPolaroidItem1에서 사용하던 엔드포인트와 동일하게 변경
          const response = await fetch(`${backendUrl}/memory/location/${memory._id}`, {
            method: 'PATCH', // PUT에서 PATCH로 변경
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              position: { x: draftPosition.x, y: draftPosition.y },
              rotation: draftPosition.rotation,
            }),
          });

          if (!response.ok) {
            console.error('위치 저장 실패', await response.text());
            throw new Error('위치 저장 실패');
          }
        }
      }

      // 저장 성공 후 memories 상태도 업데이트
      setMemories((prevMemories) =>
        prevMemories.map((memory) => {
          const draftPosition = draftPositions[memory._id];
          if (draftPosition) {
            return {
              ...memory,
              position: { x: draftPosition.x, y: draftPosition.y },
              rotation: draftPosition.rotation,
            };
          }
          return memory;
        })
      );

      alert('위치가 저장되었습니다.');
    } catch (e) {
      console.error(e);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 임시 위치 변경 함수 - 드래그 중에는 draftPositions만 업데이트
  const handleMemoryPositionChange = (id: string, newX: number, newY: number, newRotation?: number) => {
    setDraftPositions((prev) => ({
      ...prev,
      [id]: {
        x: newX,
        y: newY,
        rotation: newRotation !== undefined ? newRotation : prev[id]?.rotation || 0,
      },
    }));
  };

  // 변경사항이 있는지 확인하는 함수
  const hasChanges = () => {
    return memories.some((memory) => {
      const draft = draftPositions[memory._id];
      if (!draft) return false;

      const original = {
        x: memory.position?.x || 0,
        y: memory.position?.y || 0,
        rotation: memory.rotation || 0,
      };

      return draft.x !== original.x || draft.y !== original.y || draft.rotation !== original.rotation;
    });
  };

  const renderMemoryItem = (memory: PreparedMemory) => {
    // draftPositions에서 현재 위치를 가져오기
    const currentPosition = draftPositions[memory._id] || {
      x: memory.position?.x || 0,
      y: memory.position?.y || 0,
      rotation: memory.rotation || 0,
    };

    switch (memory.styleType) {
      case 'MemoryPolaroidItem1':
        return (
          <MemoryPolaroidItem1
            key={memory._id}
            data={memory}
            defaultX={currentPosition.x}
            defaultY={currentPosition.y}
            defaultRotation={currentPosition.rotation}
            onPositionChange={(x, y, rotation) => handleMemoryPositionChange(memory._id, x, y, rotation)}
            mode='edit'
          />
        );
      case 'MemoryPolaroidItem2':
        return (
          <MemoryPolaroidItem2
            key={memory._id}
            data={memory}
            defaultX={currentPosition.x}
            defaultY={currentPosition.y}
            defaultRotation={currentPosition.rotation}
            onPositionChange={(x, y, rotation) => handleMemoryPositionChange(memory._id, x, y, rotation)}
            mode='edit'
          />
        );
    }
  };

  return (
    <div className='w-full max-w-[412px] mx-auto h-[calc(100vh-112px)] overflow-y-auto bg-[#FBEFF2]'>
      <div className='relative min-h-full pb-10'>
        {!isLoading && !error && (
          <>
            {memories.length > 0 ? (
              memories.map(renderMemoryItem)
            ) : (
              <NoItemText title='아직 우리만의 기록이 없어요.' subtitle='작은 순간부터 하나씩, 추억을 쌓아볼까요?' />
            )}

            {memories.length > 0 && (
              <div className='fixed bottom-24 left-1/2 transform -translate-x-1/2 flex gap-3 z-10'>
                <button
                  className={`text-white px-6 py-3 rounded-lg shadow-lg ${
                    hasChanges() ? 'bg-pink-400 hover:bg-pink-500' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges()}
                >
                  {isSaving ? '저장 중...' : '변경사항 저장'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

EditMemoryPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>추억 편집</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
