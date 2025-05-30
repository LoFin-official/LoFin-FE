import React, { useState, Dispatch, SetStateAction } from 'react';
import Input from './Input';

const CategorySection = ({
  title,
  items,
  selectedItems,
  onToggleItem,
}: {
  title: string;
  items: string[];
  selectedItems: string[];
  onToggleItem: (item: string) => void;
}) => (
  <div className='flex flex-col gap-4 w-full max-w-[268px] md:w-[268px] h-auto'>
    <div className='h-5'>
      <span className='text-base font-bold text-[#333333]'>{title}</span>
    </div>
    <div className='flex flex-row flex-wrap gap-2 w-full max-w-[250px] md:w-[250px] h-auto self-end ml-auto'>
      {items.map((item, index) => {
        const isSelected = selectedItems.includes(item);
        return (
          <button
            key={index}
            onClick={() => onToggleItem(item)}
            className={`flex flex-col w-full max-w-[70px] md:w-[78px] h-[28px] justify-center items-center rounded-[4px] text-sm ${
              isSelected ? 'bg-[#FF9BB3]/20 text-[#FF9BB3] font-bold' : 'bg-white text-[#333333]'
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  </div>
);

type WishCategoryItemProps = {
  selectedItemsMap: Record<string, string[]>;
  setSelectedItemsMap: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  initialInputsMap?: Record<string, string>;
  selectedInputsMap: Record<string, string>;
  setSelectedInputsMap: Dispatch<SetStateAction<Record<string, string>>>;
};

export default function WishCategoryItem({
  selectedItemsMap,
  setSelectedItemsMap,
  initialInputsMap,
  selectedInputsMap,
  setSelectedInputsMap,
}: WishCategoryItemProps) {
  const [selectedCategory, setSelectedCategory] = useState('패션 & 악세');

  const handleToggleItem = (item: string) => {
    setSelectedItemsMap((prev) => {
      const current = prev[selectedCategory] || [];
      const totalSelectedCount = Object.values(prev).flat().length;

      if (current.includes(item)) {
        // 항목 제거
        const updatedMap = {
          ...prev,
          [selectedCategory]: current.filter((i) => i !== item),
        };

        // 관련 입력값도 제거 (하지만 메모리에는 유지)
        setSelectedInputsMap((inputs) => {
          const newInputs = { ...inputs };
          // 실제로 삭제하지 않고 빈 값으로 설정
          // 이렇게 하면 항목을 다시 선택했을 때 이전 입력값이 유지됨
          newInputs[item] = '';
          return newInputs;
        });

        // 카테고리에 아이템이 없으면 카테고리도 제거
        if (updatedMap[selectedCategory].length === 0) {
          const finalMap = { ...updatedMap };
          delete finalMap[selectedCategory];
          return finalMap;
        }

        return updatedMap;
      } else if (totalSelectedCount < 3) {
        // 항목 추가 (최대 3개까지)
        return {
          ...prev,
          [selectedCategory]: [...current, item],
        };
      } else {
        // 이미 3개 선택된 경우 변경 없음
        return prev;
      }
    });
  };

  const handleInputChange = (item: string, value: string) => {
    setSelectedInputsMap((prev) => ({
      ...prev,
      [item]: value,
    }));
  };

  const categoriesMap: Record<string, Record<string, string[]>> = {
    '패션 & 악세': {
      패션: ['모자', '자켓', '상의', '하의', '신발', '가방', '목도리', '장갑', '귀마개'],
      악세서리: ['반지', '목걸이', '팔찌', '귀걸이', '시계', '키링', '브로치', '지갑', '헤어핀'],
    },
    '뷰티 & 향기': {
      뷰티: ['립 메이크업', '눈 메이크업', '쿠션', '기초 케어', '집중 케어', '치크 & 도구', '썬크림', '고데기'],
      향기: ['향수', '디퓨저', '미스트', '캔들', '입욕제'],
    },
    정성: {
      정성: ['손편지', '포토북', '무드등', '꽃다발', '커플 액자', '수제 디저트'],
    },
    전자기기: {
      전자기기: ['무선 이어폰', '스마트 워치', '폴라로이드', '포토 프린터'],
    },
    기타: {
      '원하시는 카테고리가 없으신가요?': ['기타'],
    },
  };

  const sideMenu = Object.keys(categoriesMap);

  // 선택된 전체 아이템 리스트 (모든 카테고리에서)
  const allSelectedItems = Object.values(selectedItemsMap).flat();

  return (
    <>
      <div className='flex flex-col items-center justify-center w-full max-w-[388px] md:w-[388px] h-[368px] border-[#eeeeee] border-b border-t mx-auto'>
        <div className='flex w-full md:w-[380px] h-[336px]'>
          {/* 왼쪽 사이드바 */}
          <div className='w-full max-w-[80px] md:w-[80px] h-full bg-[#eeeeee]'>
            {sideMenu.map((label, index) => {
              const isActive = label === selectedCategory;
              return (
                <div
                  key={index}
                  className={`flex flex-col w-full h-9 justify-center items-center cursor-pointer ${isActive ? 'bg-[#ffffff]' : ''}`}
                  onClick={() => {
                    setSelectedCategory(label);
                  }}
                >
                  <span className={`h-5 text-center ${isActive ? 'text-[#333333]' : 'text-[#999999]'}`}>{label}</span>
                </div>
              );
            })}
          </div>

          {/* 오른쪽 콘텐츠 */}
          <div className='flex flex-col gap-8 flex-1 h-full w-full max-w-[300px] md:w-[300px] px-2 py-4 overflow-auto'>
            {Object.entries(categoriesMap[selectedCategory]).map(([title, items]) => (
              <CategorySection
                key={title}
                title={title}
                items={items}
                selectedItems={selectedItemsMap[selectedCategory] || []}
                onToggleItem={handleToggleItem}
              />
            ))}
          </div>
        </div>
      </div>
      {/* 선택된 아이템에 대한 Input 필드들 */}
      <div className='flex flex-col gap-8 w-full max-w-[348px]'>
        <div className='h-6 text-xl font-bold text-[#333333] w-full max-w-[380px] md:w-[380px] mx-auto text-left'>선택된 카테고리</div>
        {allSelectedItems.length === 0 ? (
          <div className='flex flex-col gap-0.5 px-1 text-center'>
            <span className='h-6 text-[#767676] text-xl font-bold'>아직 선택된 항목이 없어요.</span>
            <span className='h-5 text-[#999999] text-sm'>마음에 드는 선물을 최대 3개까지 선택할 수 있어요!</span>
          </div>
        ) : (
          allSelectedItems.map((item) => (
            <Input
              width='w-full max-w-[376px] md:w-[376px]'
              key={item}
              label={`${item}`}
              placeholder='해당 카테고리 상품의 상세 정보를 입력해 주세요'
              value={selectedInputsMap[item] || ''}
              onChange={(e) => handleInputChange(item, e.target.value)}
            />
          ))
        )}
      </div>
    </>
  );
}
