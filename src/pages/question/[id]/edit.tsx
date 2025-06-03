import BottomBar from '@/components/shared/BottomBar';
import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { backendUrl } from '@/config/config';

interface QuestionDetail {
  _id: string;
  title: string;
  content: string;
  myAnswer: string | null;
}

export default function QuestionEditPage() {
  const router = useRouter();
  const { id } = router.query;

  const [questionData, setQuestionData] = useState<QuestionDetail | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [initialAnswer, setInitialAnswer] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = '0px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  };

  useEffect(() => {
    const fetchQuestionAndAnswer = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) throw new Error('로그인이 필요합니다.');

        const res = await fetch(`${backendUrl}/question/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('질문 정보 불러오기 실패');

        const data = await res.json();

        setQuestionData({
          _id: data.question._id,
          title: data.question.title,
          content: data.question.content,
          myAnswer: data.myAnswer,
        });

        // 기존 답변이 있으면 설정
        if (data.myAnswer) {
          setInputValue(data.myAnswer);
          setInitialAnswer(data.myAnswer);
        }

        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || '오류가 발생했습니다.');
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestionAndAnswer();
    }
  }, [id]);

  // 답변이 수정되었는지 확인
  const isComplete = inputValue.trim() !== initialAnswer.trim() && inputValue.trim().length > 0;

  const handleEditAnswer = async () => {
    if (!isComplete || !id) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // 답변 수정 API 요청
      const res = await fetch(`${backendUrl}/answer/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: inputValue,
        }),
      });

      if (res.ok) {
        alert('답변이 수정되었습니다.');
        // 업데이트 쿼리 파라미터로 상세 페이지에서 새로고침 트리거
        router.replace(`/question/${id}?updated=${Date.now()}`);
      } else {
        const errData = await res.json();
        alert(`답변 수정 실패: ${errData.message || errData.error || '알 수 없는 오류'}`);
      }
    } catch (err) {
      console.error('답변 수정 중 오류:', err);
      alert('답변 수정 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error}</div>;
  if (!questionData) return <div>데이터가 없습니다.</div>;

  return (
    <div className='flex flex-col gap-8 pt-16 px-4 min-h-[calc(100vh-112px)] items-center'>
      <div className='flex flex-col gap-2 items-center text-center'>
        <span className='w-auto h-6 text-[#333333] font-bold text-xl'>{questionData.title || '제목이 없습니다.'}</span>
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
        <Button isComplete={isComplete} onClick={handleEditAnswer} className='w-full'>
          수정 완료
        </Button>
      </div>
    </div>
  );
}

QuestionEditPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>답변 수정</Header>
      {page}
      <BottomBar />
    </>
  );
};
