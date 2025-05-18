import Button from '@/components/shared/Button';
import Image from 'next/image';
import { ReactNode } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className='flex items-center justify-center min-h-screen px-4'>
        <div className='w-full max-w-[348px] md:w-[380px] flex flex-col items-center gap-16'>
          <div className='flex flex-col items-center gap-8'>
            <div className='whitespace-pre-line text-[#333333] text-5xl font-bold text-center'>연인 추억 저장소</div>
            <Image src='/images/LoFin.png' alt='LoFin' width={300} height={300} />
          </div>

          <div className='flex flex-col gap-4 items-center w-full'>
            <Link href='/account/login' className='w-full'>
              <Button isComplete={true} className='w-full'>
                로그인
              </Button>
            </Link>
            <Link href='/account/register'>
              <div className='h-5 text-base text-[#333333] text-center cursor-pointer'>회원가입</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

Home.getLayout = (page: ReactNode) => {
  return <>{page}</>;
};
