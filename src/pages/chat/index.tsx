import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import React, { ReactNode } from 'react';

export default function ChatPage() {
  return <div>채팅페이지입니당.</div>;
}

ChatPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>톰</Header>
      {page}
    </>
  );
};
