import { ProgressIcon, ProgressingIcon } from '@/assets/icons/SvgIcon';
import Button from '@/components/shared/Button';
import React, { useEffect, useState } from 'react';
import Input from '../Input';
import { backendUrl } from '@/config/config';
// 서버 URL 결정 함수 - 웹과 WebView 환경을 모두 지원
const getBackendUrl = () => {
  // 실행 환경 확인 (WebView인지 여부 확인)
  const isRunningInWebView = window.ReactNativeWebView !== undefined;

  if (isRunningInWebView) {
    // WebView 환경 (Expo 앱)에서는 로컬 네트워크 IP 사용
    return 'http://192.168.208.161:5000';
  } else {
    // 일반 웹 브라우저 환경에서는 localhost 사용
    return 'http://localhost:5000';
  }
};

export default function CoupleConnectPage({ onNext, currentStep }: { onNext: () => void; currentStep: number }) {
  const [isConnected, setIsConnected] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [myCode, setMyCode] = useState(''); // 내 코드 받아오기
  const [isLoading, setIsLoading] = useState(false);
  const [environment, setEnvironment] = useState<'web' | 'webview'>('web');
  const [userStatus, setUserStatus] = useState<'not_connected' | 'connected'>('not_connected');

  // 백엔드 URL 설정
  const backendUrl = getBackendUrl();

  // JWT 토큰 (로컬스토리지 등에서 가져오기)
  const token = localStorage.getItem('token') || '';

  // 실행 환경 확인
  useEffect(() => {
    if (window.ReactNativeWebView !== undefined) {
      setEnvironment('webview');
    } else {
      setEnvironment('web');
    }

    // 디버깅용 로그
    console.log('Environment:', window.ReactNativeWebView !== undefined ? 'WebView' : 'Web Browser');
    console.log('Using backend URL:', backendUrl);
  }, [backendUrl]);

  // 내 coupleCode 받아오기 및 연결 상태 확인 (컴포넌트 마운트 시)
  useEffect(() => {
    async function fetchMyCode() {
      try {
        setIsLoading(true);
        const res = await fetch(`${backendUrl}/coupleLink/couple/code`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setMyCode(data.coupleCode);

          // 사용자 정보 가져와서 이미 연결되었는지 확인
          await checkUserConnectionStatus();
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
  }, [token, backendUrl]);

  // 사용자 연결 상태 확인 함수
  const checkUserConnectionStatus = async () => {
    try {
      // 사용자 정보를 가져오는 API 엔드포인트 호출
      // 참고: 실제 API 엔드포인트는 프로젝트에 맞게 수정해야 합니다
      const res = await fetch(`${backendUrl}/user/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        // 이미 연결된 사용자인 경우
        if (userData.connected || userData.partnerId) {
          setUserStatus('connected');
          // 자동으로 다음 페이지로 이동하는 타이머 설정
          setTimeout(() => {
            onNext();
          }, 3000); // 3초 후 자동으로 다음 페이지로 이동
        } else {
          setUserStatus('not_connected');
        }
      }
    } catch (err) {
      console.error('사용자 정보 조회 오류:', err);
    }
  };

  const steps = ['1', '2', '3', '4'];

  // 코드 입력 핸들러
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase(); // 대문자 변환
    const alphanumericOnly = input.replace(/[^A-Z0-9]/g, ''); // 영문 대문자 + 숫자만 허용
    setCode(alphanumericOnly);
    setError('');
  };

  // WebView에서 메시지 전송 (필요한 경우)
  const sendMessageToNative = (message: string) => {
    if (environment === 'webview' && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(message);
    }
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
        // 이미 연결된 사용자인 경우 처리
        if (data.message && data.message.includes('이미 연결된 사용자')) {
          setUserStatus('connected');
          setError('');

          // 환경에 따라 적절한 알림 사용
          if (environment === 'webview') {
            sendMessageToNative(
              JSON.stringify({
                type: 'COUPLE_CONNECTED',
                data: { success: true },
              })
            );
          }

          alert('이미 연결된 사용자입니다. 다음 단계로 진행합니다.');
          onNext(); // 다음 단계로 이동
          return;
        }

        setError(data.message || '연결 실패');
        return;
      }

      setIsConnected(true);
      setUserStatus('connected');
      setError('');

      // 환경에 따라 적절한 알림 사용
      if (environment === 'webview') {
        sendMessageToNative(
          JSON.stringify({
            type: 'COUPLE_CONNECTED',
            data: { success: true },
          })
        );
      }

      alert('커플 연결 성공!');
      onNext(); // 다음 단계로 이동
    } catch (err) {
      console.error('커플 연결 중 오류:', err);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete = code.length === 10;

  // 이미 연결된 사용자인 경우 표시할 메시지
  const renderConnectedMessage = () => {
    if (userStatus === 'connected') {
      return (
        <div className='bg-[#FFE5EC] p-4 rounded-lg mb-4 text-center'>
          <p className='text-[#FF4D6D] font-bold'>이미 연결된 사용자입니다</p>
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

          {/* 이미 연결된 사용자일 경우 메시지 표시 */}
          {renderConnectedMessage()}

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
        </div>
      </div>
      <div className='mt-16 w-full max-w-[412px] mx-auto px-4'>
        <Button isComplete={isComplete || userStatus === 'connected'} onClick={handleConnect} className='mb-4'>
          {isLoading ? '연결 중...' : userStatus === 'connected' ? '이미 연결됨' : '연결하기'}
        </Button>
      </div>
    </div>
  );
}

// window에 ReactNativeWebView 프로퍼티를 추가 (타입스크립트 정의)
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
