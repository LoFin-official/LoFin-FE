import React, { ReactNode, useState } from 'react';
import EmojiCropper from '@/components/shared/EmojiCropper';
import Header from '@/components/shared/Header';
import Button from '@/components/shared/Button';
import { useRouter } from 'next/router';

export default function CreateEmojiPage() {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);

  const handleCreateEmoji = () => {
    if (!isComplete) return;

    router.replace('/chat');
  };

  return (
    <>
      <div className='flex flex-col min-h-[calc(100vh-122px)] pt-16 pb-4 justify-between'>
        <div className='flex flex-1 justify-center'>
          <div className='flex flex-col gap-8 items-center'>
            <div className='flex flex-col gap-0.5 w-[380px] text-center'>
              <span className='h-6 text-[#333333] text-xl font-bold'>둘만의 이모티콘을 만들어볼까요?</span>
              <span className='h-5 text-[#767676]'>우리 사진으로 감정을 담은 이모티콘을 직접 만들 수 있어요!</span>
            </div>
            <EmojiCropper onComplete={() => setIsComplete(true)} />
          </div>
        </div>
      </div>
      <Button isComplete={isComplete} onClick={handleCreateEmoji}>
        생성하기
      </Button>
    </>
  );
}

CreateEmojiPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>이모티콘 생성</Header>
      {page}
    </>
  );
};
