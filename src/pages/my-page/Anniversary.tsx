import React from 'react';
import AnniversaryItem from '@/components/AnniversaryItem';

export default function Home() {
  return (
    <div className='p-4'>
      <AnniversaryItem label='100일' dday='D-38' date='2025. 05. 19. (월)' />

      <AnniversaryItem label='200일' dday='D-138' date='2025. 08. 27. (수)' />

      <AnniversaryItem label='300일' dday='D-238' date='2025. 12. 05. (금)' />

      <AnniversaryItem label='365일' dday='D-303' date='2026. 02. 08. (일)' />

      <AnniversaryItem label='730일' dday='D-668' date='2027. 02. 07. (일)' />

      <AnniversaryItem label='1095일' dday='D-1028' date='2028. 02. 06. (일)' />
    </div>
  );
}
