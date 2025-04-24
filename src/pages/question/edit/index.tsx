import QuestionTabs from '@/components/shared/question/QuestionTabs';
import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import { ReactNode } from 'react';
import React, { useState } from 'react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

export default function QuestionEditPage() {
  const [selectedTab, setSelectedTab] = useState<'direct' | 'random'>('direct');
  const [question, setQuestion] = useState('');

  const isComplete = question.trim() !== '';

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
          <Button isComplete={isComplete} className='mb-4'>
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
            <Input label='운명처럼 등장한 질문!' placeholder='사소해도 좋아요, 궁금했던 걸 남겨보세요.' width='w-[348px]' />
          </div>
          <div className='text-[#767676] text-sm text-center mt-1'>우리 얘기에 더 어울리는 질문이 궁금해요.</div>

          <div className='flex-grow' />
          <Button isComplete={true} className='mb-4'>
            질문 생성
          </Button>
        </div>
      )}
    </div>
  );
}

QuestionEditPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>질문 생성</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
