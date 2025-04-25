import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import React from 'react';
import { ReactNode } from 'react';

export default function PresentPage() {
  return;
}

PresentPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>선물 추천</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
