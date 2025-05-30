import React, { useRef, useState } from 'react';
import { ClearIcon, EyeCloseIcon, EyeIcon } from '@/assets/icons/SvgIcon';

interface CustomInputProps {
  label: string; // 인풋 컴포넌트 타이틀
  placeholder?: string; // 인풋 컴포넌트 힌트 메시지
  width?: string; // 인풋 컴포넌트 크기
  helperText?: string; // 인풋 컴포넌트 도우미
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; // 패스워드용 인풋 타입입
  maxLength?: number; // 최대 글자 수 제한
  readOnly?: boolean; // 읽기 전용 텍스트
  alwaysActiveStyle?: boolean; // 포커스 되지 않아도 강조 색상 유지
  onClick?: () => void;
}

export default function Input({
  label, // 인풋 컴포넌트 타이틀
  placeholder, // 인풋 컴포넌트 힌트 메시지
  width = 'w-[380px]', // 인풋 컴포넌트 크기
  helperText, // 인풋 컴포넌트 도우미
  name,
  value,
  onChange,
  type = 'text', // 패스워드용 인풋 타입
  maxLength, // 최대 글자 수 제한
  readOnly = false, // 읽기 전용 텍스트
  alwaysActiveStyle = false, // 포커스 되지 않아도 강조 색상 유지
  onClick,
}: CustomInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
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
  const handleFocus = () => {
    setIsFocused(true);
    // 모바일 키보드 대응: input 위치로 스크롤
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300); // 키보드 올라오는 시간 고려
    }
  };

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div className={`${width} h-auto flex flex-col mx-auto`}>
      <p className={`text-sm h-4 text-left ${alwaysActiveStyle || isFocused ? 'text-[#FF9BB3]' : 'text-[#999]'}`}>{label}</p>
      <div className={`flex flex-row ${width} h-9 border-b ${alwaysActiveStyle || isFocused ? 'border-[#FF9BB3]' : 'border-[#ccc]'}`}>
        <input
          ref={inputRef}
          readOnly={readOnly}
          type={isPassword && !showPassword ? 'password' : 'text'}
          name={name}
          value={internalValue}
          maxLength={maxLength}
          className={`w-full h-5 my-2 mx-[2px] bg-transparent outline-none text-base text-left text-[#333333] placeholder-[#cccccc] ${onClick ? 'cursor-pointer' : ''}`}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          onClick={onClick}
          placeholder={placeholder}
        />
        {internalValue && !onClick && (
          <div className='flex items-center gap-0.5'>
            {/* 패스워드 타입일 때만 보이는 눈 아이콘 */}
            {isPassword && (
              <button type='button' onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeCloseIcon /> : <EyeIcon />}
              </button>
            )}

            {/* 모든 타입에서 보이는 Clear 아이콘 */}
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
