import React, { useState, ChangeEvent } from 'react';
import { ClearIcon } from '@/assets/icons/SvgIcon';

interface CustomInputProps {
  label: string;
  placeholder?: string;
  width?: string;
  helperText?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ label, placeholder, width = 'w-[380px]', helperText, value, onChange }: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState('');

  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isControlled) {
      onChange?.(e);
    } else {
      setInternalValue(e.target.value);
    }
  };

  const handleClear = () => {
    if (isControlled && onChange) {
      onChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
    } else {
      setInternalValue('');
    }
  };

  return (
    <div className={`${width} h-auto flex flex-col mx-auto`}>
      <p className={`text-sm h-4 text-left ${isFocused ? 'text-[#FF9BB3]' : 'text-[#999]'}`}>{label}</p>
      <div className={`flex flex-row ${width} h-9 border-b ${isFocused ? 'border-[#FF9BB3]' : 'border-[#ccc]'}`}>
        <input
          type='text'
          value={inputValue}
          className='w-full h-5 mt-2 mb-2 mx-[2px] bg-transparent outline-none text-base text-left text-[#333333] placeholder-[#cccccc]'
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
        />
        {inputValue && (
          <div className='cursor-pointer mx-[2px] mt-[6px] mb-[6px]' onClick={handleClear}>
            <ClearIcon />
          </div>
        )}
      </div>
      {helperText && <div className='w-[348px] text-sm text-[#767676] h-6 mt-2 mx-auto'>{helperText}</div>}
    </div>
  );
}
