import '@/styles/globals.css';
import '@/styles/calendar.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactNode } from 'react';
import Head from 'next/head';

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

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>

      <div className='w-full h-screen flex justify-center items-center bg-white'>
        <div className='w-full max-w-[412px] h-full'>{getLayout(<Component {...pageProps} />)}</div>
      </div>
    </>
  );
}
