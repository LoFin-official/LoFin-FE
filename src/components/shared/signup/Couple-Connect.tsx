import { ProgressIcon, ProgressingIcon } from '@/assets/icons/SvgIcon';
import Button from '@/components/shared/Button';
import React, { useEffect, useState } from 'react';
import Input from '../Input';

// 서버 URL 결정 함수
const getBackendUrl = () => {
  const isRunningInWebView = window.ReactNativeWebView !== undefined;
  return isRunningInWebView ? 'http://192.168.35.111:5000' : 'http://localhost:5000';
};

export default function CoupleConnectPage({ onNext, currentStep }: { onNext: () => void; currentStep: number }) {
  const [isConnected, setIsConnected] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [myCode, setMyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [environment, setEnvironment] = useState<'web' | 'webview'>('web');
  // userStatus 대신 isConnected 상태로 관리하므로 userStatus 제거

  const backendUrl = getBackendUrl();
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    setEnvironment(window.ReactNativeWebView !== undefined ? 'webview' : 'web');
    console.log('Environment:', window.ReactNativeWebView !== undefined ? 'WebView' : 'Web Browser');
    console.log('Using backend URL:', backendUrl);
  }, [backendUrl]);

  useEffect(() => {
    async function fetchMyCode() {
      try {
        setIsLoading(true);
        const res = await fetch(`${backendUrl}/coupleLink/couple/code`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setMyCode(data.coupleCode);
          await checkUserConnectionStatus(); // 최초 연결 상태 확인
        } else {
          console.error('커플 코드 조회 실패:', data.message);
          setError('커플 코드 조회에 실패했습니다.');
        }
      } catch (err) {
        console.error('커플 코드 조회 중 오류:', err);
        setError('서버 연결에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyCode();

    const intervalId = setInterval(() => {
      checkUserConnectionStatus();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [backendUrl, token]);

  const checkUserConnectionStatus = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/coupleLink/me`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const userData = await res.json();
        console.log('/me 응답:', userData); // ← 이 부분 꼭 확인
        if (userData.connected || userData.partnerId) {
          if (!isConnected) {
            setIsConnected(true);
            onNext();
          }
        } else {
          setIsConnected(false);
        }
      }
    } catch (err) {
      console.error('사용자 정보 조회 오류:', err);
    }
  };

  const steps = ['1', '2', '3', '4'];

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCode(input);
    setError('');
  };

  const sendMessageToNative = (message: string) => {
    if (environment === 'webview' && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(message);
    }
  };

  const handleConnect = async () => {
    if (!token) return setError('로그인이 필요합니다.');
    if (code.length !== 10) return setError('코드를 10자리로 입력해주세요.');

    try {
      setIsLoading(true);
      const res = await fetch(`${backendUrl}/coupleLink/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coupleCode: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message?.includes('이미 연결된 사용자')) {
          setIsConnected(true);
          sendMessageToNative(JSON.stringify({ type: 'COUPLE_CONNECTED', data: { success: true } }));
          alert('이미 연결된 사용자입니다. 다음 단계로 진행합니다.');
          onNext();
          return;
        }
        return setError(data.message || '연결 실패');
      }

      setIsConnected(true);
      sendMessageToNative(JSON.stringify({ type: 'COUPLE_CONNECTED', data: { success: true } }));
      alert('커플 연결 성공!');
      onNext();
    } catch (err) {
      console.error('커플 연결 중 오류:', err);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete = code.length === 10;

  const renderConnectedMessage = () => {
    if (isConnected) {
      return (
        <div className='bg-[#FFE5EC] p-4 rounded-lg mb-4 text-center'>
          <p className='text-[#FF4D6D] font-bold'>이미 연결된 사용자입니다</p>
          <p className='text-[#333333]'>당신의 커플 초대 코드는</p>
          <p className='text-[#333333] font-bold text-xl'>{myCode || '로딩 중...'}</p>
          <p className='text-[#333333]'>잠시 후 다음 단계로 자동 이동합니다...</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='flex flex-col min-h-[calc(100vh-56px)] w-full max-w-[412px] pt-8 py-4 justify-between'>
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

          {/* 연결된 사용자라면 메시지 표시 */}
          {renderConnectedMessage()}

          {/* 아직 연결되지 않은 사용자만 코드 입력 가능 */}
          {!isConnected && (
            <>
              <div className='flex flex-col gap-2'>
                <span className='h-6 text-center text-[#ff9bb3] text-xl'>당신의 코드</span>
                <div className='w-[134px] h-10 items-center text-center px-0.5 py-2 border-b border-[#ff9bb3]'>
                  <span className='text-[#333333] font-bold text-xl'>{isLoading ? '로딩 중...' : myCode || '코드 없음'}</span>
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <Input
                  width='w-full max-w-[380px] md:w-[380px]'
                  label='상대방의 초대 코드를 받으셨나요?'
                  placeholder='상대방의 초대 코드를 입력해 주세요.'
                  value={code}
                  maxLength={10}
                  onChange={handleCodeChange}
                />
                {error && <div className='text-[#FF2A2A] text-sm ml-0.5'>{error}</div>}
              </div>
            </>
          )}
        </div>
      </div>
      <div className='mt-16 w-full max-w-[412px] mx-auto px-4'>
        <Button isComplete={isComplete || isConnected} onClick={handleConnect} className='mb-4'>
          {isLoading ? '연결 중...' : isConnected ? '이미 연결됨' : '연결하기'}
        </Button>
      </div>
    </div>
  );
}

// 타입스크립트 global 확장
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
