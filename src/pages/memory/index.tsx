import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import NoItemText from '@/components/shared/NoItemText';
import React from 'react';
import { ReactNode } from 'react';

export default function MemoryPage() {
  const memories = []; // 현재는 비어 있고, 나중에 데이터를 받아오게 될 부분

  const hasMemories = memories.length > 0;
  return (
    <>
      <div>
        {hasMemories ? (
          // 나중에 추억 아이템이 생기면 여기에 컴포넌트 or 리스트를 렌더링
          <div>추억 아이템 리스트 출력 영역</div>
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
