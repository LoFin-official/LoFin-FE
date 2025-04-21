import Button from '@/components/Button';
import { ReactNode } from 'react';

export default function Home() {
  return <div className='text-xl'></div>;
}

Home.getLayout = (page: ReactNode) => {
  return <Button isComplete={true}>확인{page}</Button>;
};
