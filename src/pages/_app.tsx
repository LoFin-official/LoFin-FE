// pages/_app.tsx
import '@/styles/globals.css';
import '@/styles/calendar.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactNode, useEffect } from 'react';
import Head from 'next/head';
import { connectSocket } from '../socket';

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

  useEffect(() => {
    // memberId, coupleId가 없으면 소켓 연결하지 않음
    if (!Component.memberId || !Component.coupleId) return;

    const socket = connectSocket(Component.memberId, Component.coupleId);

    socket.on('connect', () => {
      console.log('소켓 연결됨, id:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('소켓 연결 해제됨');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [Component.memberId, Component.coupleId]);

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
