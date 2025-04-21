import BottomBar from '@/components/shared/BottomBar';
import React from 'react';
import { ReactNode } from 'react';

export default function PresentPage() {
  return <div>선물페이지입니당.</div>;
}

PresentPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
