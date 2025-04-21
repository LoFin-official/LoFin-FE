import { ReactNode } from 'react';
import QuestionItem from '@/components/QuestionItem';

export default function Home() {
  return <div className='text-xl'></div>;
}

Home.getLayout = (page: ReactNode) => {
  return (
    <QuestionItem number='01' question='서로의 첫인상은 어땠어?' isComplete={true} detailPageUrl='/QuestionPage'>
      <span>이 안에 자식 컴포넌트도 넣을 수 있어요</span>
    </QuestionItem>
  );
};
