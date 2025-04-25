import BottomBar from '@/components/shared/BottomBar';
import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import Input from '@/components/shared/Input';
import ProfileItem from '@/components/shared/ProfileItem';
import { ReactNode } from 'react';

export default function Home() {
  return (
    <div className='text-xl'>
      <Input label='이메일' placeholder='회원가입에 사용한 이메일을 입력해 주세요.' />
      <Input label='이메일' placeholder='회원가입에 사용한 이메일을 입력해 주세요.' width='w-[348px]' />
      <Input
        label='이메일'
        placeholder='회원가입에 사용한 이메일을 입력해 주세요.'
        width='w-[348px]'
        helperText='· 이메일은 123456@naver.com 형식입니다.'
      />
      <ProfileItem></ProfileItem>
      <ProfileItem type='profile'></ProfileItem>
      <ProfileItem type='date'></ProfileItem>
      <ProfileItem type='question'></ProfileItem>
    </div>
  );
}

Home.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>안녕</Header>
      <BottomBar>
        {page}
        <Button isComplete={true}>확인</Button>
      </BottomBar>
    </>
  );
};
