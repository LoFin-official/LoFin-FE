import ChattingBar from '@/components/shared/ChattingBar';
import Header from '@/components/shared/Header';
import React, { ReactNode } from 'react';

export default function ChatPage() {
  return <div>채팅페이지입니당.</div>;
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
