import Header from '@/components/shared/Header';
import CoupleCompletePage from '@/components/shared/signup/Couple-Complete';
import CoupleConnectPage from '@/components/shared/signup/Couple-Connect';
import ProfileForm from '@/components/shared/signup/ProfileForm';
import WishForm from '@/components/shared/signup/WishForm';
import React, { useState } from 'react';
import { backendUrl } from '@/config/config';

export default function SignupFlowPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // 건너뛰기 시 백엔드 호출 후 다음 단계 이동
  const handleSkip = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/wishlist/selection/skip`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`건너뛰기 실패: ${errorData.message}`);
        return;
      }

      // 성공하면 다음 단계로 이동
      nextStep();
    } catch (error) {
      console.error('건너뛰기 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  const getHeaderText = () => {
    switch (step) {
      case 1:
        return '프로필 설정';
      case 2:
        return '위시리스트';
      case 3:
        return '커플 연결';
      case 4:
        return '커플 연결 완료';
      default:
        return '';
    }
  };

  const showBackButton = step !== 1 && step !== 4;

  const rightElement =
    step === 2 ? (
      <button className='h-5 text-sm text-[#767676] cursor-pointer' onClick={handleSkip}>
        건너뛰기
      </button>
    ) : null;

  return (
    <div className=''>
      <Header onBack={prevStep} showBackButton={showBackButton} rightElement={rightElement}>
        {getHeaderText()}
      </Header>
      {step === 1 && <ProfileForm onNext={nextStep} currentStep={0} />}
      {step === 2 && <WishForm onNext={nextStep} currentStep={1} />}
      {step === 3 && <CoupleConnectPage onNext={nextStep} currentStep={2} />}
      {step === 4 && <CoupleCompletePage currentStep={3} />}
    </div>
  );
}
