import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import React, { useState } from 'react';

export default function ResetPasswordPage() {
  const [newpassword, setNewPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  const isComplete = newpassword.trim() !== '' && confirmpassword.trim() !== '';
  return (
    <>
      <Header>비밀번호 재설정</Header>
      <div className='flex flex-col min-h-[calc(100vh-56px)] justify-between'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='flex flex-col gap-8 items-center'>
            <div className='whitespace-pre-line text-[#333333] text-xl font-bold text-center'>
              인증이 완료되었습니다!{'\n'}새로운 비밀번호를 입력해 주세요.
            </div>
            <Input
              label='새 비밀번호'
              placeholder='영문, 숫자, 특수 문자 조합 8자리 이상'
              value={newpassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label='새 비밀번호 재확인'
              placeholder='비밀번호 재입력'
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <Button isComplete={isComplete} className='mb-4'>
          비밀번호 변경 요청
        </Button>
      </div>
    </>
  );
}
