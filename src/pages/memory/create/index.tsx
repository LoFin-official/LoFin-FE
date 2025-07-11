import React, { useState, ReactNode, useRef, useEffect } from 'react';
import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import { ImageCloseIcon, MemoryDateIcon, MemoryItemIcon } from '@/assets/icons/SvgIcon';
import BottomSheetMemoryItem from '@/components/shared/BottomSheetMemoryItem';
import BottomSheetDate from '@/components/shared/BottomSheetDate';
import Button from '@/components/shared/Button';
import { useRouter } from 'next/router';
import { backendUrl } from '@/config/config';

interface ImageData {
  id: number;
  file?: File;
  preview?: string;
}

export default function MemoryCreatePage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDateISO, setSelectedDateISO] = useState('');
  const [isItemSheetOpen, setIsItemSheetOpen] = useState(false);
  const [selectedComponentName, setSelectedComponentName] = useState<string | null>(null);
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [firstMeetingDate, setFirstMeetingDate] = useState<Date | null>(null);
  const today = new Date();
  const [formData, setFormData] = useState<{ coupleSince?: string }>({});
  const [initialDate, setInitialDate] = useState<string | null>(null);

  const resizeHeight = (textarea: React.RefObject<HTMLTextAreaElement | null>, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textarea.current) {
      textarea.current.style.height = 'auto';
      textarea.current.style.height = textarea.current.scrollHeight + 'px';
      setText(e.target.value);
    }
  };

  const handleDateSelect = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${y}. ${m}. ${d}`);
    setSelectedDateISO(date.toISOString());
    setIsDateSheetOpen(false);
  };

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const [images, setImages] = useState<ImageData[]>([]);

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      if (images.length + newFiles.length > 5) {
        alert('최대 5개의 이미지까지 업로드할 수 있습니다.');
        return;
      }

      const newImages = newFiles.map((file) => {
        const id = Date.now() + Math.random();
        return {
          id,
          file,
          preview: URL.createObjectURL(file),
        };
      });

      setImages([...images, ...newImages]);
    }
  };

  const handleRemove = (idToRemove: number) => {
    const imageToRemove = images.find((img) => img.id === idToRemove);
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setImages(images.filter((img) => img.id !== idToRemove));
  };

  const isComplete = title.trim() !== '' && text.trim() !== '' && selectedDate !== '' && !!selectedComponentName;

  const handleMemory = async () => {
    if (!isComplete) {
      setError('모든 필수 항목을 입력하고 추억 아이템을 선택해주세요.');
      return;
    }

    if (!selectedComponentName) {
      setError('기록할 추억 아이템을 선택해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', text);
      formData.append('memoryDate', selectedDateISO);

      images.forEach((img) => {
        if (img.file) {
          formData.append('images', img.file);
        }
      });

      const position = { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) };
      const rotation = Math.floor(Math.random() * 10) - 5;

      formData.append('position', JSON.stringify(position));
      formData.append('rotation', rotation.toString());
      formData.append('styleType', selectedComponentName);

      const response = await fetch(`${backendUrl}/memory`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('추억 저장에 실패했습니다.');
      router.replace('/memory');
    } catch (err) {
      console.error(err);
      setError('추억 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      try {
        const dateResponse = await fetch(`${backendUrl}/firstMet/firstmet`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const dateContentType = dateResponse.headers.get('content-type');
        let dateResult;

        if (dateContentType?.includes('application/json')) {
          dateResult = await dateResponse.json();
        } else {
          const text = await dateResponse.text();
          throw new Error(`잘못된 응답 형식입니다: ${text}`);
        }

        if (dateResponse.ok && dateResult.firstMetDate) {
          setFormData({ coupleSince: dateResult.firstMetDate });
          setInitialDate(dateResult.firstMetDate);
          setFirstMeetingDate(new Date(dateResult.firstMetDate));
        } else {
          console.error('날짜 불러오기 실패:', dateResult.message || '서버 응답 오류');
        }
      } catch (error) {
        console.error('첫 만남 날짜를 불러오는데 실패했습니다:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className='flex flex-col h-[calc(100vh-112px)] w-full max-w-[412px] mx-auto px-4 pt-8 pb-4'>
        <div className='w-full max-w-[380px] h-9 py-2 px-0.5 border-b border-[#cccccc] mb-4'>
          <input
            className='w-full h-5 text-xl text-[#333333] placeholder:text-[#cccccc] font-bold focus:outline-none'
            value={title}
            onChange={onChangeTitle}
            placeholder='제목을 입력해 주세요.'
          />
        </div>

        <div className='flex-grow w-full max-w-[380px]'>
          <div className='w-full max-w-[364px] h-auto mx-2'>
            <textarea
              rows={1}
              className='w-full max-h-[150px] text-base text-[#767676] resize-none overflow-y-auto leading-relaxed focus:outline-none'
              placeholder='추억 내용을 작성해 주세요.'
              ref={textarea}
              value={text}
              onChange={(e) => resizeHeight(textarea, e)}
            />
          </div>
        </div>

        <div className='flex-shrink-0'>
          <div className='w-full max-w-[380px] h-[216px] px-0.5 py-2 border-t border-b border-[#eeeeee] overflow-x-auto overflow-y-hidden scrollbar-hide'>
            <div className='flex flex-row gap-2 w-max'>
              {images.map((img) => (
                <div key={img.id} className='w-[150px] h-[200px] rounded-md bg-[#eeeeee] relative'>
                  {img.preview && <img src={img.preview} alt='Preview' className='w-full h-full object-cover rounded-md' />}
                  <div className='absolute top-2 right-2 cursor-pointer' onClick={() => handleRemove(img.id)}>
                    <ImageCloseIcon />
                  </div>
                </div>
              ))}
              {images.length < 5 && (
                <div className='w-[150px] h-[200px] rounded-md bg-[#f8f8f8] flex items-center justify-center cursor-pointer' onClick={handleAddImage}>
                  <div className='text-3xl text-[#cccccc]'>+</div>
                </div>
              )}
            </div>
          </div>

          <input type='file' accept='image/*' multiple className='hidden' ref={fileInputRef} onChange={handleFileChange} />

          <div className='w-full max-w-[380px] h-[52px] px-2 py-4'>
            <div
              className={`flex flex-row gap-1 text-base cursor-pointer ${selectedDate ? 'text-[#333333]' : 'text-[#999999]'}`}
              onClick={() => setIsDateSheetOpen(true)}
            >
              <MemoryDateIcon />
              <div className='h-6'>{selectedDate ? selectedDate : '기록할 날짜를 선택해 주세요.'}</div>
            </div>
          </div>

          <div className='w-full max-w-[380px] h-[52px] px-2 py-4'>
            <div
              className={`flex flex-row gap-1 text-base cursor-pointer ${selectedComponentName ? 'text-[#333333]' : 'text-[#999999]'}`}
              onClick={() => setIsItemSheetOpen(true)}
            >
              <MemoryItemIcon />
              {selectedComponentName || '기록할 추억을 선택해 주세요.'}
            </div>
          </div>

          {error && <div className='w-full max-w-[380px] mb-2 text-red-500 text-sm'>{error}</div>}

          <div className='w-full max-w-[380px]'>
            <Button isComplete={isComplete && !isLoading} onClick={handleMemory}>
              {isLoading ? '저장 중...' : '추억 작성'}
            </Button>
          </div>
        </div>
      </div>

      <BottomSheetMemoryItem
        isOpen={isItemSheetOpen}
        onClose={() => setIsItemSheetOpen(false)}
        height={'500px'}
        onSelectComponent={(Component) => {
          setSelectedComponentName(Component.displayName || Component.name);
        }}
      />
      <BottomSheetDate
        isOpen={isDateSheetOpen}
        onClose={() => setIsDateSheetOpen(false)}
        height={'380px'}
        onSelectDate={handleDateSelect}
        maxDate={today}
        minDate={firstMeetingDate || new Date('2025-01-01')} // 여기서 첫 만남 날짜 이전은 선택 불가
      />
    </>
  );
}

MemoryCreatePage.getLayout = (page: ReactNode) => (
  <>
    <Header>추억 작성</Header>
    <BottomBar>{page}</BottomBar>
  </>
);
