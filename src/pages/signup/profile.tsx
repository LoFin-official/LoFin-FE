import Header from '@/components/shared/Header';
import CoupleConnectPage from '@/components/shared/signup/Couple-Connect';
import ProfileForm from '@/components/shared/signup/ProfileForm';
import WishForm from '@/components/shared/signup/WishForm';
import React, { useState } from 'react';

export default function SignupFlowPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const getHeaderText = () => {
    switch (step) {
      case 1:
        return '프로필 설정';
      case 2:
        return '위시리스트';
      case 3:
        return '커플 연결';
      default:
        return '';
    }
  };

  const showBackButton = step !== 1;

  const rightElement =
    step === 2 ? (
      <button className='h-5 text-sm text-[#767676] cursor-pointer' onClick={nextStep}>
        건너뛰기
      </button>
    ) : null;

  return (
    <div className=''>
      <Header onBack={prevStep} showBackButton={showBackButton} rightElement={rightElement}>
        {getHeaderText()}
      </Header>
      {step === 1 && <ProfileForm onNext={nextStep} />}
      {step === 2 && <WishForm onNext={nextStep} onBack={prevStep} />}
      {step === 3 && <CoupleConnectPage onNext={nextStep} onBack={prevStep} />}
    </div>
  );
}
