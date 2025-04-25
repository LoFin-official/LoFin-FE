import Header from '@/components/shared/Header';
import React, { ReactNode } from 'react';

export default function CoupleConnectPage() {
  return;
}

CoupleConnectPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>커플 연결</Header>
      {page}
    </>
  );
};
