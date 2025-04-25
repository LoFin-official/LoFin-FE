import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { HeartIcon, MeunIcon, DayEditIcon, DayDeleteIcon } from '@/assets/icons/SvgIcon';

interface AnniversaryItemProps {
  label: string;
  dday: string;
  date: string;
  onClick?: () => void;
  iconColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function AnniversaryItem({ label, dday, date, onClick, className = '' }: AnniversaryItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Main menu modal
  const [isEditConfirmModalOpen, setIsEditConfirmModalOpen] = useState(false); // Edit confirmation modal
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false); // Delete confirmation modal
  const router = useRouter();

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleEditClick = () => {
    setIsModalOpen(false); // Close main modal
    setIsEditConfirmModalOpen(true); // Open edit confirmation modal
  };

  const handleDeleteClick = () => {
    setIsModalOpen(false); // Close main modal
    setIsDeleteConfirmModalOpen(true); // Open delete confirmation modal
  };

  const handleEditModalClose = () => {
    setIsEditConfirmModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteConfirmModalOpen(false);
  };

  const handleEditConfirm = () => {
    setIsEditConfirmModalOpen(false); // Close edit confirmation modal
    router.push('/edit-page'); // Navigate to the edit page
  };

  return (
    <div
      className={`self-stretch h-14 bg-[#ffffff] border-b border-[#EEEEEE] overflow-hidden flex items-center justify-between px-4 cursor-pointer ${className}`}
      onClick={handleModalOpen}
    >
      {/* 왼쪽 아이콘 + 텍스트 */}
      <div className='flex items-center space-x-2'>
        <div className='w-6 h-6 flex items-center justify-center'>
          <HeartIcon />
        </div>
        <div className='text-[#333333] text-base font-bold leading-tight'>{label}</div>
      </div>

      {/* 오른쪽 정보들 - 오른쪽 끝으로 정렬 */}
      <div className='flex flex-col items-end justify-center gap-[2px] ml-auto'>
        <div className='text-[#FF9BB3] text-sm font-bold text-right'>{dday}</div>
        <div className='text-[#767676] text-sm font-medium text-right'>{date}</div>
      </div>

      {/* 우측 아이콘 */}
      <div className='flex items-center justify-center ml-2'>
        <MeunIcon onClick={() => setIsModalOpen(true)} />
      </div>

      {/* 메인 모달 */}
      {isModalOpen && (
        <>
          <div className='fixed inset-0 bg-[#1B1B1B] bg-opacity-50 z-40' onClick={handleModalClose} />
          <div
            className='fixed bottom-0 left-1/2 w-[24rem] h-36 bg-[#ffffff] rounded-tl-xl rounded-tr-xl border-t border-[#EEEEEE] overflow-hidden z-50 transform -translate-x-1/2'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex flex-col items-start justify-center h-full'>
              {/* 수정 아이콘 및 텍스트 */}
              <div className='w-full ml-4 flex items-center text-left text-lg font-medium text-[#C58EF1] cursor-pointer' onClick={handleEditClick}>
                <DayEditIcon onClick={handleEditClick} />
                <span className='ml-2'>수정</span>
              </div>

              {/* 중간 선 */}
              <div className='w-full h-px bg-[#D9D9D9] mt-6 mb-4'></div>

              {/* 삭제 아이콘 및 텍스트 */}
              <div className='w-full ml-4 flex items-center text-left text-lg font-medium text-[#FF4C80] cursor-pointer' onClick={handleDeleteClick}>
                <DayDeleteIcon onClick={handleDeleteClick} />
                <span className='ml-2'>삭제</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 수정 확인 모달 */}
      {isEditConfirmModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-[#1B1B1B] bg-opacity-50 z-50'>
          <div className='w-52 h-24 relative'>
            <div className='w-52 h-24 left-0 top-0 absolute bg-[#ffffff] rounded-xl' />
            <div className='w-32 left-[40px] top-[16px] absolute text-center justify-start text-[#333333] text-base font-medium leading-tight'>
              수정하시겠습니까?
            </div>
            <div
              className='left-[137px] top-[61px] absolute text-right justify-start text-[#C58EF1] text-base font-medium leading-tight cursor-pointer'
              onClick={handleEditConfirm} // Confirm and navigate to edit page
            >
              수정
            </div>
            <div
              className='left-[36px] top-[61px] absolute text-right justify-start text-[#333333] text-base font-medium  leading-tight cursor-pointer'
              onClick={handleEditModalClose}
            >
              취소
            </div>
            <div className='w-52 h-px left-0 top-[52px] absolute bg-[#EEEEEE]' />
            <div className='w-px h-9 left-[100px] top-[53px] absolute bg-[#EEEEEE]' />
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteConfirmModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-[#1B1B1B] bg-opacity-50 z-50'>
          <div className='w-52 h-24 relative'>
            <div className='w-52 h-24 left-0 top-0 absolute bg-[#ffffff] rounded-xl' />
            <div className='w-32 left-[40px] top-[16px] absolute text-center justify-start text-[#333333] text-base font-medium  leading-tight'>
              삭제하시겠습니까?
            </div>
            <div
              className='left-[137px] top-[61px] absolute text-right justify-start text-[#FF4C80] text-base font-medium  leading-tight cursor-pointer'
              onClick={handleDeleteModalClose}
            >
              삭제
            </div>
            <div
              className='left-[36px] top-[61px] absolute text-right justify-start text-[#333333] text-base font-medium  leading-tight cursor-pointer'
              onClick={handleDeleteModalClose}
            >
              취소
            </div>
            <div className='w-52 h-px left-0 top-[52px] absolute bg-[#EEEEEE]' />
            <div className='w-px h-9 left-[100px] top-[53px] absolute bg-[#EEEEEE]' />
          </div>
        </div>
      )}
    </div>
  );
}
