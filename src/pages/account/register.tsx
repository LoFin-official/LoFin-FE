import Header from '@/components/shared/Header';
import React, { ReactNode } from 'react';

export default function RegisterPage() {
  return;
}

RegisterPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>회원가입</Header>
      {page}
    </>
  );
};
