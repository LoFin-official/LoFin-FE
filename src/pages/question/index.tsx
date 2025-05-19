import React, { useEffect, useState, ReactNode } from 'react';
import QuestionItem from '@/components/shared/question/QuestionItem';
import NoItemText from '@/components/shared/NoItemText';
import Header from '@/components/shared/Header';
import BottomBar from '@/components/shared/BottomBar';
import { backendUrl } from '@/config/config';

interface Question {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function QuestionPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${backendUrl}/question`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('질문 목록을 불러오는 중 오류 발생');
        const data = await res.json();
        setQuestions(data.questions);
      } catch (err: any) {
        setError(err.message || '오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>질문 목록을 불러오는 중 오류가 발생했습니다: {error}</div>;

  return (
    <>
      <div>
        {questions.length > 0 ? (
          <div className='flex flex-col pb-[56px]'>
            {[...questions]
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) // 오래된 순으로 정렬
              .map((q, index) => (
                <QuestionItem
                  key={q._id}
                  number={(index + 1).toString().padStart(2, '0')} // '01', '02' 형식
                  question={q.title}
                  isComplete={true} // 실제 로직에 맞게 수정 가능
                  detailPageUrl={`/question/${q._id}`}
                  className='cursor-pointer text-[#FF9BB3]'
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
