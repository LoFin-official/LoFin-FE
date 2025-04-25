import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import React, { ReactNode } from 'react';

export default function ProfilePage() {
  return <div className='bg-[#ffd9e1]/35 min-h-[calc(100vh-112px)]'></div>;
}

ProfilePage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>프로필</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
