import { backendUrl } from '@/config/config';

export interface Memory {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string | string[];
  position: { x: number; y: number };
  rotation: number;
  memoryDate: string;
  updatedAt: string;
  styleType?: string;
}

export interface PreparedMemory {
  _id: string;
  title: string;
  text: string;
  date: string;
  dday: number;
  imageUrl: string;
  position: { x: number; y: number };
  rotation: number;
  border: boolean;
  styleType: string;
}

export async function fetchMemoriesFromAPI() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${backendUrl}/memory`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export function prepareMemoryData(memories: Memory[], coupleSince?: string): PreparedMemory[] {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  // D-day 계산 함수 (첫 만남 날짜부터 경과 일수 계산)
  const calculateDDay = (firstMetDate: string, targetDate: string) => {
    const first = new Date(firstMetDate);
    const target = new Date(targetDate);
    const diffTime = target.getTime() - first.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // 1일부터 시작
    return diffDays;
  };

  if (!coupleSince) return [];

  return memories
    .map((memory) => {
      let firstImageUrl = '';

      if (Array.isArray(memory.imageUrl)) {
        firstImageUrl = memory.imageUrl[0] || '';
      } else if (typeof memory.imageUrl === 'string') {
        firstImageUrl = memory.imageUrl;
      }

      return {
        _id: memory._id,
        title: memory.title,
        text: memory.content,
        date: formatDate(memory.memoryDate),
        dday: calculateDDay(coupleSince, memory.memoryDate),
        imageUrl: firstImageUrl,
        position: memory.position,
        rotation: memory.rotation,
        border: true,
        styleType: memory.styleType || 'MemoryItem',
      };
    })
    .sort((a, b) => a.dday - b.dday);
}
