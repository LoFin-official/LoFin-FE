import ChattingBar from '@/components/shared/ChattingBar';
import Header from '@/components/shared/Header';
import React, { useEffect, useState } from 'react';
import Chatting from '@/pages/chat/chatting';
import { backendUrl } from "@/config/config";

interface User {
  _id: string;
  nickname: string;
}

export default function ChatPage() {
  const [partner, setPartner] = useState<User | null>(null);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const token = localStorage.getItem('token'); // 토큰명 확인 필요

        if (!token) return;

        const res = await fetch(`${backendUrl}/coupleprofile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error('커플 프로필 불러오기 실패', res.status);
          return;
        }

        const data = await res.json();

        // partnerProfile이 있으면 상태 업데이트
        if (data.partnerProfile) {
          setPartner(data.partnerProfile);
        }
      } catch (err) {
        console.error('상대방 불러오기 실패:', err);
      }
    };

    fetchPartner();
  }, []);

  return (
    <>
      <Header>{partner?.nickname || '상대방'}</Header>
      <div className="h-screen overflow-y-auto bg-[#FFD9E1] bg-opacity-35">
        <Chatting partner={partner} />
      </div>
      <ChattingBar receiverId={partner?._id || ''} />
    </>
  );
}
