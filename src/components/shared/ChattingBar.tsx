import { DayDeleteIcon, DayEditIcon, EmojiEditIcon, EmojiIcon, ImageIcon, PlusIcon, SendIcon } from '@/assets/icons/SvgIcon';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '@/config/config';

export default function ChattingBar() {
  const [openPanel, setOpenPanel] = useState<'plus' | 'emoji' | null>(null);
  const [inputText, setInputText] = useState('');

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [emojis, setEmojis] = useState<{ _id: string; imageUrl: string }[]>([]);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmojiId, setSelectedEmojiId] = useState<string | null>(null);

  const router = useRouter();

  const togglePanel = (type: 'plus' | 'emoji') => {
    setOpenPanel((prev) => (prev === type ? null : type));
  };

  const fetchStickers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${backendUrl}/emoticon`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setEmojis(data.stickers);
      } else {
        console.error('스티커 불러오기 실패');
      }
    } catch (err) {
      console.error('스티커 API 오류:', err);
    }
  };

  useEffect(() => {
    if (openPanel === 'emoji') {
      fetchStickers();
    }

    if (openPanel) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [openPanel]);

  const handleLongPressStart = (id: string) => {
    const timer = setTimeout(() => {
      setSelectedEmojiId(id);
      setIsModalOpen(true);
    }, 600);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleCreateEmoji = () => {
    router.push('/chat/emoji/create');
  };

  const handleDeleteClick = async () => {
    if (!selectedEmojiId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${backendUrl}/emoticon/${selectedEmojiId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setEmojis((prev) => prev.filter((emoji) => emoji._id !== selectedEmojiId));
        alert('이모티콘이 삭제되었습니다.');
      } else {
        alert('삭제 실패: ' + data.message);
      }
    } catch (err) {
      console.error('삭제 오류:', err);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsModalOpen(false);
      setSelectedEmojiId(null);
    }
  };

  const handleModalClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsModalOpen(false);
    setSelectedEmojiId(null);
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
              onFocus={(e) => {
                setOpenPanel(null);
                setTimeout(() => {
                  e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
              }}
            />
            <EmojiIcon className={'cursor-pointer'} onClick={() => togglePanel('emoji')} />
          </div>
          <div className='flex mr-1 my-1'>
            <SendIcon className={inputText.trim() ? 'text-[#FF9BB3] cursor-pointer' : 'text-[#d9d9d9]'} onClick={() => {}} />
          </div>
        </div>

        {isVisible && (
          <div
            className={`w-full border-t border-[#d9d9d9] bg-white overflow-hidden transition-all duration-300 ease-in-out ${
              isAnimating ? 'max-h-[252px]' : 'max-h-0'
            }`}
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

            {openPanel === 'emoji' && (
              <div className='h-[252px] flex flex-col gap-2 bg-white px-4 py-4 overflow-y-auto scrollbar-hide'>
                <div className='flex flex-row flex-wrap justify-start gap-2 px-1'>
                  {emojis.map((emoji) => (
                    <img
                      key={emoji._id}
                      src={emoji.imageUrl.startsWith('http') ? emoji.imageUrl : `${backendUrl}${emoji.imageUrl}`}
                      alt='emoji'
                      className='w-[74px] md:w-[68px] h-[74px] md:h-[68px] bg-[#eeeeee] rounded-lg'
                      onMouseDown={() => handleLongPressStart(emoji._id)}
                      onMouseUp={handleLongPressEnd}
                      onMouseLeave={handleLongPressEnd}
                      onTouchStart={() => handleLongPressStart(emoji._id)}
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
