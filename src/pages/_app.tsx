// pages/_app.tsx
import '@/styles/globals.css';
import '@/styles/calendar.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactNode, useEffect } from 'react';
import Head from 'next/head';
import socket from '../socket';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPageWithLayout;
}) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  useEffect(() => {
    // 소켓 연결 성공 이벤트
    socket.on('connect', () => {
      console.log('소켓 연결됨, id:', socket.id);
    });

    // 소켓 연결 해제 이벤트
    socket.on('disconnect', () => {
      console.log('소켓 연결 해제됨');
    });

    // cleanup: 언마운트 시 소켓 연결 해제
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, []);

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
