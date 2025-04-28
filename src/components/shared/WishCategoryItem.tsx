import React from 'react';

export default function WishCategoryItem() {
  return (
    <>
      <div className='flex w-[388px] h-[368px] border-[#eeeeee] border-b border-t items-center justify-center'>
        <div className='flex flex-row w-[380px] h-[336px]'>
          <div className='w-[80px] h-full bg-[#eeeeee]'>
            <div className='flex flex-col w-full h-9 justify-center items-center bg-[#ffffff]'>
              <span className='h-5 text-center text-[#333333]'>패션 & 악세</span>
            </div>
            <div className='flex flex-col w-full h-9 justify-center items-center'>
              <span className='h-5 text-center text-[#999999]'>뷰티 & 향기</span>
            </div>
            <div className='flex flex-col w-full h-9 justify-center items-center'>
              <span className='h-5 text-center text-[#999999]'>정성</span>
            </div>
            <div className='flex flex-col w-full h-9 justify-center items-center'>
              <span className='h-5 text-center text-[#999999]'>전자기기</span>
            </div>
          </div>
          <div className='flex flex-col gap-8 w-[300px] h-full px-4 py-4'>
            <div className='flex flex-col gap-4 w-[268px] h-auto'>
              <div className='h-5'>
                <span className='text-base font-bold text-[#333333]'>패션</span>
              </div>
              <div className='flex flex-row flex-wrap gap-2 w-[250px] h-auto self-end ml-auto'>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>모자</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>자켓</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>상의</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>하의</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>신발</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>가방</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>목도리</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>장갑</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>귀마개</span>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-4 w-[268px] h-auto'>
              <div className='h-5'>
                <span className='text-base font-bold text-[#333333]'>악세서리</span>
              </div>
              <div className='flex flex-row flex-wrap gap-2 w-[250px] h-auto self-end ml-auto'>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>반지</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>목걸이</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>팔찌</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>귀걸이</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>시계</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>키링</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>브로치</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>지갑</span>
                </div>
                <div className='flex flex-col gap-2 w-[78px] h-[28px] justify-center items-center'>
                  <span className='h-5 text-[#333333] text-center'>헤어핀</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
