import { useRouter } from 'next/router';
import BottomSheet from '@/components/shared/BottomSheet';
import { QuestionEditIcon } from '@/assets/icons/SvgIcon';

interface QuestionBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  hasAnswer?: boolean;
  id?: string | string[]; // useRouter의 query.id는 string | string[] | undefined
}

export default function QuestionBottomSheet({ isOpen, onClose, hasAnswer, id }: QuestionBottomSheetProps) {
  const router = useRouter();

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
              className='flex flex-row gap-0.5 h-[72px] px-4 items-center border-b border-[#D9D9D9] cursor-pointer'
            >
              <QuestionEditIcon onClick={() => {}} />
              <div className='h-6 text-[#333333] text-lg'>답변하기</div>
            </div>
            <div
              onClick={() => {
                // API 삭제 로직 추가 예정
                if (id) {
                  router.push('/question').then(onClose);
                }
              }}
              className='flex flex-row gap-0.5 h-[72px] px-4 items-center cursor-pointer'
            >
              <div className='h-6 text-[#333333] text-lg'>삭제하기</div>
            </div>
          </>
        ) : (
          // 답변이 있는 경우: 수정하기 + 삭제하기
          <>
            <div
              onClick={() => {
                if (id) {
                  router.push(`/question/${id}/edit`).then(onClose);
                }
              }}
              className='flex flex-row gap-0.5 h-[72px] px-4 items-center border-b border-[#D9D9D9] cursor-pointer'
            >
              <QuestionEditIcon onClick={() => {}} />
              <div className='h-6 text-[#333333] text-lg'>수정하기</div>
            </div>
            <div
              onClick={() => {
                // API 삭제 로직 추가 예정
                if (id) {
                  router.push('/question').then(onClose);
                }
              }}
              className='flex flex-row gap-0.5 h-[72px] px-4 items-center cursor-pointer'
            >
              <div className='h-6 text-[#333333] text-lg'>삭제하기</div>
            </div>
          </>
        )}
      </div>
    </BottomSheet>
  );
}
