import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import React, { ReactNode } from 'react';

export default function WishPage() {
  return;
}

WishPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>위시리스트</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
