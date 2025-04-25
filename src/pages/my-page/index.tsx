import BottomBar from '@/components/shared/BottomBar';
import ProfileItem from '@/components/shared/ProfileItem';
import React from 'react';
import { ReactNode } from 'react';

export default function MyPage() {
  return (
    <div className='bg-[#ffd9e1]/35 min-h-[calc(100vh-56px)]'>
      <div className='h-8 px-6 pt-2 mb-8 flex flex-row font-bold items-center'>
        <span className='flex-1 text-left text-[#333333] text-2xl'>마이페이지</span>
        <span className='flex-1 text-right text-[#FF9BB3] text-lg'>DDay</span>
      </div>
      <div className='flex flex-col gap-4'>
        <ProfileItem type='profile'></ProfileItem>
      </div>
    </div>
  );
}

MyPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
