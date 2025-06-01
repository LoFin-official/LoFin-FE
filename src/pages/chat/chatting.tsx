import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageGroup, MessageType } from '@/components/shared/ChattingItem';
import { getChatMessages } from '@/utils/api';
import { backendUrl } from '@/config/config'; // backendUrl을 별도 config에서 관리한다고 가정

interface ChatMessage {
  type: MessageType;
  messages: { text: string; isRead: boolean }[];
  time: string; // ISO 문자열
}

interface Partner {
  _id: string;
  nickname: string;
}

interface ChatPageProps {
  partner: Partner | null;
}

function getUserId() {
  const userId = localStorage.getItem('userId');
  return userId ? userId : null;
}

function formatKoreanDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Seoul',
  });
}

function groupByDate(messages: ChatMessage[]) {
  const grouped: Record<string, ChatMessage[]> = {};

  for (const msg of messages) {
    const dateKey = formatKoreanDate(msg.time);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(msg);
  }

  return Object.entries(grouped).map(([date, chats]) => ({
    date,
    chats,
  }));
}

interface RawMessage {
  sender: string;
  receiver: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  isRead: boolean;
}

function convertMessagesToChatMessages(rawMessages: RawMessage[]): ChatMessage[] {
  const userId = getUserId();
  if (!userId) return [];

  return rawMessages.map((msg) => ({
    type: msg.sender === userId ? MessageType.SENT : MessageType.RECEIVED,
    messages: [{ text: msg.content, isRead: msg.isRead }],
    time: msg.createdAt,
  }));
}

export default function Chatting({ partner }: ChatPageProps): React.ReactElement {
  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    async function fetchChats() {
      if (!partner || !partner._id) {
        setError('대화 상대 정보가 없습니다.');
        return;
      }

      const senderId = getUserId();
      if (!senderId) {
        setError('사용자 정보가 없습니다. 다시 로그인해주세요.');
        return;
      }

      const receiverId = partner._id;

      try {
        setError(null);
        const raw = await getChatMessages(senderId, receiverId);
        if (!raw || !Array.isArray(raw)) {
          throw new Error('서버에서 잘못된 형식의 응답을 받았습니다.');
        }
        const formattedData = convertMessagesToChatMessages(raw);
        setChatData(formattedData);
      } catch (error) {
        setError('메시지 불러오기 실패');
      }
    }

    fetchChats();

    // WebSocket 연결
    const senderId = getUserId();
    if (!senderId || !partner?._id) return;

    socketRef.current = io(backendUrl, {
      query: { userId: senderId },
    });

    // 서버에서 새 메시지 이벤트 받으면 상태 업데이트
    socketRef.current.on('newMessage', (newMsg: RawMessage) => {
      setChatData((prev) => [...prev, ...convertMessagesToChatMessages([newMsg])]);
    });

    return () => {
      // 컴포넌트 언마운트 시 소켓 연결 해제
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [partner]);

  const groupedChats = groupByDate(chatData);

  return (
    <div className='flex flex-col h-screen bg-[#FFD9E1] bg-opacity-35'>
      <div className='flex-1 p-4 overflow-y-auto'>
        <div className='max-w-md mx-auto'>
          {error && <div className='text-center text-red-600 font-bold my-4'>{error}</div>}
          {!error && groupedChats.length === 0 && <div className='text-center text-gray-500 my-4'>메시지가 없습니다.</div>}
          {groupedChats.map((group, idx) => (
            <div key={idx}>
              {/* 날짜 헤더 */}
              <div className='px-2 py-[2px] w-40 h-6 relative bg-[#D9D9D9] rounded-[20px] overflow-hidden mx-auto mt-4'>
                <div className='w-36 h-5 left-[8px] top-[2px] absolute flex items-center justify-center text-[#ffffff] text-sm font-bold leading-normal'>
                  {group.date}
                </div>
              </div>

              {/* 해당 날짜의 메시지 렌더링 */}
              {group.chats.map((chat, index) => (
                <MessageGroup key={index} messages={chat.messages} type={chat.type} time={chat.time} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
