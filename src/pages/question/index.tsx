import BottomBar from '@/components/shared/BottomBar';
import React from 'react';
import { ReactNode } from 'react';

export default function QuestionPage() {
  return <div>질문페이지입니당.</div>;
}

QuestionPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
