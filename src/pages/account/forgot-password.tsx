import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import React, { useState } from 'react';

export default function forgotPasswordPage() {
  const [email, setEmail] = useState('');

  const isComplete = email.trim() !== '';
  return (
    <>
      <Header>비밀번호 변경</Header>
      <div className='flex flex-col min-h-[calc(100vh-56px)] justify-between'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='flex flex-col gap-8 items-center'>
            <div className='whitespace-pre-line text-[#333333] text-xl font-bold text-center'>
              비밀번호를 잊으셨나요?{'\n'}회원가입에 사용한 이메일을 입력해 주세요.
            </div>
            <Input label='아이디' placeholder='회원가입에 사용한 이메일을 입력해 주세요.' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <Button isComplete={isComplete} className='mb-4'>
          비밀번호 변경 요청
        </Button>
      </div>
    </>
  );
}
