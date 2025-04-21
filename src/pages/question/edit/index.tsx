import QuestionTabs from '@/components/shared/question/QuestionTabs';
import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import { ReactNode } from 'react';
import React, { useState } from 'react';

export default function QuestionEditPage() {
  const [selectedTab, setSelectedTab] = useState<'direct' | 'random'>('direct');

  return (
    <div>
      {/* 탭 컴포넌트 */}
      <QuestionTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />
    </div>
  );
}

QuestionEditPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>질문 생성</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
