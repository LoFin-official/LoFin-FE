import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import ProfileItem from '@/components/shared/ProfileItem';
import { questions } from '@/data/questionsData';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

export default function QuestionDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [questionText, setQuestionText] = useState('');

  useEffect(() => {
    if (id) {
      const questionObj = questions.find((q) => q.id === Number(id));
      if (questionObj) {
        setQuestionText(questionObj.question);
      }
    }
  }, [id]);

  const question = [
    { nickname: '제리', content: '크고 시끄러운데...' },
    { nickname: '톰', content: '' },
  ];

  return (
    <div className='flex flex-col items-center gap-8 px-4 py-4 min-h-[calc(100vh-112px)]'>
      <ProfileItem type='question' id={Number(id)}></ProfileItem>
      <div className='flex flex-col gap-8 w-[348px] h-auto'>
        <span className='h-7.5 text-[#333333] font-bold text-2xl'>{questionText}</span>
        <div className='flex flex-col gap-4 w-[344px] h-auto mr-auto'>
          {question.map((question, index) => (
            <div className='flex flex-col gap-2' key={index}>
              <span className='w-auto h-6 pl-1 text-[#333333] font-bold text-xl'>{question.nickname}</span>
              {question.content ? (
                <span className='w-auto h-auto pl-1.5 text-[#767676] text-base'>{question.content}</span>
              ) : (
                <span className='w-auto h-auto pl-1.5 text-[#767676] text-base'>아직 답변을 작성하지 않았어요!</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

QuestionDetailPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>질문</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
