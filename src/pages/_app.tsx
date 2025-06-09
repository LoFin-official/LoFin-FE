// pages/_app.tsx
import '@/styles/globals.css';
import '@/styles/calendar.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactNode } from 'react';
import Head from 'next/head';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout & {
    memberId?: string;
    coupleId?: string;
  };
}

export default function App({ Component, pageProps }: MyAppProps) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  // 소켓 연결 관련 useEffect 삭제!

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no' />
      </Head>

      <div className='w-full h-screen flex justify-center items-center bg-white'>
        <div className='w-full max-w-[412px] h-full'>{getLayout(<Component {...pageProps} />)}</div>
      </div>
    </>
  );
}
