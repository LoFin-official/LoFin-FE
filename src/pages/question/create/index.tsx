import QuestionTabs from '@/components/shared/question/QuestionTabs';
import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

export default function QuestionCreatePage() {
  const [selectedTab, setSelectedTab] = useState<'direct' | 'random'>('direct');
  const [question, setQuestion] = useState('');
  const router = useRouter();

  const isComplete = question.trim() !== '';

  const [randomQuestion, setRandomQuestion] = useState('');

  const getRandomQuestion = () => {
    const index = Math.floor(Math.random() * randomQuestions.length);
    setRandomQuestion(randomQuestions[index]);
  };

  useEffect(() => {
    if (selectedTab === 'random') getRandomQuestion();
  }, [selectedTab]);

  const randomQuestions = [
    '서로를 처음 봤을 때 어떤 인상이었나요?',
    '요즘 가장 즐겨 듣는 노래는?',
    '하루 중 가장 좋아하는 시간대는 언제인가요?',
    '같이 가보고 싶은 여행지는?',
  ];

  const handleQuestion = () => {
    const content = selectedTab === 'direct' ? question.trim() : randomQuestion.trim();
    if (content) {
      // 예: API 요청
      router.push('/question');
    }
  };

  return (
    <div>
      {/* 탭 컴포넌트 */}
      <QuestionTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />

      {selectedTab === 'direct' && (
        <div className='flex flex-col pt-16 min-h-[calc(100vh-166px)]'>
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col w-[380px] h-[46px] mx-auto gap-[2px] items-center'>
              <div className='h-6 text-[#333333] text-xl font-bold'>소소해도 좋아요, 궁금한 마음을 나눠보세요.</div>
              <div className='h-5 text-[#767676]'>사소한 질문이 우리를 더 가깝게 해줄 거예요.</div>
            </div>
            <Input
              label='당신의 질문 한 줄'
              placeholder='사소해도 좋아요, 궁금했던 걸 남겨보세요.'
              width='w-[348px]'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className='flex-grow' />
          <Button isComplete={isComplete} onClick={handleQuestion} className='mb-4'>
            질문 생성
          </Button>
        </div>
      )}

      {selectedTab === 'random' && (
        <div className='flex flex-col pt-16 min-h-[calc(100vh-166px)]'>
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col w-[380px] h-[46px] mx-auto gap-[2px] items-center'>
              <div className='h-6 text-[#333333] text-xl font-bold'>지금, 우리를 위한 질문을 골라봤어요.</div>
              <div className='h-5 text-[#767676]'>지금의 우리에게 딱 맞는 질문일지도 몰라요.</div>
            </div>
            <Input label='운명처럼 등장한 질문!' width='w-[348px]' value={randomQuestion} readOnly alwaysActiveStyle />
          </div>
          <div className='text-[#767676] text-sm text-center mt-1 cursor-pointer' onClick={getRandomQuestion}>
            우리 얘기에 더 어울리는 질문이 궁금해요.
          </div>

          <div className='flex-grow' />
          <Button isComplete={true} onClick={handleQuestion} className='mb-4'>
            질문 생성
          </Button>
        </div>
      )}
    </div>
  );
}

QuestionCreatePage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>질문 생성</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
