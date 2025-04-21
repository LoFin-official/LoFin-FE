import Button from '@/components/Button';
import Header from '@/components/shared/Header';
import { ReactNode } from 'react';

export default function Home() {
  return <div className='text-xl'></div>;
}

Home.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>안녕</Header>
      <Button isComplete={true}>확인{page}</Button>
    </>
  );
};
