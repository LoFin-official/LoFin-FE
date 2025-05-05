import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function ResetPasswordPage() {
  const [newpassword, setNewPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  const router = useRouter();

  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return regex.test(password);
  };

  const isMatching = newpassword === confirmpassword;

  const isComplete = isValidPassword(newpassword) && isMatching && newpassword.trim() !== '' && confirmpassword.trim() !== '';

  const handleLogin = () => {
    //API 요청 예정
    if (isComplete) {
      router.push('/account/login');
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
          </div>
        </div>

        <Button isComplete={isComplete} onClick={handleLogin} className='mb-4'>
          비밀번호 변경
        </Button>
      </div>
    </>
  );
}
