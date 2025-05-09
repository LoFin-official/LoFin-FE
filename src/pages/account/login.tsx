import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import React, { ReactNode, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|co\.kr|kr|edu|gov|io|me)$/.test(email);
  };

  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return regex.test(password);
  };

  const isComplete = isValidEmail(email) && isValidPassword(password);

  const router = useRouter();

  const handleLogin = () => {
    //API 요청 예정
    if (isComplete) {
      router.push('/memory');
    }
  };

  return (
    <>
      {/* Header 아래 영역 전체를 채우도록 설정 */}
      <div className='flex flex-col items-center gap-8 px-4 py-16 min-h-[calc(100vh-56px)]'>
        <Image src='/images/LoFin.png' alt='LoFin' width={250} height={250} />
        <div className='flex flex-col gap-8 w-full max-w-sm'>
          {/* 인풋 영역 */}
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col gap-1'>
              <Input label='아이디' placeholder='이메일을 입력해 주세요.' value={email} onChange={(e) => setEmail(e.target.value)} />
              {!isValidEmail(email) && email && (
                <div className='text-[#FF2A2A] text-sm ml-0.5'>이메일 주소는 example@domain.com과 같은 형식이어야 합니다.</div>
              )}
            </div>
            <div className='flex flex-col gap-1'>
              <Input
                type='password'
                label='비밀번호'
                placeholder='비밀번호를 입력해 주세요.'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!isValidPassword(password) && password && (
                <div className='text-[#FF2A2A] text-sm ml-0.5'>비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.</div>
              )}
            </div>
          </div>

          {/* 버튼 + 텍스트 */}
          <div className='flex flex-col items-center gap-4'>
            <Button isComplete={isComplete} onClick={handleLogin}>
              로그인
            </Button>
            <div onClick={() => router.push('/account/forgot-password')} className='text-[#333333] text-base text-center cursor-pointer'>
              비밀번호를 잊어버리셨나요?
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

LoginPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>로그인</Header>
      {page}
    </>
  );
};
