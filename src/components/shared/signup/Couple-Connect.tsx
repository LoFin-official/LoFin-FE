import { ProgressIcon, ProgressingIcon } from '@/assets/icons/SvgIcon';
import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import React, { ReactNode, useState } from 'react';

export default function CoupleConnectPage() {
  const [currentStep, setCurrentStep] = useState(2);

  const steps = ['1', '2', '3', '4'];
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
          </div>
        </div>
        <Button isComplete={false} className='mb-4'>
          연결하기
        </Button>
      </div>
    </>
  );
}

CoupleConnectPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>커플 연결</Header>
      {page}
    </>
  );
};
