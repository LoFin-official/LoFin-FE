import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MessageGroup, MessageType } from '@/components/shared/ChattingItem';
import { getChatMessages } from '@/utils/api';
import { getSocket } from '@/socket';
import { backendUrl } from '@/config/config';

interface ChatMessage {
  type: MessageType;
  messages: { text: React.ReactNode; isRead: boolean }[];
  time: string;
}

interface Partner {
  _id: string;
  nickname: string;
  profilePicture?: string | null; // 프로필 이미지 URL - null도 허용
}

interface ChatPageProps {
  partner: Partner | null;
}

interface RawMessage {
  sender: string;
  receiver: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  isRead: boolean;
}

function getMemberId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('memberId') || null;
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

function groupRawMessagesByDate(rawMessages: RawMessage[], memberId: string): { date: string; chats: ChatMessage[] }[] {
  const groups: Record<string, ChatMessage[]> = {};

  for (const msg of rawMessages) {
    const dateKey = formatKoreanDate(msg.createdAt);
    if (!groups[dateKey]) groups[dateKey] = [];

    const type = msg.sender === memberId ? MessageType.SENT : MessageType.RECEIVED;

    const chatMessage: ChatMessage = {
      type,
      messages: [
        {
          text: msg.imageUrl ? (
            <img src={msg.imageUrl} alt='emoji' style={{ width: 100, height: 100, verticalAlign: 'middle', borderRadius: 6 }} />
          ) : (
            <span>{msg.content}</span>
          ),
          isRead: msg.isRead,
        },
      ],
      time: msg.createdAt,
    };

    groups[dateKey].push(chatMessage);
  }

  return Object.entries(groups).map(([date, chats]) => ({ date, chats }));
}

export default function Chatting({ partner }: ChatPageProps): React.ReactElement {
  const [groupedChats, setGroupedChats] = useState<{ date: string; chats: ChatMessage[] }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const memberId = getMemberId();
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  // 상대방 프로필 이미지 URL 생성
  const getPartnerProfileImageUrl = useCallback(() => {
    if (!partner?.profilePicture) return null;

    // 이미 완전한 URL인지 확인
    if (partner.profilePicture.startsWith('http')) {
      return partner.profilePicture;
    }

    // 백엔드 URL과 조합하여 완전한 URL 생성
    return `${backendUrl}/${partner.profilePicture.replace(/^\/?/, '')}`;
  }, [partner?.profilePicture]);

  const handleIncomingMessage = useCallback(
    (newMsg: RawMessage) => {
      if (!memberId) return;

      console.log('handleIncomingMessage 호출:', newMsg);

      setGroupedChats((prevGroups) => {
        const newDate = formatKoreanDate(newMsg.createdAt);
        const newType = newMsg.sender === memberId ? MessageType.SENT : MessageType.RECEIVED;

        const newChatMsg: ChatMessage = {
          type: newType,
          messages: [
            {
              text: newMsg.imageUrl ? (
                <img src={newMsg.imageUrl} alt='emoji' style={{ width: 100, height: 100, verticalAlign: 'middle', borderRadius: 6 }} />
              ) : (
                <span>{newMsg.content}</span>
              ),
              isRead: newMsg.isRead,
            },
          ],
          time: newMsg.createdAt,
        };

        const groupIndex = prevGroups.findIndex((g) => g.date === newDate);

        if (groupIndex === -1) {
          return [...prevGroups, { date: newDate, chats: [newChatMsg] }];
        } else {
          const group = prevGroups[groupIndex];

          // 중복 체크: 시간, 타입, 텍스트 혹은 이미지 URL 모두 동일하면 추가 안 함
          const duplicate = group.chats.some(
            (chat) =>
              chat.time === newMsg.createdAt &&
              chat.type === newType &&
              (chat.messages[0].text === newChatMsg.messages[0].text ||
                (typeof chat.messages[0].text === 'object' && typeof newChatMsg.messages[0].text === 'object'))
          );
          if (duplicate) return prevGroups;

          const updatedGroup = {
            ...group,
            chats: [...group.chats, newChatMsg],
          };

          return [...prevGroups.slice(0, groupIndex), updatedGroup, ...prevGroups.slice(groupIndex + 1)];
        }
      });
    },
    [memberId]
  );

  const handleSendMessage = useCallback(
    (content: string, imageUrl?: string) => {
      if (!socketRef.current || !memberId || !partner?._id) return;

      const now = new Date().toISOString();

      const newMessage: RawMessage = {
        sender: memberId,
        receiver: partner._id,
        content,
        imageUrl,
        createdAt: now,
        isRead: false,
      };

      console.log('내가 보낸 메시지:', newMessage);

      socketRef.current.emit('privateMessage', newMessage);
      handleIncomingMessage(newMessage);
    },
    [memberId, partner, handleIncomingMessage]
  );

  useEffect(() => {
    setError(null);

    async function fetchChats() {
      if (!memberId || !partner?._id) {
        setError('사용자 또는 상대방 정보가 없습니다.');
        setGroupedChats([]);
        return;
      }
      try {
        const rawMessages = await getChatMessages(memberId, partner._id);
        if (!Array.isArray(rawMessages)) throw new Error('서버 응답 오류');

        const grouped = groupRawMessagesByDate(rawMessages, memberId);
        setGroupedChats(grouped);
      } catch {
        setError('메시지 불러오기 실패');
        setGroupedChats([]);
      }
    }

    fetchChats();

    const socket = getSocket();
    if (!socket) return;

    socketRef.current = socket;

    socket.on('privateMessage', handleIncomingMessage);

    return () => {
      socket.off('privateMessage', handleIncomingMessage);
    };
  }, [partner, memberId, handleIncomingMessage]);

  return (
    <div className='flex flex-col h-screen bg-[#FFD9E1] bg-opacity-35'>
      <div className='flex-1 p-4 overflow-y-auto'>
        <div className='max-w-md mx-auto'>
          {error && <div className='text-center text-red-600 font-bold my-4'>{error}</div>}
          {!error && groupedChats.length === 0 && <div className='text-center text-gray-500 my-4'>메시지가 없습니다.</div>}
          {groupedChats.map((group, idx) => (
            <div key={idx}>
              <div className='px-2 py-[2px] w-40 h-6 relative bg-[#D9D9D9] rounded-[20px] overflow-hidden mx-auto mt-4'>
                <div className='w-36 h-5 left-[8px] top-[2px] absolute flex items-center justify-center text-[#ffffff] text-sm font-bold leading-normal'>
                  {group.date}
                </div>
              </div>
              {group.chats.map((chat, index) => (
                <MessageGroup
                  key={`${chat.time}-${index}`}
                  messages={chat.messages}
                  type={chat.type}
                  time={chat.time}
                  partnerProfileImage={chat.type === MessageType.RECEIVED ? getPartnerProfileImageUrl() : null}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
