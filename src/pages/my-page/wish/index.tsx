import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import React, { ReactNode, useEffect, useState } from 'react';
import Button from '@/components/shared/Button';
import WishCategoryItem from '@/components/shared/WishCategoryItem';

// 예시 임시 데이터 (나중엔 API 호출로 대체)
const mockFetchedWishData: Record<string, string[]> | null = {
  '패션 & 악세': ['모자', '자켓'],
  '뷰티 & 향기': ['향수'],
  // null이라면 → 건너뛰고 선택 안 한 사용자
  // {} 라면 → 선택했지만 모두 해제한 사용자
};

const mockFetchedWishDetails: Record<string, string> = {
  모자: '베이지색 볼캡, 평소에 자주 착용하는 스타일',
  자켓: '',
  향수: '',
};

export default function WishPage() {
  const [selectedItemsMap, setSelectedItemsMap] = useState<Record<string, string[]>>({});
  const [initialItemsMap, setInitialItemsMap] = useState<Record<string, string[]>>({});
  const [initialInputsMap, setInitialInputsMap] = useState<Record<string, string>>({});
  const [selectedInputsMap, setSelectedInputsMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  // 위시리스트가 존재하면 미리 반영
  useEffect(() => {
    const fetchInitialWishList = async () => {
      // API 대신 목업 데이터 사용
      const fetchedItems = mockFetchedWishData || {};
      const fetchedInputs = mockFetchedWishDetails || {};

      setSelectedItemsMap({ ...fetchedItems });
      setInitialItemsMap({ ...fetchedItems });
      setSelectedInputsMap({ ...fetchedInputs });
      setInitialInputsMap({ ...fetchedInputs });

      setIsLoading(false);
    };

    fetchInitialWishList();
  }, []);

  // 변경 여부 체크
  useEffect(() => {
    if (isLoading) return;

    // 1. 선택된 아이템 비교 (카테고리 및 아이템)
    let itemsChanged = false;

    // 선택된 아이템 목록이 다른지 확인
    const initialItems = new Set(Object.entries(initialItemsMap).flatMap(([category, items]) => items.map((item) => `${category}:${item}`)));
    const currentItems = new Set(Object.entries(selectedItemsMap).flatMap(([category, items]) => items.map((item) => `${category}:${item}`)));

    // Set 크기가 다르거나, 다른 아이템이 포함되어 있다면 변경된 것
    if (initialItems.size !== currentItems.size) {
      itemsChanged = true;
    } else {
      // 모든 초기 아이템이 현재 아이템에 포함되어 있는지 체크
      for (const item of initialItems) {
        if (!currentItems.has(item)) {
          itemsChanged = true;
          break;
        }
      }
    }

    // 2. 입력된 상세 정보 비교
    let inputsChanged = false;

    // 현재 선택된 아이템 목록 (문자열 배열)
    const currentSelectedItems = Object.values(selectedItemsMap).flat();

    // 각 선택된 아이템에 대해 입력값 변경 여부 확인
    for (const item of currentSelectedItems) {
      const initialValue = initialInputsMap[item] || '';
      const currentValue = selectedInputsMap[item] || '';

      if (initialValue !== currentValue) {
        inputsChanged = true;
        break;
      }
    }

    console.log('입력값 변경 감지:', inputsChanged);
    console.log('아이템 변경 감지:', itemsChanged);
    console.log('초기 입력값:', initialInputsMap);
    console.log('현재 입력값:', selectedInputsMap);

    setIsComplete(itemsChanged || inputsChanged);
  }, [selectedItemsMap, selectedInputsMap, initialItemsMap, initialInputsMap, isLoading]);

  const handleComplete = () => {
    // 저장 로직 - 실제로는 API 호출
    console.log('저장할 선택된 아이템:', selectedItemsMap);
    console.log('저장할 입력값:', selectedInputsMap);
    // 저장 후 초기값 업데이트
    setInitialItemsMap({ ...selectedItemsMap });
    setInitialInputsMap({ ...selectedInputsMap });
    setIsComplete(false);
    // 성공 메시지 등 추가 로직
  };

  return (
    <>
      <div className='flex flex-col min-h-[calc(100vh-112px)] pt-16 pb-14 justify-between'>
        <div className='flex flex-1 justify-center'>
          <div className='flex flex-col gap-8 items-center'>
            <div className='flex flex-col gap-0.5 w-[380px] text-center'>
              <span className='h-6 text-[#333333] text-xl font-bold'>기념일에 받고 싶은 선물을 선택하세요!</span>
              <span className='h-5 text-[#767676]'>카테고리에서 원하는 선물을 고르거나 직접 입력할 수도 있어요.</span>
            </div>
            {!isLoading && (
              <WishCategoryItem
                selectedItemsMap={selectedItemsMap}
                setSelectedItemsMap={setSelectedItemsMap}
                initialInputsMap={initialInputsMap}
                selectedInputsMap={selectedInputsMap}
                setSelectedInputsMap={setSelectedInputsMap}
              />
            )}
          </div>
        </div>
        <Button isComplete={isComplete} className='mb-4'>
          선택 완료
        </Button>
      </div>
    </>
  );
}

WishPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>위시리스트</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
