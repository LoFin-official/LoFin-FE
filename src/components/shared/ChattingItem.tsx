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
  partnerProfileImage?: string | null;
}

// 시간 문자열을 "HH:mm" 형식으로 변환하는 함수
function formatTime(timeString: string) {
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 메시지 그룹 컴포넌트
export const MessageGroup: React.FC<MessageGroupProps> = ({ messages, type, time, partnerProfileImage }) => {
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
            <div key={index} className={`flex items-end ${isSent ? 'justify-end' : 'justify-start'} mt-1`}>
              {/* 보낸 메시지의 시간 표시 (왼쪽) */}
              {isSent && isLastMessage && time && <div className='text-[8px] text-[#999999] mr-2'>{formatTime(time)}</div>}

              {/* 받은 메시지의 프로필 영역 */}
              {isFirstMessage && !isSent && (
                <div className='mr-2 self-start'>
                  <div className='w-10 h-10 rounded-full overflow-hidden bg-[#eeeeee] flex items-center justify-center'>
                    {partnerProfileImage ? (
                      <img src={partnerProfileImage} alt='상대방 프로필' className='w-full h-full object-cover' />
                    ) : (
                      <div className='w-full h-full bg-[#cccccc]'></div>
                    )}
                  </div>
                </div>
              )}
              {!isFirstMessage && !isSent && <div className='w-10 mr-2'></div>}

              {/* 이미지 */}
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

              {/* 받은 메시지의 시간 표시 (오른쪽) */}
              {!isSent && isLastMessage && time && <div className='text-[8px] text-[#999999] ml-2'>{formatTime(time)}</div>}
            </div>
          );
        }

        // 이미지가 아닌 텍스트 메시지 - 시간과 프로필 독립적으로 조정 가능
        return (
          <div key={index} className={`flex items-start ${isSent ? 'justify-end' : 'justify-start'} mt-1`}>
            {/* 보낸 메시지 시간 (독립적 위치 조정 가능) */}
            {isSent && isLastMessage && time && (
              <div className='mr-2 self-end'>
                <div className='text-[8px] text-[#999999]'>{formatTime(time)}</div>
              </div>
            )}

            {/* 받은 메시지 프로필 (독립적 위치 조정 가능) */}
            {isFirstMessage && !isSent && (
              <div className='mr-2 self-start'>
                <div className='w-10 h-10 rounded-full overflow-hidden bg-[#eeeeee] flex items-center justify-center'>
                  {partnerProfileImage ? (
                    <img src={partnerProfileImage} alt='상대방 프로필' className='w-full h-full object-cover' />
                  ) : (
                    <div className='w-full h-full bg-[#cccccc]'></div>
                  )}
                </div>
              </div>
            )}

            {!isFirstMessage && !isSent && <div className='w-10 mr-2'></div>}

            <div
              className={`px-2 py-1 text-[#ffffff] font-bold 
                ${
                  isSent
                    ? 'bg-[#FF9BB3] rounded-tl-[15px] rounded-tr-[15px] rounded-bl-[15px]'
                    : isSecondMessage
                      ? 'bg-[#D1A6F5] rounded-full'
                      : 'bg-[#D1A6F5] rounded-tr-[18px] rounded-bl-[18px] rounded-br-[18px]'
                }
                ${!isSent ? 'self-end' : ''}
              `}
              style={{
                whiteSpace: 'pre-wrap', // 줄바꿈 허용
                wordBreak: 'break-word', // 단어도 잘라서 줄바꿈
                maxWidth: '50%', // 부모 기준 너비 75% 제한
              }}
            >
              {message.text}
            </div>

            {/* 받은 메시지 시간 (독립적 위치 조정 가능) */}
            {!isSent && isLastMessage && time && (
              <div className='ml-2 self-end'>
                <div className='text-[8px] text-[#999999]'>{formatTime(time)}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
