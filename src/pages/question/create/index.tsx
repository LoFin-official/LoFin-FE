import QuestionTabs from '@/components/shared/question/QuestionTabs';
import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

const backendUrl = 'http://192.168.35.111:5000'; // 백엔드 서버 주소

export default function QuestionCreatePage() {
  const [selectedTab, setSelectedTab] = useState<'direct' | 'random'>('direct');
  const [question, setQuestion] = useState('');
  const [randomQuestion, setRandomQuestion] = useState('');
  const router = useRouter();

  const isComplete = question.trim() !== '' || (selectedTab === 'random' && randomQuestion.trim() !== '');

  // 서버에서 랜덤 질문 받아오기
  const fetchRandomQuestion = async () => {
    try {
      const res = await fetch(`${backendUrl}/question/random`);
      if (!res.ok) throw new Error('랜덤 질문 불러오기 실패');
      const data = await res.json();
      setRandomQuestion(data.content);
    } catch (error) {
      console.error(error);
      setRandomQuestion('시스템 질문을 불러올 수 없습니다.');
    }
  };

  useEffect(() => {
    if (selectedTab === 'random') {
      fetchRandomQuestion();
    }
  }, [selectedTab]);

  // 질문 저장 처리 함수
  const handleQuestion = async () => {
    const content = selectedTab === 'direct' ? question.trim() : randomQuestion.trim();
    if (!content) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ JWT 토큰 추가
        },
        body: JSON.stringify({ content }), // ✅ memberId, coupleId는 백엔드에서 처리
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`질문 저장 실패: ${errorData.error || '알 수 없는 오류'}`);
        return;
      }

      alert('질문이 성공적으로 저장되었습니다.');
      router.push('/question');
    } catch (err) {
      console.error(err);
      alert('질문 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <QuestionTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />

      {selectedTab === 'direct' && (
        <div className='flex flex-col pt-16 min-h-[calc(100vh-166px)] px-4'>
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col w-full max-w-[380px] h-[46px] mx-auto gap-[2px] items-center'>
              <div className='h-6 text-[#333333] text-xl font-bold'>소소해도 좋아요, 궁금한 마음 나눠보세요.</div>
              <div className='h-5 text-[#767676]'>사소한 질문이 우리를 더 가깝게 해줄 거예요.</div>
            </div>
            <Input
              label='당신의 질문 한 줄'
              placeholder='사소해도 좋아요, 궁금했던 걸 남겨보세요.'
              width='w-full max-w-[348px]'
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
        <div className='flex flex-col pt-16 min-h-[calc(100vh-166px)] px-4'>
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col w-full max-w-[380px] h-[46px] mx-auto gap-0.5 items-center'>
              <div className='h-6 text-[#333333] text-xl font-bold'>지금, 우리를 위한 질문을 골라봤어요.</div>
              <div className='h-5 text-[#767676]'>지금의 우리에게 딱 맞는 질문일지도 몰라요.</div>
            </div>
            <Input label='운명처럼 등장한 질문!' width='w-full max-w-[348px]' value={randomQuestion} readOnly alwaysActiveStyle />
          </div>
          <div className='text-[#767676] text-sm text-center mt-1 cursor-pointer' onClick={fetchRandomQuestion}>
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
