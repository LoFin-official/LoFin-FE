import { ProgressIcon, ProgressingIcon } from '@/assets/icons/SvgIcon';
import Button from '@/components/shared/Button';
import React, { useState, useEffect } from 'react';
import Input from '../Input';
import ProfileItem from '../ProfileItem';
import { useRouter } from 'next/router';
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

// (중략: import 생략)

export default function CoupleCompletePage({ currentStep }: { currentStep: number }) {
  const [birth, setBirth] = useState('');
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isValidDate = (dateString: string) => {
    if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateString)) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    const inputDate = new Date(year, month - 1, day);
    return month >= 1 && month <= 12 && day >= 1 && day <= lastDayOfMonth && inputDate <= today;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d-]/g, '');
    const digits = rawValue.replace(/-/g, '');
    let formatted = '';
    if (digits.length > 0) formatted = digits.slice(0, 4);
    if (digits.length > 4) formatted += `-${digits.slice(4, 6)}`;
    if (digits.length > 6) formatted += `-${digits.slice(6, 8)}`;
    setBirth(formatted);
  };

  const isComplete = isValidDate(birth);

  const standardizeDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    console.log('handleStart 호출, birth:', birth, 'isComplete:', isComplete);
    if (!isComplete) {
      alert('날짜 형식이 올바르지 않습니다.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 후 시도해 주세요.');
      return;
    }
    try {
      const formattedDate = standardizeDate(birth);
      console.log('표준화된 날짜:', formattedDate);

      const res = await fetch(`${backendUrl}/firstMet/firstmet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstMetDate: formattedDate }),
      });

      console.log('응답 상태:', res.status);
      const resJson = await res.json();
      console.log('응답 내용:', resJson);

      if (!res.ok) {
        throw new Error(resJson.message || '등록 실패');
      }
      alert('첫 만남 날짜가 등록되었습니다.');
      console.log('API 성공, 페이지 이동 시도');
      await router.push('/memory');
    } catch (error: any) {
      console.error('등록 실패:', error.message);
      alert(`오류: ${error.message}`);
    }
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${backendUrl}/coupleprofile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('프로필 실패');
      const data = await res.json();
      setProfileData(data);
    } catch (err) {
      console.error('프로필 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };
  const checkFirstMet = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/firstMet/firstMet/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('상태 체크 실패');
      const data = await res.json();

      console.log('firstMet 상태 체크 응답:', data);

      // bothCompleted 기준으로 페이지 이동
      if (data?.bothCompleted) {
        alert('상대방이 첫 만남 날짜를 입력했어요!\n 추억 페이지로 이동합니다!');
        router.push('/memory');
      }
    } catch (err) {
      console.error('firstMet 상태 확인 실패:', err);
    }
  };

  useEffect(() => {
    fetchProfile();

    let active = true;

    const pollCheckFirstMet = async () => {
      if (!active) return;

      await checkFirstMet();
      setTimeout(pollCheckFirstMet, 10000); // 10초 후 다시 호출
    };

    pollCheckFirstMet();

    return () => {
      active = false;
    };
  }, []);

  const steps = ['1', '2', '3', '4'];

  return (
    <div className='flex flex-col min-h-[calc(100vh-56px)] w-full max-w-[412px] pt-8 py-4 px-4'>
      <div className='flex flex-1 justify-center'>
        <div className='flex flex-col gap-8 items-center'>
          <div className='flex flex-row gap-1 items-center'>
            {steps.map((step, index) => (
              <div key={index} className='flex items-center gap-1'>
                <ProgressIcon text={step} active={index <= currentStep} />
                {index < steps.length - 1 && <ProgressingIcon active={index < currentStep} />}
              </div>
            ))}
          </div>

          <div className='flex flex-col gap-0.5 w-[380px] text-center'>
            <span className='text-[#333333] text-xl font-bold'>
              축하합니다! 운명이 이어졌어요.
              <br />
              함께 특별한 날을 기록해 보세요!
            </span>
          </div>

          {loading ? (
            <div>로딩 중...</div>
          ) : profileData ? (
            <ProfileItem
              type='none'
              myNickname={profileData.myProfile.nickname}
              partnerNickname={profileData.partnerProfile.nickname}
              myProfileImageUrl={
                profileData.myProfile.profilePicture ? `${backendUrl}/${profileData.myProfile.profilePicture.replace(/^\/?/, '')}` : undefined
              }
              partnerProfileImageUrl={
                profileData.partnerProfile.profilePicture
                  ? `${backendUrl}/${profileData.partnerProfile.profilePicture.replace(/^\/?/, '')}`
                  : undefined
              }
            />
          ) : (
            <div>프로필 정보 없음</div>
          )}

          {/* 날짜 입력 */}
          <div className='flex flex-col gap-1'>
            <Input
              width='w-full max-w-[380px] md:w-[380px]'
              label='두 사람의 첫 순간을 기록해 보세요.'
              placeholder='예: 2001-08-25 형식으로 입력해 주세요.'
              value={birth}
              maxLength={10}
              onChange={handleInputChange}
            />
            {!isValidDate(birth) && birth && <div className='text-[#FF2A2A] text-sm ml-1 mt-1'>날짜는 YYYY-MM-DD 형식의 올바른 날짜여야 합니다.</div>}
          </div>
        </div>
      </div>
      <Button isComplete={isComplete} onClick={handleStart} className='w-full max-w-[380px]'>
        시작하기
      </Button>
    </div>
  );
}
