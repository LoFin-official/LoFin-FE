import { ProgressIcon, ProgressingIcon } from '@/assets/icons/SvgIcon';
import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import React, { ReactNode, useState } from 'react';

export default function ProfileForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nickname: '',
    birth: '',
  });

  // 상태 업데이트 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 필수 입력 값이 있는지 체크
  const isComplete = formData.nickname.trim() !== '' && formData.birth.trim() !== '';

  const steps = ['1', '2', '3', '4'];
  return (
    <>
      <div className='flex flex-col min-h-[calc(100vh-56px)] justify-between'>
        <div className='flex flex-1 items-center justify-center'>
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
              <span className='h-4 text-[#767676]'>프로필 사진은 선택 사항이며, 나중에 추가할 수도 있어요.</span>
            </div>
            <div className='w-[120px] h-[120px] rounded-full bg-[#cccccc]'></div>
            <Input
              label='닉네임'
              placeholder='닉네임은 최소 두 글자, 최대 여덟 글자까지 작성 가능합니다.'
              name='nickname'
              value={formData.nickname}
              onChange={handleChange}
            />
            <Input
              label='생년월일'
              placeholder='연도-월-일(YYYY-MM-DD) 형식으로 입력해 주세요.'
              name='birth'
              value={formData.birth}
              onChange={handleChange}
            />
          </div>
        </div>
        <Button isComplete={isComplete} className='mb-4'>
          회원가입
        </Button>
      </div>
    </>
  );
}

ProfileForm.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>프로필 설정</Header>
      {page}
    </>
  );
};
