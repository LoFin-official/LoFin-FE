import { ProgressIcon, ProgressingIcon } from '@/assets/icons/SvgIcon';
import Button from '@/components/shared/Button';
import React, { useEffect, useState } from 'react';
import Input from '../Input';

export default function CoupleConnectPage({ onNext, currentStep }: { onNext: () => void; currentStep: number }) {
  const [isConnected, setIsConnected] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [myCode, setMyCode] = useState(''); // 내 코드 받아오기

  // JWT 토큰 (로컬스토리지 등에서 가져오기)
  const token = localStorage.getItem('token') || '';

  // 내 coupleCode 받아오기 (컴포넌트 마운트 시)
  useEffect(() => {
    async function fetchMyCode() {
      try {
        const res = await fetch('http://localhost:5000/coupleLink/couple/code', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setMyCode(data.coupleCode);
        } else {
          console.error('커플 코드 조회 실패:', data.message);
        }
      } catch (err) {
        console.error('커플 코드 조회 중 오류:', err);
      }
    }
    fetchMyCode();
  }, [token]);

  const steps = ['1', '2', '3', '4'];

  // 코드 입력 핸들러
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase(); // 대문자 변환
    const alphanumericOnly = input.replace(/[^A-Z0-9]/g, ''); // 영문 대문자 + 숫자만 허용
    setCode(alphanumericOnly);
    setError('');
  };

  // 연결 버튼 클릭 시 실제 API 호출
  const handleConnect = async () => {
    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (code.length !== 10) {
      setError('코드를 10자리로 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/coupleLink/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coupleCode: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || '연결 실패');
        return;
      }

      setIsConnected(true);
      setError('');
      alert('커플 연결 성공!');
      onNext(); // 다음 단계로 이동
    } catch (err) {
      console.error('커플 연결 중 오류:', err);
      setError('서버 오류가 발생했습니다.');
    }
  };

  const isComplete = code.length === 10;

  return (
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
              <span className='text-[#333333] font-bold text-xl'>{myCode || '로딩 중...'}</span>
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
            {error && <div className='text-[#FF2A2A] text-sm ml-0.5'>{error}</div>}
          </div>
        </div>
      </div>
      <Button isComplete={isComplete} onClick={handleConnect} className='mb-4'>
        연결하기
      </Button>
    </div>
  );
}
