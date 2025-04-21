import BottomBar from '@/components/shared/BottomBar';
import React from 'react';
import { ReactNode } from 'react';

export default function MemoryPage() {
  return <div>추억페이지입니당.</div>;
}

MemoryPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
