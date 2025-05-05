import Button from '@/components/shared/Button';
import Image from 'next/image';
import { ReactNode } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className='flex flex-col items-center justify-center gap-16 min-h-[calc(100vh-148px)]'>
        <div className='flex flex-col gap-8 items-center'>
          <div className='whitespace-pre-line text-[#333333] text-5xl font-bold text-center'>연인 추억 저장소</div>
          <Image src='/images/LoFin.png' alt='LoFin' width={300} height={300} />
        </div>
      </div>
      <div className='flex flex-col gap-4 items-center justify-center'>
        <div className='flex-grow'></div>
        <Link href='/account/login'>
          <Button isComplete={true}>로그인</Button>
        </Link>
        <Link href='/account/register'>
          <div className='h-5 text-base text-[#333333] cursor-pointer'>회원가입</div>
        </Link>
      </div>
    </>
  );
}

Home.getLayout = (page: ReactNode) => {
  return <>{page}</>;
};
