import { ProgressIcon, ProgressingIcon } from '@/assets/icons/SvgIcon';
import Button from '@/components/shared/Button';
import React, { useState } from 'react';
import Input from '../Input';

export default function CoupleConnectPage({ onNext, currentStep }: { onNext: () => void; currentStep: number }) {
  const [isConnected, setIsConnected] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const steps = ['1', '2', '3', '4'];

  const handleConnect = () => {
    if (code === 'QWE') {
      setIsConnected(true);
      setError(false);
      onNext();
    } else {
      setError(true);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase(); // 대문자로 변환
    const alphanumericOnly = input.replace(/[^A-Z0-9]/g, ''); // 영문 대문자 + 숫자만 허용
    setCode(alphanumericOnly);
    setError(false);
  };

  const isComplete = code.length === 10;

  return (
    <>
      <div className='flex flex-col min-h-[calc(100vh-56px)] pt-8 justify-between'>
        <div className='flex flex-1 justify-center'>
          <div className='flex flex-col gap-8 items-center'>
            <div className='flex flex-row gap-1 items-center'>
              {steps.map((step, index) => (
                <div key={index} className='flex items-center gap-1'>
                  <ProgressIcon text={step} active={index <= currentStep} />
                  {index < steps.length - 1 && <ProgressingIcon active={index < currentStep} />}
                </div>
              ))}
            </div>
            <div className='flex flex-col gap-0.5 w-[380px] text-center'>
              <span className='text-[#333333] text-xl font-bold'>
                당신의 초대 코드를 공유하거나,
                <br />
                상대방의 코드를 입력해 연결하세요!
              </span>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='h-6 text-center text-[#ff9bb3] text-xl'>당신의 코드</span>
              <div className='w-[134px] h-10 items-center text-center px-0.5 py-2 border-b border-[#ff9bb3]'>
                <span className='text-[#333333] font-bold text-xl'>E2R1TWSF9V</span>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <Input
                label='상대방의 초대 코드를 받으셨나요?'
                placeholder='상대방의 초대 코드를 입력해 주세요.'
                value={code}
                maxLength={10}
                onChange={handleCodeChange}
              />
              {error && <div className='text-[#FF2A2A] text-sm ml-0.5'>초대 코드가 올바르지 않습니다. 다시 입력해 주세요.</div>}
            </div>
          </div>
        </div>
        <Button isComplete={isComplete} onClick={handleConnect} className='mb-4'>
          연결하기
        </Button>
      </div>
    </>
  );
}
