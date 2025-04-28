import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import Image from 'next/image';
import React, { ReactNode, useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
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
  const isComplete =
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    formData.verificationCode.trim() !== '';

  return (
    <>
      <div className='flex flex-col min-h-[calc(100vh-56px)] justify-between'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='flex flex-col gap-8 items-center'>
            <Image src='/images/LoFin.png' alt='LoFin' width={200} height={200} />
            <div className='flex flex-row gap-2'>
              <Input
                label='아이디'
                placeholder='이메일을 입력해 주세요.'
                width='w-[277px]'
                name='email'
                value={formData.email}
                onChange={handleChange}
              />
              <div className='flex items-end'>
                <div className='w-[95px] h-[36px] rounded-[6px] bg-[#FF9BB3] flex justify-center'>
                  <div className='h-5 text-base text-[#ffffff] font-bold mt-1.5'>인증 요청</div>
                </div>
              </div>
            </div>
            <div className='flex flex-row gap-2'>
              <Input
                label='인증 번호'
                placeholder='인증 번호를 입력해 주세요.'
                width='w-[277px]'
                name='verificationCode'
                value={formData.verificationCode}
                onChange={handleChange}
              />
              <div className='flex items-end'>
                <div className='w-[95px] h-[36px] rounded-[6px] bg-[#FF9BB3] flex justify-center'>
                  <div className='h-5 text-base text-[#ffffff] font-bold mt-1.5'>확인</div>
                </div>
              </div>
            </div>
            <Input
              label='비밀번호'
              placeholder='영문, 숫자, 특수 문자 조합 8자리 이상'
              name='password'
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              label='비밀번호 재확인'
              placeholder='비밀번호 재입력'
              name='confirmPassword'
              value={formData.confirmPassword}
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

RegisterPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>회원가입</Header>
      {page}
    </>
  );
};
