import React, { ReactNode, useState } from 'react';
import BottomSheet from './BottomSheet';
import { DeleteIcon, QuestionEditIcon } from '@/assets/icons/SvgIcon';

interface BottomSheetDateProps {
  className?: string;
  children?: ReactNode;
  isOpen: boolean;
  height: string;
  onClose: () => void;
}

export default function BottomSheetAnniversaryItem({ className, isOpen, onClose }: BottomSheetDateProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditConfirm = () => {
    // 여기에 수정 로직 작성

    setShowEditModal(false);
    onClose(); // 바텀시트도 같이 닫을지 선택 가능
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleDeleteConfirm = () => {
    // 여기에 수정 로직 작성

    setShowDeleteModal(false);
    onClose(); // 바텀시트도 같이 닫을지 선택 가능
  };

  const handleDeleteModalClose = () => {
    setShowEditModal(false);
  };

  return (
    <>
      <BottomSheet height={'144px'} className={className} isOpen={isOpen} onClose={onClose}>
        <div className='py-6 flex flex-col gap-6 justify-center'>
          <div className='flex flex-row gap-1 h-6 px-4 text-[#C58EF1] cursor-pointer' onClick={() => setShowEditModal(true)}>
            <QuestionEditIcon onClick={() => {}} />
            <span className='text-lg'>수정하기</span>
          </div>

          <div className='w-full h-px bg-[#D9D9D9]'></div>

          <div className='flex flex-row gap-1 h-6 px-4 text-[#FF4C80] cursor-pointer' onClick={() => setShowDeleteModal(true)}>
            <DeleteIcon />
            <span className='text-lg'>삭제하기</span>
          </div>
        </div>
      </BottomSheet>

      {/* 수정 모달 */}
      {showEditModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-[#1B1B1B] bg-opacity-50 z-50'>
          <div className='flex flex-col w-[200px] h-[89px] bg-[#FFFFFF] rounded-[12px] items-center justify-center'>
            <div className='h-6 my-3.5 text-base text-[#333333]'>수정하시겠습니까?</div>
            <div className='w-full h-px bg-[#D9D9D9]'></div>
            <div className='flex flex-row gap-9 text-center'>
              <div className='h-6 my-1.5 text-right text-[#333333] text-base cursor-pointer' onClick={handleEditModalClose}>
                취소
              </div>
              <div className='w-px h-full bg-[#D9D9D9]'></div>
              <div className='h-6 my-1.5 text-left text-[#C58EF1] text-base cursor-pointer' onClick={handleEditConfirm}>
                수정
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 모달 */}
      {showDeleteModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-[#1B1B1B] bg-opacity-50 z-50'>
          <div className='flex flex-col w-[200px] h-[89px] bg-[#FFFFFF] rounded-[12px] items-center justify-center'>
            <div className='h-6 my-3.5 text-base text-[#333333]'>삭제하시겠습니까?</div>
            <div className='w-full h-px bg-[#D9D9D9]'></div>
            <div className='flex flex-row gap-9 text-center'>
              <div className='h-6 my-1.5 text-right text-[#333333] text-base cursor-pointer' onClick={handleDeleteModalClose}>
                취소
              </div>
              <div className='w-px h-full bg-[#D9D9D9]'></div>
              <div className='h-6 my-1.5 text-left text-[#FF4C80] text-base cursor-pointer' onClick={handleDeleteConfirm}>
                삭제
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
