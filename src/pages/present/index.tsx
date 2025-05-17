import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import PresentItem from '@/components/shared/PresentItem';
import React from 'react';
import { ReactNode } from 'react';

export default function PresentPage() {
  const tomFavorites = [
    {
      label: '지갑',
      title: '샤넬 빈티지 카프스킨 카드 지갑',
      description: '톰이 찜했어요!',
    },
    {
      label: '지갑',
      title: '구찌 GG 마몬트 카드 지갑',
      description: '톰이 찜했어요!',
    },
    {
      label: '지갑',
      title: '루이비통 모노그램 카드 지갑 줄이 길 경우 자동으로 줄바꿈',
      description: '톰이 찜했어요!',
    },
  ];

  const otherCoupleFavorites = [
    {
      label: '지갑',
      title: '샤넬 빈티지 카프스킨 카드 지갑',
      description: '요즘 연인들이 많이 찾는 선물이에요.',
    },
    {
      label: '지갑',
      title: '구찌 GG 마몬트 카드 지갑',
      description: '요즘 연인들이 많이 찾는 선물이에요.',
    },
    {
      label: '지갑',
      title: '구찌 GG 마몬트 카드 지갑',
      description: '요즘 연인들이 많이 찾는 선물이에요.',
    },
  ];
  return (
    <div className='min-h-[calc(100vh-112px)] pb-[56px] bg-[#F6F8FA] items-center'>
      <main className='w-full max-w-[412px] mx-auto flex flex-col gap-8 py-8 px-4 md:px-8'>
        {/* 톰이 관심 있어 한 선물 */}
        <PresentItem sectionTitle='톰이 관심 있어 한 선물이에요.' sectionSubtitle='' items={tomFavorites} />

        {/* 다른 연인들이 고른 선물 */}
        <PresentItem
          sectionTitle='다른 연인들이 고른 선물, 함께 확인해보세요.'
          sectionSubtitle='다른 연인들의 선택을 보고, 당신만의 선물을 찾으세요!'
          items={otherCoupleFavorites}
        />
      </main>
    </div>
  );
}

PresentPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>선물 추천</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
