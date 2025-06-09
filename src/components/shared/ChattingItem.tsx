import React from 'react';

// 메시지 타입 정의
export enum MessageType {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
}

interface MessageGroupProps {
  messages: { text: React.ReactNode; isRead: boolean }[];
  type: MessageType;
  time: string;
}

// 시간 문자열을 "HH:mm" 형식으로 변환하는 함수
function formatTime(timeString: string) {
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 메시지 그룹 컴포넌트
export const MessageGroup: React.FC<MessageGroupProps> = ({ messages, type, time }) => {
  const isSent = type === MessageType.SENT;

  // 메시지가 이미지인지 체크하는 헬퍼
  function isImageMessage(text: React.ReactNode): boolean {
    // React element인지, 타입이 'img'인지 확인
    return React.isValidElement(text) && text.type === 'img';
  }

  return (
    <div className='mb-4'>
      {messages.map((message, index) => {
        const isFirstMessage = index === 0;
        const isLastMessage = index === messages.length - 1;
        const isSecondMessage = index === 1;

        const isImage = isImageMessage(message.text);

        if (isImage) {
          const imageElement = message.text as React.ReactElement<React.ImgHTMLAttributes<HTMLImageElement>>;

          const existingStyle = imageElement.props.style || {};
          // 이미지 메시지는 버블 없이 크게 보여주기
          return (
            <div key={index} className={`flex items-center ${isSent ? 'justify-end' : 'justify-start'} mt-1`}>
              {isFirstMessage && !isSent && (
                <div className='relative mr-2'>
                  <div
                    className='w-10 h-10 rounded-full bg-[#999999] flex items-center justify-center'
                    style={{ transform: 'translateY(-12px)' }}
                  ></div>
                </div>
              )}
              {!isFirstMessage && !isSent && <div className='w-10 mr-2'></div>}

              {React.cloneElement(imageElement, {
                style: {
                  verticalAlign: 'middle',
                  borderRadius: 8,
                  ...existingStyle,
                },
                width: 200,
                height: 200,
                alt: imageElement.props.alt || 'emoji',
              })}

              {!isSent && isLastMessage && time && <div className='text-[8px] text-[#999999] ml-2'>{formatTime(time)}</div>}
            </div>
          );
        }

        // 이미지가 아닌 텍스트 메시지 기존 스타일 유지
        return (
          <div key={index} className={`flex items-end ${isSent ? 'justify-end' : 'justify-start'} mt-1`}>
            {isSent && (
              <div className='flex flex-col items-center mr-2'>
                {isLastMessage && time && <div className='text-[8px] text-[#999999]'>{formatTime(time)}</div>}
              </div>
            )}

            {isFirstMessage && !isSent && (
              <div className='relative mr-2'>
                <div
                  className='w-10 h-10 rounded-full bg-[#999999] flex items-center justify-center'
                  style={{ transform: 'translateY(-12px)' }}
                ></div>
              </div>
            )}

            {!isFirstMessage && !isSent && <div className='w-10 mr-2'></div>}

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

            {!isSent && isLastMessage && time && <div className='text-[8px] text-[#999999] ml-2'>{formatTime(time)}</div>}
          </div>
        );
      })}
    </div>
  );
};
