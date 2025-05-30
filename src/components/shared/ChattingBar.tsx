import { DayDeleteIcon, DayEditIcon, EmojiEditIcon, EmojiIcon, ImageIcon, PlusIcon, SendIcon } from '@/assets/icons/SvgIcon';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function ChattingBar() {
  const [openPanel, setOpenPanel] = useState<'plus' | 'emoji' | null>(null);
  const [inputText, setInputText] = useState('');

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [emojis, setEmojis] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]); // 임시 이모티콘 리스트
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmojiIndex, setSelectedEmojiIndex] = useState<number | null>(null);

  const router = useRouter();

  const togglePanel = (type: 'plus' | 'emoji') => {
    setOpenPanel((prev) => (prev === type ? null : type));
  };

  // 애니메이션 효과
  useEffect(() => {
    if (openPanel) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10); // 다음 프레임에 트리거
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300); // 애니메이션 후 DOM 제거
      return () => clearTimeout(timer);
    }
  }, [openPanel]);

  const handleLongPressStart = (index: number) => {
    const timer = setTimeout(() => {
      setSelectedEmojiIndex(index);
      setIsModalOpen(true);
    }, 600); // 600ms 이상 눌렀을 때만 실행

    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleDeleteClick = () => {
    if (selectedEmojiIndex !== null) {
      setEmojis((prev) => prev.filter((_, i) => i !== selectedEmojiIndex));
    }
    setIsModalOpen(false);
    setSelectedEmojiIndex(null);
  };

  const handleModalClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleCreateEmoji = () => {
    router.push('/chat/emoji/create');
  };

  return (
    <>
      <div className='fixed bottom-0 w-full max-w-[412px]'>
        <div className='h-[48px] bg-white flex flex-row gap-1 px-1 py-1'>
          <div className='flex ml-1 my-1 cursor-pointer'>
            <PlusIcon onClick={() => togglePanel('plus')} />
          </div>
          <div className='w-full max-w-[324px] h-[40px] rounded-[20px] bg-[#eeeeee] flex flex-row gap-1 px-2 py-1'>
            <input
              className='w-full max-w[268px] md:w-[268px] h-6 ml-1 my-1 font-bold placeholder:text-[#cccccc] text-[#333333] bg-[#eeeeee] focus:outline-none'
              placeholder='메시지 보내기'
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onFocus={() => setOpenPanel(null)}
            ></input>
            <EmojiIcon className={'cursor-pointer'} onClick={() => togglePanel('emoji')} />
          </div>
          <div className='flex mr-1 my-1'>
            <SendIcon className={inputText.trim() ? 'text-[#FF9BB3] cursor-pointer' : 'text-[#d9d9d9]'} onClick={() => {}}></SendIcon>
          </div>
        </div>

        {isVisible && (
          <div
            className={`w-full border-t border-[#d9d9d9] bg-white overflow-hidden transition-all duration-300 ease-in-out
          ${isAnimating ? 'max-h-[252px]' : 'max-h-0'}`}
          >
            {openPanel === 'plus' && (
              <div className='flex flex-row gap-8 px-6 py-4'>
                <div className='w-full max-w-[66px] h-[68px] flex flex-col gap-1 my-auto cursor-pointer'>
                  <EmojiEditIcon onClick={handleCreateEmoji} />
                  <div className='text-xs font-bold text-[#333333] text-center'>이모티콘 제작</div>
                </div>
                <div className='w-full max-w-[66px] h-[68px] flex flex-col gap-1 my-auto'>
                  <ImageIcon onClick={() => {}} />
                  <div className='text-xs font-bold text-[#333333] text-center'>갤러리</div>
                </div>
              </div>
            )}

            {/* 생성된 이모티콘 */}
            {openPanel === 'emoji' && (
              <div className='h-[252px] flex flex-col gap-2 bg-white px-4 py-4 overflow-y-auto scrollbar-hide'>
                <div className='flex flex-row flex-wrap justify-start gap-2 px-1'>
                  {emojis.map((emoji, index) => (
                    <div
                      key={index}
                      className='w-[68px] h-[68px] bg-[#eeeeee] rounded-lg'
                      onMouseDown={() => handleLongPressStart(index)}
                      onMouseUp={handleLongPressEnd}
                      onMouseLeave={handleLongPressEnd}
                      onTouchStart={() => handleLongPressStart(index)}
                      onTouchEnd={handleLongPressEnd}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <>
          <div className='fixed inset-0 flex items-center justify-center bg-[#1B1B1B] bg-opacity-50 z-50'>
            <div className='w-52 h-24 relative'>
              <div className='w-52 h-24 left-0 top-0 absolute bg-[#ffffff] rounded-xl' />
              <div className='w-32 left-[40px] top-[16px] absolute text-center justify-start text-[#333333] text-base font-medium leading-tight'>
                삭제하시겠습니까?
              </div>
              <div
                className='left-[137px] top-[61px] absolute text-right justify-start text-[#FF4C80] text-base font-medium leading-tight cursor-pointer'
                onClick={handleDeleteClick}
              >
                삭제
              </div>
              <div
                className='left-[36px] top-[61px] absolute text-right justify-start text-[#333333] text-base font-medium  leading-tight cursor-pointer'
                onClick={handleModalClose}
              >
                취소
              </div>
              <div className='w-52 h-px left-0 top-[52px] absolute bg-[#EEEEEE]' />
              <div className='w-px h-9 left-[100px] top-[53px] absolute bg-[#EEEEEE]' />
            </div>
          </div>
        </>
      )}
    </>
  );
}
