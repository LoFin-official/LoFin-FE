import ChattingBar from '@/components/shared/ChattingBar';
import Header from '@/components/shared/Header';
import React, { ReactNode } from 'react';
import Chatting from '@/pages/chat/chatting';

export default function ChatPage() {
  return (
    <div className='h-screen overflow-y-auto bg-[#FFD9E1] bg-opacity-35'>
      <Chatting />
    </div>
  );
}

ChatPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>톰</Header> {/* 연결 시 상대방 닉네임 적용 */}
      {page}
      <ChattingBar></ChattingBar>
    </>
  );
};
