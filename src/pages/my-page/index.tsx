import { AlertIcon, HeartIcon, WishIcon } from '@/assets/icons/SvgIcon';
import BottomBar from '@/components/shared/BottomBar';
import ProfileItem from '@/components/shared/ProfileItem';
import React from 'react';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';

export default function MyPage() {
  const router = useRouter();

  return (
    <div className='flex flex-col gap-4 bg-[#ffd9e1]/35 min-h-[calc(100vh-56px)] items-center'>
      <div className='h-8 px-6 pt-4 mb-8 flex flex-row font-bold items-center justify-between w-full max-w-[380px]'>
        <span className='text-[#333333] text-2xl'>마이페이지</span>
        <span className='text-[#FF9BB3] text-lg'>DDay</span>
      </div>
      <div className='flex flex-col gap-4'>
        <ProfileItem type='profile'></ProfileItem>
      </div>
      <div className='w-[380px] h-[124px] bg-[#ffffff] rounded-[18px] py-6 items-center'>
        <div className='flex flex-row gap-8 justify-center'>
          <div className='flex flex-col gap-4 w-[78px] text-[#FF9BB3] text-lg cursor-pointer items-center'>
            <WishIcon onClick={() => router.push('/my-page/wish')} />
            위시리스트
          </div>
          <div
            className='flex flex-col gap-4 w-[78px] text-[#FF9BB3] text-lg cursor-pointer items-center'
            onClick={() => router.push('/my-page/anniversary')}
          >
            <HeartIcon className='w-8 h-8' />
            기념일
          </div>
          <div className='flex flex-col gap-4 w-[78px] text-[#FF9BB3] text-lg cursor-pointer items-center'>
            <AlertIcon onClick={() => router.push('/my-page/alert')} />
            알림
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2 w-[348px] h-12 text-base'>
        <div className='h-5 text-right mr-auto text-[#767676] cursor-pointer'>로그아웃</div>
        <div className='h-5 text-left ml-auto text-[#CCCCCC] cursor-pointer'>회원탈퇴</div>
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
