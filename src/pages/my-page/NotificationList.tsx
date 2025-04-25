import React, { useState } from 'react';
import NotificationItem from '@/components/shared/NotificationItem';

export default function NotificationList() {
  const [memoryAlert, setMemoryAlert] = useState(true);
  const [questionAlert, setQuestionAlert] = useState(true);
  const [anniversaryAlert, setAnniversaryAlert] = useState(true);
  const [giftAlert, setGiftAlert] = useState(false);

  return (
    <div className='w-96 flex flex-col items-start space-y-2'>
      <NotificationItem
        title='추억 등록 알림'
        description='추억이 등록되면 알려드릴게요!' // 줄바꿈 없음
        isOn={memoryAlert}
        onToggle={() => setMemoryAlert((prev) => !prev)}
      />
      <NotificationItem
        title='질문 알림'
        description='질문을 등록하거나 답변이 등록되면\n알려드릴게요!' // 줄바꿈 포함
        isOn={questionAlert}
        onToggle={() => setQuestionAlert((prev) => !prev)}
      />
      <NotificationItem
        title='기념일 알림'
        description='특별한 날, 놓치지 않도록 알려드릴게요!' // 줄바꿈 없음
        isOn={anniversaryAlert}
        onToggle={() => setAnniversaryAlert((prev) => !prev)}
      />
      <NotificationItem
        title='선물 추천 알림'
        description='다가오는 기념일엔 어떤 선물이 어울릴까요?\n직접 추천해드릴게요!' // 줄바꿈 포함
        isOn={giftAlert}
        onToggle={() => setGiftAlert((prev) => !prev)}
      />
    </div>
  );
}
