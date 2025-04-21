import React, { useState } from 'react';
import QuestionTabs from '@/components/QuestionTabs';

export default function QuestionPage() {
  const [selectedTab, setSelectedTab] = useState<'direct' | 'random'>('direct');

  return (
    <div className='mt-4'>
      {/* 탭 컴포넌트 */}
      <QuestionTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />
    </div>
  );
}
