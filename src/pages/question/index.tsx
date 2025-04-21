import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import React from 'react';
import { ReactNode } from 'react';

export default function QuestionPage() {
  return;
}

QuestionPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>질문</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
