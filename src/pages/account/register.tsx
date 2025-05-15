import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|co\.kr|kr|edu|gov|io|me)$/.test(email);
  };

  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return regex.test(password);
  };

  const isPasswordConfirmed = password === confirmpassword;

  const isComplete = isValidEmail(email) && isValidPassword(password) && isPasswordConfirmed && isVerified;
  const handleSendCode = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: email }),
      });
      const data = await res.json();
      if (data.success) {
        setShowVerification(true);
        alert('인증 코드가 전송되었습니다.');
      } else {
        alert(data.message || '인증 요청 실패');
      }
    } catch (error) {
      console.error('인증 요청 오류:', error);
      alert('인증 요청 중 오류 발생');
    }
  };

  const handleVerificationCheck = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: email, code: verificationCode }),
      });
      const data = await res.json();
      if (data.success) {
        setIsVerified(true);
        setSuccessMessage('인증이 완료 되었습니다.');
        setErrorMessage('');
      } else {
        setIsVerified(false);
        setErrorMessage(data.message || '인증 실패');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('인증 확인 오류:', error);
      alert('인증 확인 중 오류 발생');
    }
  };

  const handleRegister = async () => {
    if (!isComplete) return;

    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: email,
          password,
          passwordConfirm: confirmpassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        alert('회원가입 완료!');
        router.push('/signup/profile');
      } else {
        alert(data.message || '회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 오류 발생');
    }
  };

  return (
    <>
      <div className='flex flex-col min-h-[calc(100vh-56px)] justify-between'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='flex flex-col gap-8 items-center'>
            <Image src='/images/LoFin.png' alt='LoFin' width={200} height={200} />
            <div className='flex flex-col gap-1'>
              <div className='flex flex-row gap-2'>
                <Input
                  label='아이디'
                  placeholder='이메일을 입력해 주세요.'
                  width='w-[277px]'
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className='flex items-end'>
                  <div onClick={handleSendCode} className='w-[95px] h-[36px] rounded-[6px] bg-[#FF9BB3] flex justify-center cursor-pointer'>
                    <div className='h-5 text-base text-[#ffffff] font-bold mt-1.5'>인증 요청</div>
                  </div>
                </div>
              </div>
              {!isValidEmail(email) && email && (
                <div className='text-[#FF2A2A] text-sm ml-0.5'>이메일 주소는 example@domain.com과 같은 형식이어야 합니다.</div>
              )}
            </div>
            {showVerification && (
              <div className='flex flex-col gap-1'>
                <div className='flex flex-row gap-2'>
                  <Input
                    label='인증번호'
                    placeholder='인증번호 6자리를 입력해 주세요.'
                    width='w-[277px]'
                    maxLength={6}
                    name='verificationCode'
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <div className='flex items-end'>
                    <div
                      onClick={handleVerificationCheck}
                      className='w-[95px] h-[36px] rounded-[6px] bg-[#FF9BB3] flex justify-center cursor-pointer'
                    >
                      <div className='h-5 text-base text-[#ffffff] font-bold mt-1.5'>인증 확인</div>
                    </div>
                  </div>
                </div>
                {errorMessage ? (
                  <div className='text-[#FF2A2A] text-sm ml-0.5'>{errorMessage}</div>
                ) : successMessage ? (
                  <div className='text-[#2768FF] text-sm ml-0.5'>{successMessage}</div>
                ) : null}
              </div>
            )}
            <div className='flex flex-col gap-1'>
              <Input
                type='password'
                label='비밀번호'
                placeholder='영문, 숫자, 특수 문자 조합 8자리 이상'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!isValidPassword(password) && password && (
                <div className='text-[#FF2A2A] text-sm ml-0.5'>비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.</div>
              )}
            </div>
            <div className='flex flex-col gap-1'>
              <Input
                type='password'
                label='비밀번호 재확인'
                placeholder='비밀번호 재입력'
                name='confirmPassword'
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {password !== confirmpassword && confirmpassword && <div className='text-[#FF2A2A] text-sm ml-0.5'>비밀번호가 일치하지 않습니다.</div>}
            </div>
          </div>
        </div>
        <Button isComplete={isComplete} onClick={handleRegister} className='mb-4'>
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
