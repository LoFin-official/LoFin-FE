// /chat/chatting.tsx
import React, { useEffect, useState } from 'react';
import { MessageGroup, MessageType } from '@/components/shared/ChattingItem';
import { getChatMessages } from '@/utils/api';

interface ChatMessage {
  type: MessageType;
  messages: { text: string; isRead: boolean }[];
  time: string; // ISO 문자열
}

// 날짜를 한국어로 포맷 (예: 2025년 3월 27일 목요일)
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

// 날짜별로 메시지를 그룹화
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

export default function ChatPage(): React.ReactElement {
  const [chatData, setChatData] = useState<ChatMessage[]>([]);

  useEffect(() => {
    async function fetchChats() {
      const data = await getChatMessages();
      setChatData(data);
    }
    fetchChats();
  }, []);

  const groupedChats = groupByDate(chatData);

  return (
    <div className='flex flex-col h-screen bg-[#FFD9E1] bg-opacity-35'>
      <div className='flex-1 p-4 overflow-y-auto'>
        <div className='max-w-md mx-auto'>
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
