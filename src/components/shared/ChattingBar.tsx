import { 
  DayDeleteIcon, DayEditIcon, EmojiEditIcon, EmojiIcon, 
  ImageIcon, PlusIcon, SendIcon 
} from '@/assets/icons/SvgIcon';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import { backendUrl } from '@/config/config';
import io, { Socket } from 'socket.io-client';

interface Emoji {
  _id: string;
  imageUrl: string;
}

interface ChattingBarProps {
  receiverId: string;  // 메시지 받는 사람 ID (필수)
  onNewMessage?: (message: any) => void;  // 실시간 새 메시지 도착 시 호출 (옵션)
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

  // 소켓 인스턴스 저장용 ref (컴포넌트 재렌더링시에도 유지)
  const socketRef = useRef<Socket | null>(null);

  // 패널 토글
  const togglePanel = (type: 'plus' | 'emoji') => {
    setOpenPanel((prev) => (prev === type ? null : type));
  };

  // 이모티콘 리스트 API 호출
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

  // openPanel 변화에 따른 애니메이션 관리
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

  // 소켓 연결 및 이벤트 등록 (컴포넌트 마운트 시 한 번만)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // 소켓 서버 주소는 backendUrl이거나 별도 환경 변수로 관리 가능
    const socket = io(backendUrl, {
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    // privateMessage 이벤트 리스너 등록
    socket.on('privateMessage', (message) => {
      console.log('실시간 메시지 수신:', message);
      // 새 메시지가 도착하면 부모나 상위 상태에 전달하는 콜백 호출
      if (onNewMessage) {
        onNewMessage(message);
      }
    });

    socket.on('connect_error', (err) => {
      console.error('소켓 연결 에러:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewMessage]);

  // 롱프레스 시작 - 600ms 후 삭제 모달 오픈
  const handleLongPressStart = (id: string) => {
    const timer = setTimeout(() => {
      setSelectedEmojiId(id);
      setIsModalOpen(true);
    }, 600);
    setLongPressTimer(timer);
  };

  // 롱프레스 종료 시 타이머 클리어
  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // 이모티콘 제작 페이지 이동
  const handleCreateEmoji = () => {
    router.push('/chat/emoji/create');
  };

  // 선택된 이모티콘 삭제 API 호출 및 상태 업데이트
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

  // 삭제 모달 닫기
  const handleModalClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsModalOpen(false);
    setSelectedEmojiId(null);
  };

  // 메시지 전송 처리 함수
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
          imageUrl: ""  // 이미지 없는 일반 메시지
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInputText('');
        setOpenPanel(null);

        // 메시지 전송 성공 시 onNewMessage 콜백 호출 가능
        if (onNewMessage) {
          onNewMessage(data.message);  // 서버가 반환하는 메시지 데이터가 있을 경우
        }
      } else {
        alert('메시지 전송 실패: ' + data.message);
      }
    } catch (err) {
      console.error('메시지 전송 오류:', err);
      alert('메시지 전송 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <div className='fixed bottom-0 w-full max-w-[412px]'>
        <div className='h-[48px] bg-white flex flex-row gap-1 px-1 py-1'>
          {/* + 버튼 */}
          <div className='flex ml-1 my-1 cursor-pointer'>
            <PlusIcon onClick={() => togglePanel('plus')} />
          </div>

          {/* 입력창 + 이모지 버튼 */}
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

          {/* 전송 버튼 */}
          <div className='flex mr-1 my-1'>
            <SendIcon
              className={inputText.trim() ? 'text-[#FF9BB3] cursor-pointer' : 'text-[#d9d9d9]'}
              onClick={handleSendMessage}
            />
          </div>
        </div>

        {/* 하단 패널 (이모지 / plus) */}
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

      {/* 삭제 확인 모달 */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-[#1B1B1B] bg-opacity-50 z-50'>
          <div className='w-52 h-24 relative'>
            <div className='w-52 h-24 left-0 top-0 absolute bg-[#ffffff] rounded-xl' />
            <div className='absolute top-[20px] text-base font-semibold text-[#333333] w-full text-center'>
              정말 삭제하시겠어요?
            </div>
            <button
              className='absolute w-[92px] h-[38px] bottom-[10px] left-[8px] rounded-lg bg-[#F68B87] font-bold text-[#ffffff] text-sm'
              onClick={handleDeleteClick}
            >
              삭제
            </button>
            <button
              className='absolute w-[92px] h-[38px] bottom-[10px] right-[8px] rounded-lg bg-[#333333] font-bold text-[#ffffff] text-sm'
              onClick={handleModalClose}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </>
  );
}
