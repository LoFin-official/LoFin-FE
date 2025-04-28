import React, { useState } from 'react';
import { ClearIcon } from '@/assets/icons/SvgIcon';

interface CustomInputProps {
  label: string;
  placeholder?: string;
  width?: string;
  helperText?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ label, placeholder, width = 'w-[380px]', helperText, value, onChange, }: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  const handleClear = () => {
    setInternalValue('');
    if (onChange) {
      const event = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div className={`${width} h-auto flex flex-col mx-auto`}>
      <p className={`text-sm h-4 text-left ${isFocused ? 'text-[#FF9BB3]' : 'text-[#999]'}`}>{label}</p>
      <div className={`flex flex-row ${width} h-9 border-b ${isFocused ? 'border-[#FF9BB3]' : 'border-[#ccc]'}`}>
        <input
          type='text'
          value={internalValue}
          className='w-full h-5 my-2 mx-[2px] bg-transparent outline-none text-base text-left text-[#333333] placeholder-[#cccccc]'
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
        />
        {internalValue && (
          <div className='cursor-pointer mx-[2px] mt-[6px] mb-[6px]' onClick={handleClear}>
            <ClearIcon />
          </div>
        )}
      </div>
      {helperText && <div className='w-[348px] text-sm text-[#767676] h-6 mt-2 mx-auto'>{helperText}</div>}
    </div>
  );
}
