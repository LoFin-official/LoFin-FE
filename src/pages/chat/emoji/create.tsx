import React, { useState, ReactNode } from 'react';
import EmojiCropper from '@/components/shared/EmojiCropper';
import Header from '@/components/shared/Header';
import Button from '@/components/shared/Button';
import { useRouter } from 'next/router';
import { backendUrl } from '@/config/config';

export default function CreateEmojiPage() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // 컴포넌트 내에 API 함수 직접 작성
  async function uploadEmoji(file: File, token: string) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${backendUrl}/emoticon/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type' 헤더는 FormData 전송 시 지정하지 않음
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('서버 에러');
    }

    return response.json();
  }

  // EmojiCropper 컴포넌트에서 자른 이미지 파일 받기
  const handleCropComplete = (file: File) => {
    setImageFile(file);
    setIsComplete(true);
  };

  // 버튼 클릭 시 이미지 업로드 처리
  const handleCreateEmoji = async () => {
    if (!isComplete || !imageFile) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('로그인이 필요합니다.');

      const result = await uploadEmoji(imageFile, token);
      if (result.success) {
        router.replace('/chat');
      } else {
        alert('이모티콘 저장에 실패했습니다.');
      }
    } catch (err) {
      console.error('이모티콘 업로드 실패:', err);
    }
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
            <EmojiCropper onComplete={handleCropComplete} />
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
