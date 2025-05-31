import { useRouter } from 'next/router';
import BottomSheet from '@/components/shared/BottomSheet';
import { DeleteIcon, QuestionEditIcon } from '@/assets/icons/SvgIcon';
import { backendUrl } from '@/config/config';

interface QuestionBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  hasAnswer?: boolean;
  id?: string | string[]; // useRouter의 query.id는 string | string[] | undefined
  onAnswerDeleted?: () => void; // 답변 삭제 후 콜백
}

export default function QuestionBottomSheet({ isOpen, onClose, hasAnswer, id, onAnswerDeleted }: QuestionBottomSheetProps) {
  const router = useRouter();

  // 답변 삭제 함수
  const handleDeleteAnswer = async () => {
    if (!id || Array.isArray(id)) {
      console.error('Invalid question ID');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 삭제 확인
      const confirm = window.confirm('정말로 답변을 삭제하시겠습니까?');
      if (!confirm) return;

      const response = await fetch(`${backendUrl}/answer/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '답변 삭제에 실패했습니다.');
      }

      const result = await response.json();
      alert(result.message || '답변이 삭제되었습니다.');

      // 부모 컴포넌트에 삭제 완료 알림
      if (onAnswerDeleted) {
        onAnswerDeleted();
      }

      onClose();
    } catch (error: any) {
      console.error('답변 삭제 오류:', error);
      alert(error.message || '답변 삭제 중 오류가 발생했습니다.');
    }
  };
  const handleDeleteQuestion = async () => {
    if (!id || Array.isArray(id)) {
      console.error('Invalid question ID');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const confirm = window.confirm('정말로 질문을 삭제하시겠습니까?');
      if (!confirm) return;

      const response = await fetch(`${backendUrl}/question/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '질문 삭제에 실패했습니다.');
      }

      const result = await response.json();
      alert(result.message || '질문이 삭제되었습니다.');

      // 삭제 후 콜백 실행 (필요하다면)
      if (onAnswerDeleted) {
        onAnswerDeleted();
      }

      onClose();
      router.push('/question'); // 질문 목록 페이지로 이동
    } catch (error: any) {
      console.error('질문 삭제 오류:', error);
      alert(error.message || '질문 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <BottomSheet height={'144px'} isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col'>
        {!hasAnswer ? (
          // 답변이 없는 경우: 답변하기 + 삭제하기
          <>
            <div
              onClick={() => {
                if (id) {
                  router.push(`/question/${id}/answer`).then(onClose);
                }
              }}
              className='flex flex-row gap-0.5 h-[72px] px-4 items-center border-b border-[#D9D9D9] text-[#FF4C80] cursor-pointer'
            >
              <QuestionEditIcon onClick={() => {}} />
              <div className='h-6 text-lg'>답변하기</div>
            </div>
            <div onClick={handleDeleteQuestion} className='flex flex-row gap-0.5 h-[72px] px-4 items-center text-[#C58EF1] cursor-pointer'>
              <DeleteIcon />
              <div className='h-6 text-lg'>질문 삭제하기</div>
            </div>
          </>
        ) : (
          // 답변이 있는 경우: 수정하기 + 삭제하기 (답변 삭제)
          <>
            <div
              onClick={() => {
                if (id) {
                  router.push(`/question/${id}/edit`).then(onClose);
                }
              }}
              className='flex flex-row gap-0.5 h-[72px] px-4 items-center border-b border-[#D9D9D9] text-[#FF4C80] cursor-pointer'
            >
              <QuestionEditIcon onClick={() => {}} />
              <div className='h-6 text-lg'>수정하기</div>
            </div>
            <div onClick={handleDeleteAnswer} className='flex flex-row gap-0.5 h-[72px] px-4 items-center text-[#C58EF1] cursor-pointer'>
              <DeleteIcon />
              <div className='h-6 text-lg'>삭제하기</div>
            </div>
          </>
        )}
      </div>
    </BottomSheet>
  );
}
