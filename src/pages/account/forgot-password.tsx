import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const [isVerified, setIsVerified] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|co\.kr|kr|edu|gov|io|me)$/.test(email);
  };

  const isComplete = isValidEmail(email) && isVerified;

  // 인증 요청 - 이메일로 코드 요청
  const handleSendCode = async () => {
    if (!isValidEmail(email)) {
      setErrorMessage('유효한 이메일을 입력해 주세요.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: email }),
      });
      const data = await response.json();

      if (response.ok) {
        setShowVerification(true);
        setSuccessMessage('인증 코드가 이메일로 전송되었습니다.');
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || '인증 코드 전송에 실패했습니다.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('서버와 통신 중 오류가 발생했습니다.');
      setSuccessMessage('');
    }
  };

  // 인증 코드 검증
  const handleVerificationCheck = async () => {
    if (verificationCode.length !== 6) {
      setErrorMessage('인증번호 6자리를 입력해 주세요.');
      setSuccessMessage('');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: email, code: verificationCode }),
      });
      const data = await response.json();

      if (response.ok) {
        setIsVerified(true);
        setSuccessMessage('인증이 완료 되었습니다.');
        setErrorMessage('');
      } else {
        setIsVerified(false);
        setErrorMessage(data.message || '인증번호가 일치하지 않습니다.');
        setSuccessMessage('');
      }
    } catch (error) {
      setIsVerified(false);
      setErrorMessage('서버와 통신 중 오류가 발생했습니다.');
      setSuccessMessage('');
    }
  };

  // 비밀번호 재설정 페이지로 이동
  const handleForgot = () => {
    if (isComplete) {
      router.push({
        pathname: '/account/reset-password',
        query: { email: email }, // 여기 email 값이 제대로 들어가야 함
      });
    }
  };

  return (
    <>
      <Header>비밀번호 변경</Header>
      <div className='flex flex-col min-h-[calc(100vh-56px)] justify-between gap-8 px-4 pt-16'>
        <div className='flex flex-1'>
          <div className='flex flex-col gap-8 items-center'>
            <div className='whitespace-pre-line text-[#333333] text-xl font-bold text-center'>
              비밀번호를 잊으셨나요?{'\n'}회원가입에 사용한 이메일을 입력해 주세요.
            </div>
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
          </div>
        </div>

        <Button isComplete={isComplete} onClick={handleForgot} className='mb-4'>
          인증 완료
        </Button>
      </div>
    </>
  );
}
