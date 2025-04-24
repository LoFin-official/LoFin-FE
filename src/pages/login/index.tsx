import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isComplete = email.trim() !== '' && password.trim() !== '';

  return (
    <>
      <Header>로그인</Header>

      {/* Header 아래 영역 전체를 채우도록 설정 */}
      <div className='flex flex-col items-center justify-center gap-8 px-4 py-10 min-h-[calc(100vh-56px)]'>
        {/* 헤더 높이가 64px이라고 가정 (필요 시 조정) */}
        <div className='flex flex-col gap-8 w-full max-w-sm'>
          {/* 인풋 영역 */}
          <div className='flex flex-col gap-8'>
            <Input label='아이디' placeholder='이메일을 입력해 주세요.' value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label='비밀번호' placeholder='비밀번호를 입력해 주세요.' value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {/* 버튼 + 텍스트 */}
          <div className='flex flex-col items-center gap-4'>
            <Button isComplete={isComplete}>로그인</Button>
            <div className='text-[#333333] text-base text-center'>비밀번호를 잊어버리셨나요?</div>
          </div>
        </div>
      </div>
    </>
  );
}
