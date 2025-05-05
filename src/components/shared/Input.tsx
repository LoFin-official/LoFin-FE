import React, { useState } from 'react';
import { ClearIcon, EyeCloseIcon, EyeIcon } from '@/assets/icons/SvgIcon';

interface CustomInputProps {
  label: string;
  placeholder?: string;
  width?: string;
  helperText?: string;
  name?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  maxLength?: number;
}

export default function Input({
  label,
  placeholder,
  width = 'w-[380px]',
  helperText,
  name,
  value,
  onChange,
  type = 'text',
  maxLength,
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

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
        target: { value: '' },
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
          type={isPassword && !showPassword ? 'password' : 'text'}
          name={name}
          value={internalValue}
          maxLength={maxLength}
          className='w-full h-5 my-2 mx-[2px] bg-transparent outline-none text-base text-left text-[#333333] placeholder-[#cccccc]'
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
        />
        {isPassword && internalValue && (
          <div className='flex items-center gap-0.5'>
            <button type='button' onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeCloseIcon /> : <EyeIcon />}
            </button>
            <div className='cursor-pointer mx-0.5 mt-1.5 mb-1.5' onClick={handleClear}>
              <ClearIcon />
            </div>
          </div>
        )}
      </div>
      {helperText && <div className='w-[348px] text-sm text-[#767676] h-6 mt-2 mx-auto'>{helperText}</div>}
    </div>
  );
}
