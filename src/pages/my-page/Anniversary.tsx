import React, { useState } from 'react';
import AnniversaryItem from '@/components/shared/AnniversaryItem';

interface Anniversary {
  label: string;
  dday: string;
  date: string;
}

export default function Home() {
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([
    { label: '100일', dday: 'D-38', date: '2025. 05. 19. (월)' },
    { label: '200일', dday: 'D-138', date: '2025. 08. 27. (수)' },
    { label: '300일', dday: 'D-238', date: '2025. 12. 05. (금)' },
    { label: '365일', dday: 'D-303', date: '2026. 02. 08. (일)' },
    { label: '730일', dday: 'D-668', date: '2027. 02. 07. (일)' },
    { label: '1095일', dday: 'D-1028', date: '2028. 02. 06. (일)' },
  ]);

  const handleDeleteAnniversary = (label: string) => {
    // 기념일 삭제 처리: 해당 label을 제외한 새로운 배열 생성
    const updatedAnniversaries = anniversaries.filter((anniversary) => anniversary.label !== label);
    setAnniversaries(updatedAnniversaries); // 상태 업데이트
  };

  return (
    <div className='p-4'>
      {anniversaries.map((anniversary) => (
        <AnniversaryItem
          key={anniversary.label}
          label={anniversary.label}
          dday={anniversary.dday}
          date={anniversary.date}
          onDelete={() => handleDeleteAnniversary(anniversary.label)} // 삭제 핸들러 추가
        />
      ))}
    </div>
  );
}
