import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/shared/Header';
import BottomBar from '@/components/shared/BottomBar';
import Button from '@/components/shared/Button';
import BottomSheetDate from '@/components/shared/BottomSheetDate';
import { ImageCloseIcon, MemoryDateIcon } from '@/assets/icons/SvgIcon';
import { backendUrl } from '@/config/config';

interface Memory {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string | string[];
  createdAt: string;
}

export default function MemoryEditPage() {
  const router = useRouter();
  const { id } = router.query;
  const memoryId = Array.isArray(id) ? id[0] : id;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [images, setImages] = useState<{ id: number; url?: string; file?: File }[]>([]);
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]); // ✅ 추가

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!memoryId) return;

    async function fetchMemory() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('로그인이 필요합니다.');
          router.push('/login');
          return;
        }

        const res = await fetch(`${backendUrl}/memory/detail/${memoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`오류: ${res.status}`);

        const memory: Memory = await res.json();
        setTitle(memory.title);
        setText(memory.content);

        const date = new Date(memory.createdAt);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        setSelectedDate(`${y}. ${m}. ${d}`);

        if (memory.imageUrl) {
          const urls = Array.isArray(memory.imageUrl) ? memory.imageUrl : [memory.imageUrl];
          const fullUrls = urls.map((url) => (url.startsWith('http') ? url : `${backendUrl}${url}`));
          setOriginalImageUrls(urls.map((url) => url.replace(backendUrl, ''))); // ✅ 원본 URL 저장

          setImages(
            fullUrls.map((url, idx) => ({
              id: idx + 1,
              url,
            }))
          );
        }

        setLoading(false);
      } catch (err) {
        console.error('메모리 불러오기 실패:', err);
        setLoading(false);
      }
    }

    fetchMemory();
  }, [memoryId, router]);

  const resizeHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textarea.current) {
      textarea.current.style.height = 'auto';
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
    setText(e.target.value);
  };

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAddImage = () => {
    if (fileInputRef.current && images.length < 5) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: { id: number; url?: string; file?: File }[] = [];
    for (let i = 0; i < files.length && images.length + newImages.length < 5; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newImages.push({ id: Date.now() + i, url, file });
    }
    setImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (idToRemove: number) => {
    setImages((prev) => prev.filter((img) => img.id !== idToRemove));
  };

  const handleDateSelect = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${y}. ${m}. ${d}`);
    setIsDateSheetOpen(false);
  };

  const formatDateForServer = (dateStr: string) => {
    const [y, m, d] = dateStr.split('.').map((s) => s.trim());
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  };

  const handleMemory = async () => {
    if (!title.trim() || !text.trim() || !selectedDate) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      const newFiles = images.filter((img) => img.file).map((img) => img.file!);
      const existingUrls = images.filter((img) => !img.file).map((img) => img.url?.replace(backendUrl, '') || '');

      const removedImages = originalImageUrls.filter((url) => !existingUrls.includes(url));

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', text);
      formData.append('createdAt', formatDateForServer(selectedDate));
      formData.append('position', JSON.stringify({ x: 0, y: 0 }));
      formData.append('rotation', String(0));

      if (removedImages.length > 0) {
        formData.append('removeImages', JSON.stringify(removedImages));
      }

      newFiles.forEach((file) => {
        formData.append('images', file);
      });

      const res = await fetch(`${backendUrl}/memory/${memoryId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        alert(`수정 실패: ${res.status} ${errText}`);
        return;
      }

      alert('수정 완료!');
      router.replace('/memory');
    } catch (err: any) {
      alert(`오류: ${err.message}`);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  const isComplete = title.trim() && text.trim() && selectedDate;

  return (
    <>
      <div className='flex flex-col h-[calc(100vh-112px)] w-full max-w-[412px] mx-auto px-4 pt-8 pb-4'>
        {/* 제목 입력 */}
        <div className='w-full max-w-[380px] h-9 py-2 px-0.5 border-b border-[#cccccc] mb-4'>
          <input
            className='w-full h-5 text-xl font-bold text-[#333] placeholder:text-[#ccc] focus:outline-none'
            value={title}
            onChange={onChangeTitle}
            placeholder='제목을 입력해 주세요.'
          />
        </div>

        {/* 내용 */}
        <div className='flex-grow w-full max-w-[380px]'>
          <div className='w-full max-w-[364px] h-auto mx-2'>
            <textarea
              rows={1}
              ref={textarea}
              className='w-full max-h-[200px] text-base text-[#767676] resize-none overflow-y-auto leading-relaxed focus:outline-none'
              placeholder='추억 내용을 작성해 주세요.'
              value={text}
              onChange={resizeHeight}
            />
          </div>
        </div>

        {/* 이미지 */}
        <div className='flex-shrink-0'>
          {images.length > 0 && (
            <div className='w-full max-w-[380px] h-[216px] px-0.5 py-2 border-t border-b border-[#eee] overflow-x-auto scrollbar-hide'>
              <div className='flex flex-row gap-2 w-max'>
                {images.map((img) => (
                  <div key={img.id} className='w-[150px] h-[200px] rounded-md bg-[#eee] relative'>
                    {img.url && <img src={img.url} className='w-full h-full object-cover rounded-md' />}
                    <div className='absolute top-2 right-2 cursor-pointer' onClick={() => handleRemove(img.id)}>
                      <ImageCloseIcon />
                    </div>
                  </div>
                ))}
                {images.length < 5 && (
                  <div
                    className='w-[150px] h-[200px] rounded-md bg-[#f8f8f8] flex items-center justify-center cursor-pointer'
                    onClick={handleAddImage}
                  >
                    <div className='text-3xl text-[#ccc]'>+</div>
                  </div>
                )}
              </div>
            </div>
          )}
          <input type='file' accept='image/*' multiple ref={fileInputRef} className='hidden' onChange={handleFileChange} />
        </div>

        {/* 날짜 선택 */}
        <div className='w-full max-w-[380px] h-[52px] px-2 py-4'>
          <div
            className={`flex gap-1 text-base cursor-pointer ${selectedDate ? 'text-[#333]' : 'text-[#999]'}`}
            onClick={() => setIsDateSheetOpen(true)}
          >
            <MemoryDateIcon />
            <div>{selectedDate || '기록할 날짜를 선택해 주세요.'}</div>
          </div>
        </div>

        {/* 수정 버튼 */}
        <div className='w-full max-w-[380px]'>
          <Button isComplete={!!isComplete} onClick={handleMemory}>
            수정 완료
          </Button>
        </div>
      </div>

      {/* 바텀시트 */}
      <BottomSheetDate isOpen={isDateSheetOpen} onClose={() => setIsDateSheetOpen(false)} height='380px' onSelectDate={handleDateSelect} />
    </>
  );
}

MemoryEditPage.getLayout = (page: ReactNode) => (
  <>
    <Header>추억 수정</Header>
    <BottomBar>{page}</BottomBar>
  </>
);
