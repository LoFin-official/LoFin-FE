import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { email } = router.query; // 쿼리에서 이메일 받기

  const [newpassword, setNewPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return regex.test(password);
  };

  const isMatching = newpassword === confirmpassword;

  const isComplete = isValidPassword(newpassword) && isMatching && newpassword.trim() !== '' && confirmpassword.trim() !== '';

  const handleResetPassword = async () => {
    if (!isComplete) return;

    if (!email || typeof email !== 'string') {
      setErrorMessage('유효한 이메일 정보가 없습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/password/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: email,
          newPassword: newpassword,
          confirmPassword: confirmpassword, // 추가 필요!
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.');
        setErrorMessage('');
        setTimeout(() => {
          router.push('/account/login');
        }, 1500); // 1.5초 후 이동
      } else {
        setErrorMessage(data.message || '비밀번호 변경에 실패했습니다.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('서버와 통신 중 오류가 발생했습니다.');
      setSuccessMessage('');
    }
  };

  return (
    <>
      <Header>비밀번호 재설정</Header>
      <div className='flex flex-col min-h-[calc(100vh-56px)] justify-between gap-8 px-4 pt-16'>
        <div className='flex flex-1'>
          <div className='flex flex-col gap-8 items-center'>
            <div className='whitespace-pre-line text-[#333333] text-xl font-bold text-center'>
              인증이 완료되었습니다!{'\n'}새로운 비밀번호를 입력해 주세요.
            </div>
            <Image src='/images/LoFin.png' alt='LoFin' width={200} height={200} />
            <div className='flex flex-col gap-1'>
              <Input
                type='password'
                label='새 비밀번호'
                placeholder='영문, 숫자, 특수 문자 조합 8자리 이상'
                value={newpassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {!isValidPassword(newpassword) && newpassword && (
                <div className='text-[#FF2A2A] text-sm ml-0.5'>비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.</div>
              )}
            </div>
            <div className='flex flex-col gap-1'>
              <Input
                type='password'
                label='새 비밀번호 재확인'
                placeholder='비밀번호 재입력'
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {newpassword !== confirmpassword && confirmpassword && (
                <div className='text-[#FF2A2A] text-sm ml-0.5'>비밀번호가 일치하지 않습니다.</div>
              )}
            </div>
            {errorMessage && <div className='text-[#FF2A2A] text-sm mt-2'>{errorMessage}</div>}
            {successMessage && <div className='text-[#2768FF] text-sm mt-2'>{successMessage}</div>}
          </div>
        </div>

        <Button isComplete={isComplete} onClick={handleResetPassword} className='mb-4'>
          비밀번호 변경
        </Button>
      </div>
    </>
  );
}
