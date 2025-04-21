import BottomBar from '@/components/shared/BottomBar';
import React from 'react';
import { ReactNode } from 'react';

export default function MyPage() {
  return <div>마이페이지입니당.</div>;
}

MyPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
