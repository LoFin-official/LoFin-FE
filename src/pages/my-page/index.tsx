import { AlertIcon, HeartIcon, WishIcon } from '@/assets/icons/SvgIcon';
import BottomBar from '@/components/shared/BottomBar';
import ProfileItem from '@/components/shared/ProfileItem';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { backendUrl } from '@/config/config';

interface ProfileResponse {
  myProfile: {
    nickname: string;
    profilePicture: string | null;
  };
  partnerProfile: {
    nickname: string;
    profilePicture: string | null;
  };
}

export default function MyPage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dDay, setDDay] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/coupleprofile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('프로필 로드 실패');
        }

        const data = await res.json();
        setProfileData(data);
        const dDayRes = await fetch(`${backendUrl}/firstMet/days-since-first-met`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (dDayRes.ok) {
          const dDayData = await dDayRes.json();
          setDDay(dDayData.message); // ex) "D-123일"
        } else {
          setDDay('D-Day 정보 없음');
        }
      } catch (error) {
        console.error(error);
        alert('프로필 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (!confirm('정말 회원 탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/auth/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('회원 탈퇴 실패');
      }

      alert('회원 탈퇴가 완료되었습니다.');

      localStorage.removeItem('token'); // 토큰 삭제
      router.push('/'); // 첫 메인 페이지로 이동
    } catch (error) {
      console.error(error);
      alert('회원 탈퇴 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!profileData) {
    return <div>프로필 정보를 불러올 수 없습니다.</div>;
  }
  const handleLogout = () => {
    alert('로그아웃 되었습니다.');
    localStorage.removeItem('token'); // 토큰 삭제
    router.push('/index.tsx'); // 로그인 페이지로 이동
  };
  return (
    <div className='flex flex-col gap-4 bg-[#ffd9e1]/35 min-h-[calc(100vh-56px)] items-center'>
      <div className='w-full max-w-[412px] flex flex-col gap-4 px-4'>
        <div className='h-8 px-2 mt-4 flex flex-row font-bold items-center justify-between w-full max-w-[380px]'>
          <span className='text-[#333333] text-2xl'>마이페이지</span>
          <span className='text-[#FF9BB3] text-lg'>{dDay}</span>
        </div>
        <div className='flex flex-col gap-4'>
          <ProfileItem
            type='profile'
            myNickname={profileData.myProfile.nickname}
            partnerNickname={profileData.partnerProfile.nickname}
            myProfileImageUrl={
              profileData.myProfile.profilePicture ? `${backendUrl}/${profileData.myProfile.profilePicture.replace(/^\/?/, '')}` : undefined
            }
            partnerProfileImageUrl={
              profileData.partnerProfile.profilePicture ? `${backendUrl}/${profileData.partnerProfile.profilePicture.replace(/^\/?/, '')}` : undefined
            }
          />
        </div>
        <div className='w-full max-w-[380px] h-[124px] bg-[#ffffff] rounded-[18px] py-6 items-center'>
          <div className='flex flex-row gap-8 justify-center'>
            <div className='flex flex-col gap-4 w-[78px] text-[#FF9BB3] text-lg cursor-pointer items-center'>
              <WishIcon onClick={() => router.push('/my-page/wish')} />
              위시리스트
            </div>
            <div
              className='flex flex-col gap-4 w-[78px] text-[#FF9BB3] text-lg cursor-pointer items-center'
              onClick={() => router.push('/my-page/anniversary')}
            >
              <HeartIcon className='w-8 h-8' />
              기념일
            </div>
            <div className='flex flex-col gap-4 w-[78px] text-[#FF9BB3] text-lg cursor-pointer items-center'>
              <AlertIcon onClick={() => router.push('/my-page/alert')} />
              알림
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2 w-full max-w-[348px] h-12 text-base mx-auto'>
          <div className='h-5 text-right mr-auto text-[#767676] cursor-pointer' onClick={handleLogout}>
            로그아웃
          </div>
          <div className='h-5 text-left ml-auto text-[#CCCCCC] cursor-pointer' onClick={handleDeleteAccount}>
            회원탈퇴
          </div>
        </div>
      </div>
    </div>
  );
}

MyPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
