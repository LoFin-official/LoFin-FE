import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  isComplete: boolean;
  onClick?: () => void;
}

export default function Button({ children, className, isComplete, onClick }: ButtonProps) {
  const baseClasses = 'w-full max-w-[380px] h-[50px] flex items-center justify-center rounded-md mx-auto text-xl font-bold text-white cursor-pointer';
  const enabledClasses = 'bg-[#FF9BB3] hover:bg-[#FF4C80]';
  const disabledClasses = 'bg-[#999999] hover:bg-[#8A8A8A]';

  return (
    <button
      className={`${baseClasses} ${isComplete ? enabledClasses : disabledClasses} ${className}`}
      onClick={onClick}
      disabled={!isComplete}
      type='button'
    >
      {children}
    </button>
  );
}
