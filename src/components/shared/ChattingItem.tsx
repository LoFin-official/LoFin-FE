import React from 'react';

// 메시지 타입 정의
export enum MessageType {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
}

interface MessageGroupProps {
  messages: { text: React.ReactNode; isRead: boolean }[]; // ReactNode로 변경
  type: MessageType;
  time: string;
}

// 메시지 그룹 컴포넌트 - 프로필 이미지 위로 띄우기 적용
export const MessageGroup: React.FC<MessageGroupProps> = ({ messages, type, time }) => {
  const isSent = type === MessageType.SENT;

  return (
    <div className='mb-4'>
      {messages.map((message, index) => {
        const isFirstMessage = index === 0;
        const isLastMessage = index === messages.length - 1;
        const isSecondMessage = index === 1; // 두 번째 메시지 확인

        return (
          <div key={index} className={`flex items-end ${isSent ? 'justify-end' : 'justify-start'} mt-1`}>
            {/* 읽지 않은 메시지 표시 및 시간 */}
            {isSent && (
              <div className='flex flex-col items-center mr-2'>
                {!message.isRead && <div className='text-[8px] text-[#FF7A99] ml-6'>1</div>}
                {isLastMessage && time && <div className='text-[8px] text-[#999999]'>{time}</div>}
              </div>
            )}

            {/* 프로필 이미지 (첫 메시지의 RECEIVED만) */}
            {isFirstMessage && !isSent && (
              <div className='relative mr-2'>
                <div
                  className='w-10 h-10 rounded-full bg-[#999999] flex items-center justify-center'
                  style={{ transform: 'translateY(-12px)' }}
                ></div>
              </div>
            )}

            {/* 프로필 공간 (첫 메시지가 아닌 RECEIVED만) */}
            {!isFirstMessage && !isSent && <div className='w-10 mr-2'></div>}

            {/* 메시지 내용 */}
            <div
              className={`h-8 px-2 py-1 text-[#ffffff] font-bold flex items-center justify-center ${
                isSent
                  ? 'bg-[#FF9BB3] rounded-tl-[15px] rounded-tr-[15px] rounded-bl-[15px]'
                  : isSecondMessage
                    ? 'bg-[#D1A6F5] rounded-full'
                    : 'bg-[#D1A6F5] rounded-tr-[18px] rounded-bl-[18px] rounded-br-[18px]'
              }`}
            >
              {message.text}
            </div>

            {/* 시간 표시 (RECEIVED 메시지는 오른쪽에) */}
            {!isSent && isLastMessage && time && <div className='text-[8px] text-[#999999] ml-2'>{time}</div>}
          </div>
        );
      })}
    </div>
  );
};
