import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import NoItemText from '@/components/shared/NoItemText';
import QuestionItem from '@/components/shared/question/QuestionItem';
import { questions } from '@/data/questionsData';
import React from 'react';
import { ReactNode } from 'react';

export default function QuestionPage() {
  const question = []; // 현재는 비어 있고, 나중에 데이터를 받아오게 될 부분

  const hasQuestions = questions.length > 0;
  return (
    <>
      <div>
        {hasQuestions ? (
          <div className='flex flex-col pb-[56px]'>
            {questions.map((q, index) => (
              <QuestionItem
                className='cursor-pointer text-[#FF9BB3]'
                key={index}
                number={q.number}
                question={q.question}
                isComplete={q.isComplete}
                detailPageUrl={q.detailPageUrl}
              />
            ))}
          </div>
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
