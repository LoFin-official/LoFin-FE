import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function forgotPasswordPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const [correctCode, setCorrectCode] = useState('1234'); // 실제로는 서버에서 전송 후 받은 값
  const [isVerified, setIsVerified] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|co\.kr|kr|edu|gov|io|me)$/.test(email);
  };

  const isComplete = isValidEmail(email) && isVerified;

  const handleForgot = () => {
    //API 요청 예정
    if (isComplete) {
      router.push('/account/reset-password');
    }
  };

  const handleVerificationCheck = () => {
    if (verificationCode === correctCode) {
      setIsVerified(true);
      setSuccessMessage('인증이 완료 되었습니다.');
      setErrorMessage('');
    } else {
      setIsVerified(false);
      setErrorMessage('인증번호가 일치하지 않습니다.');
      setSuccessMessage('');
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
            <div className='flex flex-row gap-2'>
              <Input
                label='아이디'
                placeholder='회원가입에 사용한 이메일을 입력해 주세요.'
                width='w-[277px]'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className='flex items-end'>
                <div
                  onClick={() => setShowVerification(true)}
                  className='w-[95px] h-[36px] rounded-[6px] bg-[#FF9BB3] flex justify-center cursor-pointer'
                >
                  <div className='h-5 text-base text-[#ffffff] font-bold mt-1.5'>인증 요청</div>
                </div>
              </div>
            </div>
            {showVerification && (
              <div className='flex flex-col gap-1'>
                <div className='flex flex-row gap-2'>
                  <Input
                    label='인증번호'
                    placeholder='인증번호 4자리를 입력해 주세요.'
                    width='w-[277px]'
                    maxLength={4}
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
