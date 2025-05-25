import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import React, { ReactNode, useEffect, useState } from 'react';
import Button from '@/components/shared/Button';
import WishCategoryItem from '@/components/shared/WishCategoryItem';
import { useRouter } from 'next/router';

const backendUrl = 'http://192.168.208.161:5000'; // 백엔드 서버 주소

export default function WishPage() {
  const [selectedItemsMap, setSelectedItemsMap] = useState<Record<string, string[]>>({});
  const [initialItemsMap, setInitialItemsMap] = useState<Record<string, string[]>>({});
  const [initialInputsMap, setInitialInputsMap] = useState<Record<string, string>>({});
  const [selectedInputsMap, setSelectedInputsMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // 메시지 상태 추가
  const router = useRouter();

  useEffect(() => {
    const fetchInitialWishList = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('토큰이 없습니다.');
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${backendUrl}/wishlistUpdate/item`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('서버에서 위시리스트를 불러오는 데 실패했습니다.');
        }

        const data = await res.json();
        console.log(' 위시리스트 fetch 결과:', data);

        const fetchedItemsMap: Record<string, string[]> = {};
        const fetchedInputsMap: Record<string, string> = {};

        if (data?.selectedCategories && Array.isArray(data.selectedCategories)) {
          data.selectedCategories.forEach((item: any) => {
            const { mainCategory, subCategory, details } = item;
            if (!fetchedItemsMap[mainCategory]) {
              fetchedItemsMap[mainCategory] = [];
            }
            // 중복 방지 추가
            if (!fetchedItemsMap[mainCategory].includes(subCategory)) {
              fetchedItemsMap[mainCategory].push(subCategory);
            }
            fetchedInputsMap[subCategory] = details || '';
          });
        } else {
          console.warn('⚠️ selectedCategories가 비어있거나 존재하지 않음:', data);
        }

        setSelectedItemsMap(fetchedItemsMap);
        setInitialItemsMap(fetchedItemsMap);
        setSelectedInputsMap(fetchedInputsMap);
        setInitialInputsMap(fetchedInputsMap);
      } catch (error) {
        console.error('위시리스트 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialWishList();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    let itemsChanged = false;
    let inputsChanged = false;

    const initialItemsSet = new Set(Object.entries(initialItemsMap).flatMap(([category, items]) => items.map((item) => `${category}:${item}`)));
    const currentItemsSet = new Set(Object.entries(selectedItemsMap).flatMap(([category, items]) => items.map((item) => `${category}:${item}`)));

    if (initialItemsSet.size !== currentItemsSet.size || [...initialItemsSet].some((item) => !currentItemsSet.has(item))) {
      itemsChanged = true;
    }

    const currentSelectedItems = Object.values(selectedItemsMap).flat();
    for (const item of currentSelectedItems) {
      if ((initialInputsMap[item] || '') !== (selectedInputsMap[item] || '')) {
        inputsChanged = true;
        break;
      }
    }

    setIsComplete(itemsChanged || inputsChanged);
  }, [selectedItemsMap, selectedInputsMap, initialItemsMap, initialInputsMap, isLoading]);

  const handleComplete = async () => {
    if (!isComplete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('토큰이 없습니다.');
        return;
      }

      const selectedCategoriesPayload: any[] = [];

      Object.entries(selectedItemsMap).forEach(([mainCategory, subCategories]) => {
        subCategories.forEach((subCategory) => {
          selectedCategoriesPayload.push({
            mainCategory,
            subCategory,
            details: selectedInputsMap[subCategory] || '',
          });
        });
      });

      const res = await fetch('http://192.168.208.161:5000/wishlistUpdate/item/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedCategories: selectedCategoriesPayload,
        }),
      });

      if (!res.ok) {
        throw new Error('위시리스트 수정에 실패했습니다.');
      }

      const data = await res.json();
      console.log('위시리스트 수정 성공:', data);

      setInitialItemsMap({ ...selectedItemsMap });
      setInitialInputsMap({ ...selectedInputsMap });
      setIsComplete(false);

      // alert 창 띄우기
      alert('위시리스트가 수정되었습니다.');

      router.replace('/my-page');
    } catch (error) {
      console.error('위시리스트 수정 오류:', error);
      alert('위시리스트 수정 중 오류가 발생했습니다.');
    }
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

            {/* 수정 성공 메시지 */}
            {successMessage && <div className='mt-4 text-green-600 font-semibold'>{successMessage}</div>}
          </div>
        </div>
        <Button isComplete={isComplete} onClick={handleComplete} className='mb-4'>
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
