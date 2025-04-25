import Header from '@/components/shared/Header';
import React, { ReactNode } from 'react';

export default function ProfilePage() {
  return;
}

ProfilePage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>프로필 설정</Header>
      {page}
    </>
  );
};
