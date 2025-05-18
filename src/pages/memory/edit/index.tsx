import React, { useState, ReactNode, useRef } from 'react';
import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import { ImageCloseIcon, MemoryDateIcon } from '@/assets/icons/SvgIcon';
import BottomSheetDate from '@/components/shared/BottomSheetDate';
import Button from '@/components/shared/Button';
import { useRouter } from 'next/router';

interface Memory {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  position: { x: number; y: number };
  rotation: number;
  createdAt: string;
  updatedAt: string;
}

export default function MemoryEditPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const textarea = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const resizeHeight = (textarea: React.RefObject<HTMLTextAreaElement | null>, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textarea.current) {
      textarea.current.style.height = 'auto';
      textarea.current.style.height = textarea.current.scrollHeight + 'px';
      setText(e.target.value);
    }
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${y}. ${m}. ${d}`);
    setIsDateSheetOpen(false);
  };

  // 제목 input onChange 핸들러
  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 이미지 데이터 배열 (임의로 id 부여)
  const [images, setImages] = useState([{ id: 1 }, { id: 2 }, { id: 3 }]);

  // 삭제 함수: 클릭된 id 제외한 새 배열로 상태 변경
  const handleRemove = (idToRemove: number) => {
    setImages(images.filter((img) => img.id !== idToRemove));
  };

  // 버튼 활성화 조건
  const isComplete = title.trim() !== '' && text.trim() !== '' && selectedDate !== '';

  const handleMemory = () => {
    if (isComplete) {
      router.push('/memory');
    }
  };

  return (
    <>
      <div className='flex flex-col h-[calc(100vh-112px)] w-full max-w-[412px] mx-auto px-4 pt-8 pb-4'>
        {/* 추억 제목 영역 */}
        <div className='w-full max-w-[380px] h-9 py-2 px-0.5 border-b border-[#cccccc] mb-4'>
          <input
            className='w-full h-5 text-xl text-[#333333] placeholder:text-[#cccccc] font-bold focus:outline-none'
            value={title}
            onChange={onChangeTitle}
            placeholder='제목을 입력해 주세요.'
          />
        </div>

        {/* 추억 내용 영역 */}
        <div className='flex-grow w-full max-w-[380px]'>
          <div className='w-full max-w-[364px] h-auto mx-2'>
            <textarea
              rows={1}
              className='w-full max-h-[200px] text-base text-[#767676] resize-none overflow-y-auto leading-relaxed focus:outline-none'
              placeholder='추억 내용을 작성해 주세요.'
              ref={textarea}
              value={text}
              onChange={(e) => resizeHeight(textarea, e)}
            />
          </div>
        </div>

        {/* 하단 고정 영역 */}
        <div className='flex-shrink-0'>
          {/* 사진 영역 */}
          {images.length > 0 && (
            <div className='w-full max-w-[380px] h-[216px] px-0.5 py-2 border-t border-b border-[#eeeeee] overflow-x-auto overflow-y-hidden scrollbar-hide'>
              <div className='flex flex-row gap-2 w-max'>
                {images.map((img) => (
                  <div key={img.id} className='w-[150px] h-[200px] rounded-md bg-[#eeeeee] relative'>
                    <div className='absolute top-2 right-2 cursor-pointer' onClick={() => handleRemove(img.id)}>
                      <ImageCloseIcon />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 날짜 선택 영역 */}
          <div className='w-full max-w-[380px] h-[52px] px-2 py-4'>
            <div
              className={`flex flex-row gap-1 text-base cursor-pointer ${selectedDate ? 'text-[#333333]' : 'text-[#999999]'}`}
              onClick={() => setIsDateSheetOpen(true)}
            >
              <MemoryDateIcon />
              <div className='h-6'>{selectedDate ? selectedDate : '기록할 날짜를 선택해 주세요.'}</div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className='w-full max-w-[380px]'>
            <Button isComplete={isComplete} onClick={handleMemory}>
              수정 완료
            </Button>
          </div>
        </div>
      </div>
      <BottomSheetDate isOpen={isDateSheetOpen} onClose={() => setIsDateSheetOpen(false)} height={'380px'} onSelectDate={handleDateSelect} />
    </>
  );
}

MemoryEditPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>추억 수정정</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
