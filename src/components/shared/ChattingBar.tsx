import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { backendUrl } from '@/config/config';
import { onSocket, offSocket, emitSocket } from '@/socket';
import { EmojiEditIcon, EmojiIcon, ImageIcon, PlusIcon, SendIcon } from '@/assets/icons/SvgIcon';

interface Emoji {
  _id: string;
  imageUrl: string;
}

interface ChattingBarProps {
  receiverId: string;
  onNewMessage?: (message: any) => void;
}

export default function ChattingBar({ receiverId, onNewMessage }: ChattingBarProps) {
  const [openPanel, setOpenPanel] = useState<'plus' | 'emoji' | null>(null);
  const [inputText, setInputText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [emojis, setEmojis] = useState<Emoji[]>([]);
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
        headers: { Authorization: `Bearer ${token}` },
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
    if (openPanel === 'emoji') fetchStickers();

    if (openPanel) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [openPanel]);

  useEffect(() => {
    function handlePrivateMessage(message: any) {
      console.log('실시간 메시지 수신:', message);
      onNewMessage?.(message);
    }

    onSocket('privateMessage', handlePrivateMessage);

    return () => {
      offSocket('privateMessage', handlePrivateMessage);
    };
  }, [onNewMessage]);

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

  // 함수 추가
  const sendEmojiMessage = async (emoji: Emoji) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('로그인이 필요합니다.');

      const res = await fetch(`${backendUrl}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver: receiverId,
          content: `[${emoji._id}]`, // 필요 없으면 빈 문자열도 가능
          imageUrl: `${backendUrl}${emoji.imageUrl}`, // 절대경로로 보냄
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInputText('');
        setOpenPanel(null);
        onNewMessage?.(data.message);

        emitSocket('privateMessage', {
          receiver: receiverId,
          content: `[${emoji._id}]`,
          imageUrl: `${backendUrl}${emoji.imageUrl}`,
        });
      } else {
        alert('이모티콘 전송 실패: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('이모티콘 전송 중 오류가 발생했습니다.');
    }
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
        setEmojis((prev) => prev.filter((e) => e._id !== selectedEmojiId));
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

  const handleSendMessage = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${backendUrl}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver: receiverId,
          content: trimmed,
          imageUrl: '',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInputText('');
        setOpenPanel(null);
        onNewMessage?.(data.message);

        emitSocket('privateMessage', {
          receiver: receiverId,
          content: trimmed,
          imageUrl: '',
        });
      } else {
        alert('메시지 전송 실패: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('메시지 전송 중 오류가 발생했습니다.');
    }
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <EmojiIcon className='cursor-pointer' onClick={() => togglePanel('emoji')} />
          </div>
          <div className='flex mr-1 my-1'>
            <SendIcon className={inputText.trim() ? 'text-[#FF9BB3] cursor-pointer' : 'text-[#d9d9d9]'} onClick={handleSendMessage} />
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
              <div className='flex flex-row gap-4 px-6 py-4 overflow-x-auto'>
                {emojis.length > 0 ? (
                  emojis.map((emoji) => (
                    <img
                      key={emoji._id}
                      className='w-12 h-12 cursor-pointer rounded-[8px]'
                      src={`${backendUrl}${emoji.imageUrl}`}
                      alt='emoji'
                      onClick={() => {
                        sendEmojiMessage(emoji);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setSelectedEmojiId(emoji._id);
                        setIsModalOpen(true);
                      }}
                      onMouseDown={() => handleLongPressStart(emoji._id)}
                      onMouseUp={handleLongPressEnd}
                      onMouseLeave={handleLongPressEnd}
                      onTouchStart={() => handleLongPressStart(emoji._id)}
                      onTouchEnd={handleLongPressEnd}
                    />
                  ))
                ) : (
                  <div className='text-sm font-bold text-gray-400'>이모티콘이 없습니다.</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={handleModalClose}>
          <div className='bg-white p-4 rounded shadow-lg' onClick={(e) => e.stopPropagation()}>
            <button className='px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600' onClick={handleDeleteClick}>
              삭제
            </button>
            <button className='ml-2 px-4 py-2 text-gray-700 border rounded hover:bg-gray-100' onClick={handleModalClose}>
              취소
            </button>
          </div>
        </div>
      )}
    </>
  );
}
