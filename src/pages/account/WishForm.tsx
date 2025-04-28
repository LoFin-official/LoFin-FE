import Header from '@/components/shared/Header';
import React, { ReactNode } from 'react';

export default function WishForm() {
  return;
}

WishForm.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>위시리스트</Header>
      {page}
    </>
  );
};
