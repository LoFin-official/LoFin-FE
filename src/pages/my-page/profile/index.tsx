import { ForwardIcon } from '@/assets/icons/SvgIcon';
import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { backendUrl } from '@/config/config';

interface UserProfile {
  nickname: string;
  birth: string;
  profileImageUrl: string | null;
}

interface CoupleInfo {
  firstMeetingDate: string;
}

interface ProfileData {
  myProfile: UserProfile;
  partnerProfile: UserProfile;
  coupleInfo: CoupleInfo;
}

export default function ProfilePage() {
  const router = useRouter();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/coupleprofile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('프로필을 불러오는 데 실패했습니다.');
        }

        const data = await response.json();

        console.log('내 프로필 이미지 URL:', `${backendUrl}/${data.myProfile.profileImageUrl?.replace(/^\/?/, '')}`);
        console.log('애인 프로필 이미지 URL:', `${backendUrl}/${data.partnerProfile.profileImageUrl?.replace(/^\/?/, '')}`);

        setProfileData({
          myProfile: {
            nickname: data.myProfile.nickname,
            birth: data.myProfile.birth,
            profileImageUrl: data.myProfile.profilePicture, // 여기 수정
          },
          partnerProfile: {
            nickname: data.partnerProfile.nickname,
            birth: data.partnerProfile.birth,
            profileImageUrl: data.partnerProfile.profilePicture, // 여기 수정
          },
          coupleInfo: {
            firstMeetingDate: data.coupleInfo.firstMeetingDate,
          },
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        alert('프로필 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!profileData) {
    return <div>프로필 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <>
      <div className='flex flex-col gap-4 pt-4 bg-[#ffd9e1]/35 min-h-[calc(100vh-112px)] items-center pb-[72px] px-4'>
        {/* 내 프로필 */}
        <div className='flex flex-col gap-4 w-full max-w-[380px] h-[296px] bg-[#FFFFFF] rounded-[18px] px-6 py-6 items-center'>
          <span className='h-6 text-xl font-bold text-[#333333] self-start'>내 프로필</span>

          {/* 프로필 이미지 */}
          <div className='w-[120px] h-[120px] rounded-full bg-[#CCCCCC] overflow-hidden'>
            {profileData.myProfile.profileImageUrl ? (
              <img
                src={`${backendUrl}/${profileData.myProfile.profileImageUrl.replace(/^\/?/, '')}`}
                alt='내 프로필 이미지'
                className='w-full h-full object-cover'
              />
            ) : null}
          </div>

          {/* 닉네임 */}
          <div className='flex flex-row justify-between items-center w-full cursor-pointer' onClick={() => router.push('/my-page/profile/edit')}>
            <span className='text-lg text-[#333333]'>닉네임</span>
            <div className='flex flex-row gap-2 items-center'>
              <span className='text-lg text-[#999999]'>{profileData.myProfile.nickname}</span>
              <ForwardIcon />
            </div>
          </div>

          {/* 생년월일 */}
          <div className='flex flex-row justify-between items-center w-full cursor-pointer' onClick={() => router.push('/my-page/profile/edit')}>
            <span className='text-lg text-[#333333]'>생년월일</span>
            <div className='flex flex-row gap-2 items-center'>
              <span className='text-lg text-[#999999]'>{profileData.myProfile.birth}</span>
              <ForwardIcon />
            </div>
          </div>
        </div>

        {/* 애인 프로필 */}
        <div className='flex flex-col gap-4 w-full max-w-[380px] h-[296px] bg-[#FFFFFF] rounded-[18px] px-6 py-6 items-center'>
          <span className='h-6 text-xl font-bold text-[#333333] self-start'>애인 프로필</span>

          {/* 프로필 이미지 */}
          <div className='w-[120px] h-[120px] rounded-full bg-[#CCCCCC] overflow-hidden'>
            {profileData.partnerProfile.profileImageUrl ? (
              <img
                src={`${backendUrl}/${profileData.partnerProfile.profileImageUrl.replace(/^\/?/, '')}`}
                alt='애인 프로필 이미지'
                className='w-full h-full object-cover'
              />
            ) : null}
          </div>

          {/* 닉네임 */}
          <div className='flex flex-row justify-between items-center w-full'>
            <span className='text-lg text-[#333333]'>닉네임</span>
            <span className='text-lg text-[#999999]'>{profileData.partnerProfile.nickname}</span>
          </div>

          {/* 생년월일 */}
          <div className='flex flex-row justify-between items-center w-full'>
            <span className='text-lg text-[#333333]'>생년월일</span>
            <span className='text-lg text-[#999999]'>{profileData.partnerProfile.birth}</span>
          </div>
        </div>

        {/* 커플 정보 */}
        <div className='flex flex-col gap-4 w-full max-w-[380px] h-[116px] bg-[#FFFFFF] rounded-[18px] py-6 px-6 items-center'>
          <span className='h-6 text-xl font-bold text-[#333333] self-start'>커플 정보</span>
          <div className='flex flex-row justify-between items-center w-full cursor-pointer'>
            <span className='text-lg text-[#333333]'>첫 만남</span>
            <div className='flex flex-row gap-2 items-center' onClick={() => router.push('/my-page/profile/couple-edit')}>
              <span className='text-lg text-[#999999]'>{profileData.coupleInfo.firstMeetingDate}</span>
              <ForwardIcon />
            </div>
          </div>
        </div>

        <span className='text-lg text-[#CCCCCC] self-end px-6 -mt-2 cursor-pointer'>연결 끊기</span>
      </div>
    </>
  );
}

ProfilePage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>프로필</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
