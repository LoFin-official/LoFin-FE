import { ForwardIcon } from '@/assets/icons/SvgIcon';
import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className='flex flex-col gap-4 pt-4 bg-[#ffd9e1]/35 min-h-[calc(100vh-112px)] items-center pb-[72px]'>
      <div className='flex flex-col gap-4 w-[380px] h-[296px] bg-[#FFFFFF] rounded-[18px] px-6 py-6 items-center'>
        {/* 내 프로필 */}
        <span className='h-6 text-xl font-bold text-[#333333] self-start'>내 프로필</span>

        {/* 프로필 이미지 */}
        <div className='w-[120px] h-[120px] rounded-full bg-[#CCCCCC]'></div>

        {/* 닉네임 */}
        <div className='flex flex-row justify-between items-center w-full cursor-pointer' onClick={() => router.push('/my-page/profile/edit')}>
          <span className='text-lg text-[#333333]'>닉네임</span>
          <div className='flex flex-row gap-2 items-center'>
            <span className='text-lg text-[#999999]'>제리</span>
            <ForwardIcon />
          </div>
        </div>

        {/* 생년월일 */}
        <div className='flex flex-row justify-between items-center w-full cursor-pointer' onClick={() => router.push('/my-page/profile/edit')}>
          <span className='text-lg text-[#333333]'>생년월일</span>
          <div className='flex flex-row gap-2 items-center'>
            <span className='text-lg text-[#999999]'>1940. 02. 10.</span>
            <ForwardIcon />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4 w-[380px] h-[296px] bg-[#FFFFFF] rounded-[18px] px-6 py-6 items-center'>
        {/* 애인 프로필 */}
        <span className='h-6 text-xl font-bold text-[#333333] self-start'>애인 프로필</span>

        {/* 프로필 이미지 */}
        <div className='w-[120px] h-[120px] rounded-full bg-[#CCCCCC]'></div>

        {/* 닉네임 */}
        <div className='flex flex-row justify-between items-center w-full'>
          <span className='text-lg text-[#333333]'>닉네임</span>
          <span className='text-lg text-[#999999]'>톰</span>
        </div>

        {/* 생년월일 */}
        <div className='flex flex-row justify-between items-center w-full'>
          <span className='text-lg text-[#333333]'>생년월일</span>
          <span className='text-lg text-[#999999]'>1940. 02. 10.</span>
        </div>
      </div>
      <div className='flex flex-col gap-4 w-[380px] h-[116px] bg-[#FFFFFF] rounded-[18px] py-6 px-6 items-center'>
        <span className='h-6 text-xl font-bold text-[#333333] self-start'>커플 정보</span>
        <div className='flex flex-row justify-between items-center w-full cursor-pointer'>
          <span className='text-lg text-[#333333]'>첫 만남</span>
          <div className='flex flex-row gap-2 items-center' onClick={() => router.push('/my-page/profile/couple-edit')}>
            <span className='text-lg text-[#999999]'>2025. 02. 08.</span>
            <ForwardIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

ProfilePage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>프로필</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
