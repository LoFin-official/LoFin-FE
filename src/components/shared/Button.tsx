import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  isComplete: boolean;
  onClick?: () => void;
}

export default function Button({ children, className, isComplete, onClick }: ButtonProps) {
  return (
    <div className={className} onClick={onClick}>
      {isComplete ? (
        <div className='w-[380px] h-[50px] flex items-center justify-center rounded-md bg-[#FF9BB3] mx-auto cursor-pointer hover:bg-[#FF4C80]'>
          <span className='text-xl font-bold text-white'>{children}</span>
        </div>
      ) : (
        <div className='w-[380px] h-[50px] flex items-center justify-center rounded-md bg-[#999999] mx-auto hover:bg-[#8A8A8A]'>
          <span className='text-xl font-bold text-white'>{children}</span>
        </div>
      )}
    </div>
  );
}
