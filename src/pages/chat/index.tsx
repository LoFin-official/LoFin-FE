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
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

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

  const handleKeyboardToggle = (isOpen: boolean) => {
    setIsKeyboardOpen(isOpen);
  };

  // partner가 준비되면 ChattingBar에게 receiverId 전달
  return (
    <div className='flex flex-col h-screen'>
      {/* Header - 고정 높이 */}
      <div className='flex-shrink-0'>
        <Header>{partner?.nickname || '상대방'}</Header>
      </div>

      {/* Chat Content - 남은 공간을 모두 차지 */}
      <div className='flex-1 flex flex-col min-h-0'>
        <Chatting partner={partner} />
      </div>

      {/* ChattingBar - 고정 높이 */}
      <div className='flex-shrink-0'>
        <ChattingBar receiverId={partner?._id || ''} onKeyboardToggle={handleKeyboardToggle} />
      </div>
    </div>
  );
}
