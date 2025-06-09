import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { Slider } from '@mui/material';
import getCroppedImg from '@/utils/cropImage';

interface EmojiCropperProps {
  onComplete?: (file: File) => void;
}

const EmojiCropper = ({ onComplete }: EmojiCropperProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, 300);
      // 여기에 서버 저장 로직 또는 채팅 전송 로직 추가

      if (onComplete) {
        const blob = await getCroppedImg(imageSrc, croppedAreaPixels, 300);
        const file = new File([blob], 'emoji.png', { type: 'image/png' });
        onComplete(file);
      }
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='flex flex-col items-center gap-2'>
      {!imageSrc && (
        <>
          <label htmlFor='fileInput'>
            <div className='w-[300px] h-[300px] rounded-lg bg-[#ffffff] border-[2px] border-[#ff9bb3] flex items-center justify-center text-[#ff9bb3] text-lg cursor-pointer hover:border-[#FF4C80] hover:text-[#FF4C80] font-bold transition'>
              이미지 선택
            </div>
          </label>
          <input id='fileInput' type='file' accept='image/*' onChange={onFileChange} className='hidden' />
        </>
      )}
      {imageSrc && (
        <div className='relative w-[300px] h-[300px] bg-black'>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropSize={{ width: 150, height: 150 }}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      {imageSrc && (
        <div className='flex flex-col gap-2 w-[300px] mx-auto'>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(_, value) => setZoom(value as number)}
            sx={{
              color: '#FF9BB3', // 슬라이더 색상 (트랙 + 썸)
              '& .MuiSlider-thumb': {
                borderRadius: '50%',
                backgroundColor: '#FF9BB3',
                border: '2px solid white',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(255, 155, 179, 0.16)',
                },
              },
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-rail': {
                opacity: 0.3,
                backgroundColor: '#FF9BB3',
              },
            }}
          />
          <button onClick={showCroppedImage} className='bg-[#FF9BB3] text-white px-4 py-2 rounded hover:bg-[#FF4C80] mx-auto'>
            저장하기
          </button>
        </div>
      )}
    </div>
  );
};

export default EmojiCropper;
