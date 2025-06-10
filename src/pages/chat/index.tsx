import ChattingBar from '@/components/shared/ChattingBar';
import Header from '@/components/shared/Header';
import React, { useEffect, useState } from 'react';
import Chatting from '@/pages/chat/chatting';
import { backendUrl } from '@/config/config';

interface User {
  _id: string;
  nickname: string;
}

export default function ChatPage() {
  const [partner, setPartner] = useState<User | null>(null);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${backendUrl}/coupleprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error('커플 프로필 불러오기 실패', res.status);
          return;
        }
        const data = await res.json();
        if (data.partnerProfile) {
          setPartner(data.partnerProfile);
        }
      } catch (err) {
        console.error('상대방 불러오기 실패:', err);
      }
    };
    fetchPartner();
  }, []);

  // partner가 준비되면 ChattingBar에게 receiverId 전달
  return (
    <>
      <Header>{partner?.nickname || '상대방'}</Header>
      <div className='h-[calc(100vh-104px)] overflow-y-auto bg-[#FFD9E1] bg-opacity-35'>
        <Chatting partner={partner} />
      </div>
      <ChattingBar receiverId={partner?._id || ''} />
    </>
  );
}
