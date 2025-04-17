import '@/styles/globals.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactNode } from 'react';

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
        <div className='w-full h-screen flex justify-center items-center bg-white'>
            <div className='w-[412px] h-full'>{getLayout(<Component {...pageProps} />)}</div>
        </div>
    )
}