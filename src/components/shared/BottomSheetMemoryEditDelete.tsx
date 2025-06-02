import React, { ReactNode, useState } from 'react';
import BottomSheet from './BottomSheet';
import { DeleteIcon, QuestionEditIcon } from '@/assets/icons/SvgIcon';
import { useRouter } from 'next/router';
import { backendUrl } from '@/config/config';

interface BottomSheetDateProps {
  className?: string;
  children?: ReactNode;
  isOpen: boolean;
  height?: string;
  onClose: () => void;
  id?: string | string[];
  onEdited?: () => void;
  onDeleted?: () => void;
}

export default function BottomSheetMemoryEditDelete({ className, isOpen, onClose, id, onEdited, onDeleted }: BottomSheetDateProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 예시용 API 요청 (수정 로직은 실제 구현에 맞게 변경)
      const response = await fetch(`${backendUrl}/memory/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // 수정 내용 전달 (예: 제목 변경 등)
          title: '수정된 제목',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '수정 실패');
      }

      alert('수정되었습니다.');
      setShowEditModal(false);
      onClose();
      onEdited?.();
    } catch (error: any) {
      alert(error.message || '수정 중 오류 발생');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`${backendUrl}/memory/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '삭제 실패');
      }

      alert('삭제되었습니다.');
      setShowDeleteModal(false);
      onClose();
      onDeleted?.();
    } catch (error: any) {
      alert(error.message || '삭제 중 오류 발생');
    }
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
              <div className='h-6 my-1.5 text-[#333333] text-base cursor-pointer' onClick={() => setShowEditModal(false)}>
                취소
              </div>
              <div className='w-px h-full bg-[#D9D9D9]'></div>
              <div className='h-6 my-1.5 text-[#C58EF1] text-base cursor-pointer' onClick={handleEditConfirm}>
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
              <div className='h-6 my-1.5 text-[#333333] text-base cursor-pointer' onClick={() => setShowDeleteModal(false)}>
                취소
              </div>
              <div className='w-px h-full bg-[#D9D9D9]'></div>
              <div className='h-6 my-1.5 text-[#FF4C80] text-base cursor-pointer' onClick={handleDeleteConfirm}>
                삭제
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
