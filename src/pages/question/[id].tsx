import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import ProfileItem from '@/components/shared/ProfileItem';
import Button from '@/components/shared/Button';

const backendUrl = 'http://192.168.35.111:5000'; // API 주소

interface QuestionDetail {
  _id: string;
  title: string;
  content: string;
  myNickname: string;
  partnerNickname: string;
  myProfileImageUrl: string | null;
  partnerProfileImageUrl: string | null;
  myAnswer: string | null;
  partnerAnswer: string | null;
}

export default function QuestionDetailPage() {
  const router = useRouter();
  const { id, number, updated } = router.query;

  const [questionData, setQuestionData] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasMyAnswer, setHasMyAnswer] = useState(false);

  // 질문 데이터 불러오는 함수
  const fetchQuestionData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) throw new Error('로그인이 필요합니다.');

      const questionRes = await fetch(`${backendUrl}/question/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!questionRes.ok) throw new Error('질문 불러오기 실패');
      const data = await questionRes.json();

      // 내 답변이 있는지 확인하고 상태 업데이트
      const myAnswerExists = !!data.myAnswer;
      setHasMyAnswer(myAnswerExists);

      setQuestionData({
        _id: data.question._id,
        title: data.question.title,
        content: data.question.content,
        myNickname: data.myNickname,
        partnerNickname: data.partnerNickname,
        myProfileImageUrl: data.myProfileImageUrl ? `${backendUrl}/${data.myProfileImageUrl.replace(/^\/?/, '')}` : null,
        partnerProfileImageUrl: data.partnerProfileImageUrl ? `${backendUrl}/${data.partnerProfileImageUrl.replace(/^\/?/, '')}` : null,
        myAnswer: data.myAnswer,
        partnerAnswer: data.partnerAnswer,
      });

      setLoading(false);
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (!id || Array.isArray(id)) return;

    fetchQuestionData();
  }, [router.isReady, id, updated]); // Add 'updated' to dependencies to refresh when coming back from answer page

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error}</div>;
  if (!questionData) return <div>데이터가 없습니다.</div>;

  return (
    <>
      <Header hasAnswer={hasMyAnswer}>질문</Header>
      <div className='flex flex-col items-center gap-8 px-4 py-4 min-h-[calc(100vh-112px)]'>
        <ProfileItem
          type='question'
          number={number ? number.toString() : '1'}
          id={id as string}
          myNickname={questionData.myNickname}
          partnerNickname={questionData.partnerNickname}
          myProfileImageUrl={questionData.myProfileImageUrl}
          partnerProfileImageUrl={questionData.partnerProfileImageUrl}
        />

        <div className='flex flex-col gap-8 w-full max-w-[348px]'>
          <span className='text-[#333333] font-bold text-2xl'>{questionData.title || '제목이 없습니다.'}</span>

          {/* 내 답변 */}
          <div className='flex flex-col gap-2'>
            <span className='text-[#333333] font-bold text-xl'>{questionData.myNickname} 답변</span>
            {questionData.myAnswer ? (
              <span className='text-[#767676] text-base'>{questionData.myAnswer}</span>
            ) : (
              <div className='flex flex-col gap-4'>
                <span className='text-[#767676] text-base'>아직 답변을 작성하지 않았어요!</span>
              </div>
            )}
          </div>

          {/* 파트너 답변 */}
          <div className='flex flex-col gap-2'>
            <span className='text-[#333333] font-bold text-xl'>{questionData.partnerNickname} 답변</span>
            {questionData.partnerAnswer ? (
              <span className='text-[#767676] text-base'>{questionData.partnerAnswer}</span>
            ) : (
              <span className='text-[#767676] text-base'>아직 파트너가 답변을 작성하지 않았어요!</span>
            )}
          </div>
        </div>
      </div>
      <BottomBar />
    </>
  );
}
