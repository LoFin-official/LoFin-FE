import React, { useState } from 'react';
import { ClearIcon } from '@/assets/icons/SvgIcon';

interface CustomInputProps {
  label: string;
  placeholder?: string;
  width?: string;
  helperText?: string;
}

export default function Input({ label, placeholder, width = 'w-[380px]', helperText }: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');

  const handleClear = () => {
    setText('');
  };

  return (
    <>
      <div className={`${width} h-[auto] flex flex-col mx-auto`}>
        <p className={`text-sm h-4 text-left ${isFocused ? 'text-[#FF9BB3]' : 'text-[#999]'}`}>{label}</p>
        <div className={`flex flex-row ${width} h-9 border-b ${isFocused ? 'border-[#FF9BB3]' : 'border-[#ccc]'}`}>
          <input
            type='text'
            value={text}
            className='w-full h-5 mt-2 mb-2 mx-[2px] bg-transparent outline-none text-base font-medium text-left text-[#333333]'
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
          />
          {text && (
            <div className='cursor-pointer mx-[2px] mt-[6px] mb-[6px]' onClick={handleClear}>
              <ClearIcon />
            </div>
          )}
        </div>
        {helperText && <div className='w-[348px] text-sm text-[#767676] h-6 mt-2 mx-auto'>{helperText}</div>}
      </div>
    </>
  );
}
