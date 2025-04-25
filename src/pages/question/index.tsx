import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import NoItemText from '@/components/shared/NoItemText';
import React from 'react';
import { ReactNode } from 'react';

export default function QuestionPage() {
  const questions = []; // 현재는 비어 있고, 나중에 데이터를 받아오게 될 부분

  const hasQuestions = questions.length > 0;
  return (
    <>
      <div>
        {hasQuestions ? (
          // 나중에 질문 아이템이 생기면 여기에 컴포넌트 or 리스트를 렌더링
          <div>질문 아이템 리스트 출력 영역</div>
        ) : (
          <NoItemText title='지금은 아직 아무 질문도 없어요 :)' subtitle='우리만의 특별한 질문을 시작해보세요.' />
        )}
      </div>
    </>
  );
}

QuestionPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>질문</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
