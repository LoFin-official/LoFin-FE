import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import NotificationItem from '@/components/shared/NotificationItem';
import React, { ReactNode, useState } from 'react';

export default function AlertPage() {
  const [memoryAlert, setMemoryAlert] = useState(true);
  const [questionAlert, setQuestionAlert] = useState(true);
  const [anniversaryAlert, setAnniversaryAlert] = useState(true);
  const [giftAlert, setGiftAlert] = useState(false);
  return (
    <div className='flex items-center justify-center px-4'>
      <div className='w-full max-w-[380px] flex flex-col items-start'>
        <NotificationItem
          title='추억 등록 알림'
          description='추억이 등록되면 알려드릴게요!'
          isOn={memoryAlert}
          onToggle={() => setMemoryAlert((prev) => !prev)}
        />
        <NotificationItem
          title='질문 알림'
          description='질문을 등록하거나 답변이 등록되면\n알려드릴게요!'
          isOn={questionAlert}
          onToggle={() => setQuestionAlert((prev) => !prev)}
        />
        <NotificationItem
          title='기념일 알림'
          description='특별한 날, 놓치지 않도록 알려드릴게요!'
          isOn={anniversaryAlert}
          onToggle={() => setAnniversaryAlert((prev) => !prev)}
        />
        <NotificationItem
          title='선물 추천 알림'
          description='다가올 기념일엔 어떤 선물이 좋을까요?\n직접 추천해드릴게요!'
          isOn={giftAlert}
          onToggle={() => setGiftAlert((prev) => !prev)}
        />
      </div>
    </div>
  );
}

AlertPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>알림 설정</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
