import BottomBar from '@/components/shared/BottomBar';
import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef, useState } from 'react';

const backendUrl = 'http://192.168.35.111:5000'; // 백엔드 서버 주소
interface QuestionDetail {
  _id: string;
  title: string;
  content: string;
}

export default function QuestionAnswerPage() {
  const router = useRouter();
  const { id } = router.query;

  const [questionData, setQuestionData] = useState<QuestionDetail | null>(null);
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('로그인이 필요합니다.');
        const res = await fetch(`${backendUrl}/question/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setQuestionData({
          _id: data.question._id,
          title: data.question.title,
          content: data.question.content,
        });
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id]);

  const isComplete = inputValue.trim().length > 0;

  const handleQuestion = async () => {
    if (!isComplete || !id) return;

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${backendUrl}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: id, // 백엔드에서 사용
          content: inputValue, // ✅ 수정된 부분 (answer → content)
        }),
      });

      if (res.ok) {
        alert('답변을 작성했습니다.');
        // 질문 상세 페이지로 이동 시 쿼리 변경하여 리렌더링 유도
        router.replace(`/question/${id}?updated=${Date.now()}`);
      } else {
        const err = await res.json();
        alert(`답변 저장에 실패했습니다: ${err.message || err.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('답변 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='flex flex-col gap-8 pt-16 px-4 min-h-[calc(100vh-112px)] items-center'>
      <div className='flex flex-col gap-2 items-center text-center'>
        <span className='text-[#333333] font-bold text-2xl'>{questionData?.title || '제목이 없습니다.'}</span>
        <div className='flex flex-row gap-0.5'></div>
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
        <Button isComplete={isComplete} onClick={handleQuestion} className='w-full max-w-[380px]'>
          작성 완료
        </Button>
      </div>
    </div>
  );
}

QuestionAnswerPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>질문 답변</Header>
      {page}
      <BottomBar />
    </>
  );
};
