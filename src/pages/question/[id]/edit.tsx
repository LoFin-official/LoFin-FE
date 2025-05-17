import { QuestionsIcon } from '@/assets/icons/SvgIcon';
import BottomBar from '@/components/shared/BottomBar';
import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import { questions } from '@/data/questionsData';
import { answers } from '@/data/questionsAnswerData';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef, useState } from 'react';

export default function QuestionEditPage() {
  const router = useRouter();
  const { id } = router.query;

  const [questionText, setQuestionText] = useState('');

  const [inputValue, setInputValue] = useState('');
  const [initialAnswer, setInitialAnswer] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = '0px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (id) {
      const questionObj = questions.find((q) => q.id === Number(id));
      if (questionObj) {
        setQuestionText(questionObj.question);
      }
      const answerList = answers[Number(id)];
      if (answerList && answerList.length > 0) {
        // '제리'의 기존 답변만 뽑기 (실제 로그인 유저라면 해당 유저 필터링)
        const myAnswer = answerList.find((a) => a.nickname === '제리');
        if (myAnswer) {
          setInputValue(myAnswer.content);
          setInitialAnswer(myAnswer.content);
        }
      }
    }
  }, [id]);

  const isComplete = inputValue.trim() !== initialAnswer.trim();

  const handleQuestion = () => {
    if (isComplete) {
      console.log('수정된 답변:', inputValue);
      router.push(`/question/${id}`);
    }
  };

  return (
    <div className='flex flex-col gap-8 pt-16 px-4 min-h-[calc(100vh-112px)] items-center'>
      <div className='flex flex-col gap-2 items-center text-center'>
        <span className='w-auto h-6 text-[#333333] font-bold text-xl'>{questionText}</span>
        <div className='flex flex-row gap-0.5'>
          <QuestionsIcon className='text-[#999999]'></QuestionsIcon>
          <span className='w-auto h-5 text-[#999999]'>{id}번째 질문</span>
        </div>
      </div>
      <div className='flex flex-col gap-2 w-full max-w-[348px] h-auto mx-4'>
        <span className='w-auto h-6 text-[#333333] font-bold text-lg'>나의 답변</span>
        <textarea
          ref={textareaRef}
          className='w-full max-w-[348px] h-6 pl-1 text-[#767676] text-base border-none resize-none focus:outline-none'
          placeholder='솔직한 마음을 편하게 적어주세요 :)'
          value={inputValue}
          onChange={handleInputChange}
          maxLength={150}
        />
        <span className='w-auto h-5 text-[#999999] text-xs text-end pr-1'>{inputValue.length}/150</span>
      </div>
      <div className='fixed bottom-[72px] w-full max-w-[412px] mx-auto px-4'>
        <Button isComplete={isComplete} onClick={handleQuestion} className='w-full'>
          수정 완료
        </Button>
      </div>
    </div>
  );
}

QuestionEditPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>질문 수정</Header>
      {page}
      <BottomBar />
    </>
  );
};
