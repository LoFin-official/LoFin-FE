import { ProgressIcon, ProgressingIcon } from '@/assets/icons/SvgIcon';
import Button from '@/components/shared/Button';
import WishCategoryItem from '@/components/shared/WishCategoryItem';
import React, { useState } from 'react';

export default function WishForm({ onNext, currentStep }: { onNext: () => void; currentStep: number }) {
  const [selectedItemsMap, setSelectedItemsMap] = useState<Record<string, string[]>>({});

  const allSelectedItems = Object.values(selectedItemsMap).flat();
  const isAnyItemSelected = allSelectedItems.length > 0;

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
            <div className='flex flex-col gap-0.5 w-[380px] text-center'>
              <span className='h-6 text-[#333333] text-xl font-bold'>기념일에 받고 싶은 선물을 선택하세요!</span>
              <span className='h-5 text-[#767676]'>카테고리에서 원하는 선물을 고르거나 직접 입력할 수도 있어요.</span>
            </div>
            <WishCategoryItem selectedItemsMap={selectedItemsMap} setSelectedItemsMap={setSelectedItemsMap} />
          </div>
        </div>
        <Button
          isComplete={isAnyItemSelected}
          onClick={() => {
            if (!isAnyItemSelected) return;
            onNext();
          }}
          className='mb-4'
        >
          선택 완료
        </Button>
      </div>
    </>
  );
}
