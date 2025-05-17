import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import React, { ReactNode, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|co\.kr|kr|edu|gov|io|me)$/.test(email);
  };

  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return regex.test(password);
  };

  const isComplete = isValidEmail(email) && isValidPassword(password);

  const handleLogin = async () => {
    if (!isComplete) return;

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginId: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('로그인 성공:', data);
        router.push('/memory');
      } else {
        alert(data.message || '로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      alert('서버에 연결할 수 없습니다.');
    }
  };

  return (
    <>
      <div className='flex flex-col items-center gap-8 px-4 py-16 min-h-[calc(100vh-56px)]'>
        <Image src='/images/LoFin.png' alt='LoFin' width={250} height={250} />
        <div className='flex flex-col gap-8 w-full max-w-[412px]'>
          <div className='w-full max-w-[380px] md:w-[412px] flex flex-col gap-8'>
            <div className='flex flex-col gap-1'>
              <Input
                width='w-full max-w-[380px] mx-auto'
                label='아이디'
                placeholder='이메일을 입력해 주세요.'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!isValidEmail(email) && email && (
                <div className='text-[#FF2A2A] text-sm ml-0.5'>이메일 주소는 example@domain.com과 같은 형식이어야 합니다.</div>
              )}
            </div>
            <div className='flex flex-col gap-1'>
              <Input
                width='w-full max-w-[380px] mx-auto'
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
