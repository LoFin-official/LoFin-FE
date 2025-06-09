import React, { ReactNode, useState } from 'react';
import BottomSheet from './BottomSheet';
import { DeleteIcon, QuestionEditIcon } from '@/assets/icons/SvgIcon';
import { useRouter } from 'next/router';

interface BottomSheetDateProps {
  className?: string;
  children?: ReactNode;
  isOpen: boolean;
  height?: string;
  onClose: () => void;
  onEdited?: () => void;
  onDeleted?: () => void;
}

export default function BottomSheetMemoryEdit({ className, isOpen, onClose, onEdited, onDeleted }: BottomSheetDateProps) {
  const router = useRouter();

  const handleEditConfirm = () => {
    onClose();
    onEdited?.();
    router.push(`/memory/edit-memory`);
  };

  const handleCreateConfirm = () => {
    onClose();
    onDeleted?.();
    router.push(`/memory/create`);
  };

  return (
    <>
      <BottomSheet height={'144px'} className={className} isOpen={isOpen} onClose={onClose}>
        <div className='py-6 flex flex-col gap-6 justify-center'>
          <div className='flex flex-row gap-1 h-6 px-4 text-[#C58EF1] cursor-pointer' onClick={() => handleEditConfirm()}>
            <QuestionEditIcon onClick={() => {}} />
            <span className='text-lg'>편집하기</span>
          </div>

          <div className='w-full h-px bg-[#D9D9D9]'></div>

          <div className='flex flex-row gap-1 h-6 px-4 text-[#FF4C80] cursor-pointer' onClick={() => handleCreateConfirm()}>
            <DeleteIcon />
            <span className='text-lg'>추억 작성하기</span>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
