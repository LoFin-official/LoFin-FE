import React, { useState } from 'react';
import { MessageGroup, MessageType } from '@/components/shared/ChattingItem';

// 채팅 데이터 인터페이스 정의
interface ChatMessage {
  type: MessageType;
  messages: { text: string; isRead: boolean }[]; // 메시지 단위로 isRead 추가
  time: string;
}

export default function ChatPage(): React.ReactElement {
  const [chatData] = useState<ChatMessage[]>([
    {
      type: MessageType.RECEIVED,
      messages: [
        { text: '오늘 뭐 먹을까?', isRead: true },
        { text: '점심시간이 다 돼어가는데', isRead: true },
      ],
      time: '오후 2:11',
    },
    {
      type: MessageType.SENT,
      messages: [
        { text: '음...', isRead: true },
        { text: '너 먹고 싶은 거 있어?', isRead: true },
        { text: '나는 특별히 생각나는 건 없는데!', isRead: true },
      ],
      time: '오후 2:11',
    },
    {
      type: MessageType.RECEIVED,
      messages: [{ text: '어제도 한식 먹었으니까', isRead: true }],
      time: '오후 2:12',
    },
    {
      type: MessageType.RECEIVED,
      messages: [
        { text: '오늘은 다른 거 어때?', isRead: true },
        { text: '파스타나 샐러드 같은 거?', isRead: true },
      ],
      time: '오후 2:13',
    },
    {
      type: MessageType.SENT,
      messages: [
        { text: '오! 파스타 좋다!', isRead: true },
        { text: '그런데 가벼운 거 먹고 싶긴 한데...', isRead: true },
      ],
      time: '오후 2:13',
    },
    {
      type: MessageType.RECEIVED,
      messages: [
        { text: '그럼 토마토 파스타 어때?', isRead: true },
        { text: '너무 크림이나 치즈 많은 거 말고 가벼운 거!', isRead: true },
      ],
      time: '오후 2:14',
    },
    {
      type: MessageType.SENT,
      messages: [
        { text: '좋아!', isRead: false }, // 읽지 않은 메시지
        { text: '그럼 근처에 맛집 찾아볼까?', isRead: false }, // 읽지 않은 메시지
      ],
      time: '오후 2:14',
    },
  ]);

  return (
    <div className='flex flex-col h-screen bg-[#FFD9E1] bg-opacity-35'>
      {/* 날짜 표시 */}
      <div className='px-2 py-[2px] w-40 h-6 relative bg-[#D9D9D9] rounded-[20px] overflow-hidden mx-auto mt-4'>
        <div className='w-36 h-5 left-[8px] top-[2px] absolute flex items-center justify-center text-[#ffffff] text-sm font-bold leading-normal'>
          2025년 3월 27일 목요일
        </div>
      </div>

      {/* 채팅 메시지 영역 */}
      <div className='flex-1 p-4 overflow-y-auto'>
        <div className='max-w-md mx-auto'>
          {chatData.map((chat, index) => (
            <MessageGroup key={index} messages={chat.messages} type={chat.type} time={chat.time} />
          ))}
        </div>
      </div>
    </div>
  );
}
