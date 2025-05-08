import { ProgressIcon, ProgressingIcon } from '@/assets/icons/SvgIcon';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import React, { useState } from 'react';

export default function ProfileForm({ onNext, currentStep }: { onNext: () => void; currentStep: number }) {
  const steps = ['1', '2', '3', '4'];
  const [formData, setFormData] = useState({
    nickname: '',
    birth: '',
  });

  // 자음/모음만 구성된 닉네임은 제한
  const isOnlyConsonantsOrVowels = /^[ㄱ-ㅎㅏ-ㅣ]+$/.test(formData.nickname.trim());

  // 닉네임 유효성 검사: 2~8자 사이
  const isValidNickname = formData.nickname.trim().length >= 2 && formData.nickname.trim().length <= 8 && !isOnlyConsonantsOrVowels;

  // 실제 날짜인지 체크
  const isValidDate = (dateString: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  };

  // 생년월일 유효성 검사: YYYY-MM-DD 형식 정규식
  const isValidBirth = /^\d{4}-\d{2}-\d{2}$/.test(formData.birth) && isValidDate(formData.birth);

  const isComplete = isValidNickname && isValidBirth;

  // 생년월일 하이픈 자동 삽입
  const formatBirthInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8); // 숫자만 8자리까지 추출
    const parts = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(Boolean);
    return parts.join('-');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newValue = name === 'birth' ? formatBirthInput(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <>
      <div className='flex flex-col min-h-[calc(100vh-56px)] pt-8 justify-between'>
        <div className='flex flex-1 justify-center'>
          <div className='flex flex-col gap-8 items-center'>
            <div className='flex flex-row gap-1 items-center'>
              {steps.map((step, index) => (
                <div key={index} className='flex items-center gap-1'>
                  <ProgressIcon text={step} active={index <= currentStep} />
                  {index < steps.length - 1 && <ProgressingIcon active={index < currentStep} />}
                </div>
              ))}
            </div>
            <div className='flex flex-col gap-0.5 w-[380px] text-center'>
              <span className='h-6 text-[#333333] text-xl font-bold'>사용하실 프로필 정보를 입력해 주세요.</span>
              <span className='h-5 text-[#767676]'>프로필 사진은 선택 사항이며, 나중에 추가할 수도 있어요.</span>
            </div>
            <div className='w-[120px] h-[120px] rounded-full bg-[#cccccc]'></div>
            <Input
              label='닉네임'
              placeholder='닉네임은 최소 두 글자, 최대 여덟 글자까지 작성 가능합니다.'
              name='nickname'
              value={formData.nickname}
              onChange={handleChange}
            />
            <div className='flex flex-col gap-1'>
              <Input
                label='생년월일'
                placeholder='연도-월-일(YYYY-MM-DD) 형식으로 입력해 주세요.'
                name='birth'
                value={formData.birth}
                maxLength={10}
                onChange={handleChange}
              />
              {!isValidBirth && formData.birth && (
                <div className='text-[#FF2A2A] text-sm ml-1 mt-1'>생년월일은 YYYY-MM-DD 형식의 올바른 날짜여야 합니다.</div>
              )}
            </div>
          </div>
        </div>
        <Button
          isComplete={isComplete}
          onClick={() => {
            if (isComplete) {
              onNext();
            }
          }}
          className='mb-4'
        >
          회원가입
        </Button>
      </div>
    </>
  );
}
