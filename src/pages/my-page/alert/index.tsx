import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import React, { ReactNode } from 'react';

export default function AlertPage() {
  return;
}

AlertPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>알림 설정</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
