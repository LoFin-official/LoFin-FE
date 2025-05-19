import React, { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // router import
import AnniversaryItem from '@/components/shared/AnniversaryItem';
import Header from '@/components/shared/Header';
import BottomBar from '@/components/shared/BottomBar';
import ProfileItem from '@/components/shared/ProfileItem';

interface Anniversary {
  _id: string;
  title: string;
  days: number;
  date: string;
}

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

const backendUrl = 'http://192.168.208.161:5000';

export default function AnniversaryPage() {
  const router = useRouter();

  const [anniversaries, setAnniversaries] = useState<{ label: string; dday: string; date: string; _id: string }[]>([]);
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. 기념일 데이터 요청
        const anniversaryRes = await fetch(`${backendUrl}/anniversary`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!anniversaryRes.ok) {
          throw new Error(`기념일 로드 실패: ${anniversaryRes.status}`);
        }

        const anniversaryData: Anniversary[] = await anniversaryRes.json();

        // days가 적은 순서로 정렬
        const sortedData = anniversaryData.sort((a, b) => a.days - b.days);

        setAnniversaries(
          sortedData.map((item) => ({
            _id: item._id,
            label: item.title,
            dday: `D-${item.days}`,
            date: new Date(item.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              weekday: 'short',
            }),
          }))
        );

        // 2. 프로필 데이터 요청
        const profileRes = await fetch(`${backendUrl}/coupleprofile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileRes.ok) {
          throw new Error('프로필 로드 실패');
        }

        const profileJson: ProfileResponse = await profileRes.json();
        setProfileData(profileJson);
      } catch (err: any) {
        setError(err.message || '데이터 불러오기 실패');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 수정 페이지로 이동 함수
  const onEditClick = (anniversaryId: string) => {
    router.push(`/my-page/anniversary/edit?id=${anniversaryId}`);
  };

  // 삭제 후 UI 및 DB에서 삭제 처리 함수
  const handleDeleteAnniversary = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/anniversary/anniversarydelete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('삭제 실패');
      }
      alert('삭제 되었습니다.');
      setAnniversaries((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      setError(err.message || '삭제 중 오류 발생');
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;

  return (
    <div className='min-h-[calc(100vh-112px)] pb-[56px]'>
      {profileData && (
        <ProfileItem
          type='date'
          myNickname={profileData.myProfile.nickname}
          partnerNickname={profileData.partnerProfile.nickname}
          myProfileImageUrl={
            profileData.myProfile.profilePicture ? `${backendUrl}/${profileData.myProfile.profilePicture.replace(/^\/?/, '')}` : undefined
          }
          partnerProfileImageUrl={
            profileData.partnerProfile.profilePicture ? `${backendUrl}/${profileData.partnerProfile.profilePicture.replace(/^\/?/, '')}` : undefined
          }
        />
      )}

      <div className='pt-4'>
        {anniversaries.map((anniversary) => (
          <AnniversaryItem
            key={anniversary._id}
            Id={anniversary._id}
            label={anniversary.label}
            dday={anniversary.dday}
            date={anniversary.date}
            onDelete={() => handleDeleteAnniversary(anniversary._id)}
            onEdit={() => onEditClick(anniversary._id)}
          />
        ))}
      </div>
    </div>
  );
}

AnniversaryPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>기념일</Header>
      <BottomBar>{page}</BottomBar>
    </>
  );
};
