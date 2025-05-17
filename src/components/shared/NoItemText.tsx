import React from 'react';

interface TextProps {
  title: string;
  subtitle: string;
}

export default function NoItemText({ title, subtitle }: TextProps) {
  return (
    <div className='w-full min-w-[348px] max-w-[380px] flex flex-col gap-1 min-h-[calc(100vh-112px)] text-center justify-center mx-auto'>
      <div className='h-6 text-[#767676] text-xl font-bold'>{title}</div>
      <div className='h-5 text-[#999999] text-sm'>{subtitle}</div>
    </div>
  );
}
