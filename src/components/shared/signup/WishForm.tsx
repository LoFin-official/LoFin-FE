import React, { useState, useEffect } from 'react';
import Button from '@/components/shared/Button';
import WishCategoryItem from '@/components/shared/WishCategoryItem';
import { ProgressIcon, ProgressingIcon } from '@/assets/icons/SvgIcon';
import { backendUrl } from '@/config/config';

interface Props {
  onNext: () => void;
  currentStep: number;
}

export default function WishForm({ onNext, currentStep }: Props) {
  const [selectedItemsMap, setSelectedItemsMap] = useState<Record<string, string[]>>({});
  const [selectedInputsMap, setSelectedInputsMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const steps = ['1', '2', '3', '4'];

  const allSelectedItems = Object.values(selectedItemsMap).flat();
  const isAnyItemSelected = allSelectedItems.length > 0;

  // JWT 토큰 (로컬스토리지 등에서 가져오는 예시)
  const token = localStorage.getItem('token') || '';

  // 백엔드에서 저장된 선택 데이터 불러오기
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchSelection() {
      try {
        const response = await fetch(`${backendUrl}/wishlist/selection`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.warn('기존 선택 데이터 로드 실패');
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.selection && data.selection.selectedCategories) {
          // selectedCategories 구조 예: [{mainCategory, subCategory, details}]
          const newSelectedItemsMap: Record<string, string[]> = {};
          const newSelectedInputsMap: Record<string, string> = {};

          data.selection.selectedCategories.forEach((item: any) => {
            if (!newSelectedItemsMap[item.mainCategory]) {
              newSelectedItemsMap[item.mainCategory] = [];
            }
            newSelectedItemsMap[item.mainCategory].push(item.subCategory);
            if (item.details) {
              newSelectedInputsMap[item.subCategory] = item.details;
            }
          });

          setSelectedItemsMap(newSelectedItemsMap);
          setSelectedInputsMap(newSelectedInputsMap);
        }
      } catch (error) {
        console.error('선택 데이터 불러오기 에러:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSelection();
  }, [token]);

  // 선택 데이터를 백엔드 형식에 맞게 변환하는 함수
  const transformSelectedCategories = () => {
    return Object.entries(selectedItemsMap).map(([mainCategory, subCategories]) => ({
      mainCategory,
      subCategories,
    }));
  };

  // 추가 상세정보도 보내야 하므로 details 객체 생성
  const createDetailsObject = () => {
    const details: Record<string, string> = {};
    Object.entries(selectedInputsMap).forEach(([key, value]) => {
      details[key] = value;
    });
    return details;
  };

  // 선택 저장 API 호출 함수
  const saveSelection = async () => {
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/wishlist/selection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedCategories: transformSelectedCategories(),
          details: createDetailsObject(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`저장 실패: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      console.log('저장 성공:', data);

      // 선택 완료 API 호출
      const completeResponse = await fetch(`${backendUrl}/wishlist/selection/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json();
        alert(`완료 처리 실패: ${errorData.message}`);
        return;
      }

      alert('카테고리 선택이 완료되었습니다.');
      onNext();
    } catch (error) {
      console.error('오류 발생:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div className='flex justify-center items-center min-h-[calc(100vh-56px)]'>로딩 중...</div>;
  }

  return (
    <div className='flex flex-col min-h-[calc(100vh-56px)] w-full max-w-[412px] mx-auto pt-8 px-4'>
      <div className='flex flex-1 justify-center w-full max-w-[388px] mx-auto'>
        <div className='flex flex-col gap-8 items-center'>
          <div className='flex flex-row gap-1 items-center'>
            {steps.map((step, index) => (
              <div key={index} className='flex items-center gap-1 w-full max-w-[380px] mx-auto'>
                <ProgressIcon text={step} active={index <= currentStep} />
                {index < steps.length - 1 && <ProgressingIcon active={index < currentStep} />}
              </div>
            ))}
          </div>
          <div className='flex flex-col gap-0.5 w-full max-w-[380px] text-center'>
            <span className='h-6 text-[#333333] text-xl font-bold'>기념일에 받고 싶은 선물을 선택하세요!</span>
            <span className='h-5 text-[#767676]'>카테고리에서 원하는 선물을 고르거나 직접 입력도 가능해요!</span>
          </div>

          <WishCategoryItem
            selectedItemsMap={selectedItemsMap}
            setSelectedItemsMap={setSelectedItemsMap}
            selectedInputsMap={selectedInputsMap}
            setSelectedInputsMap={setSelectedInputsMap}
          />
        </div>
      </div>
      <div className='mt-16 w-full max-w-[412px] mx-auto px-4'>
        <Button
          isComplete={isAnyItemSelected}
          onClick={() => {
            if (!isAnyItemSelected) return;
            saveSelection();
          }}
          className='mb-4 '
        >
          선택 완료
        </Button>
      </div>
    </div>
  );
}
