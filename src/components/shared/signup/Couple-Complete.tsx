import { ProgressIcon, ProgressingIcon } from '@/assets/icons/SvgIcon';
import Button from '@/components/shared/Button';
import React, { useState } from 'react';
import Input from '../Input';
import ProfileItem from '../ProfileItem';
import { useRouter } from 'next/router';

const backendUrl = 'http://192.168.35.111:5000'; // 백엔드 서버 주소

export default function CoupleCompletePage({ currentStep }: { currentStep: number }) {
  const [birth, setBirth] = useState('');
  const router = useRouter();

  // 날짜 유효성 검사 - 한 자릿수 월/일도 허용 (예: 2023-5-7)
  const isValidDate = (dateString: string) => {
    // 기본 형식 검사 (YYYY-M-D 또는 YYYY-MM-DD 등 유연하게 허용)
    if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateString)) return false;

    const [year, month, day] = dateString.split('-').map(Number);

    // 월과 일이 유효한 범위인지 확인
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    // 월별 일수 확인 (윤년 포함)
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    if (day > lastDayOfMonth) return false;

    // 미래 날짜는 불허
    const today = new Date();
    const inputDate = new Date(year, month - 1, day);
    if (inputDate > today) return false;

    return true;
  };

  // 입력 처리 - 자동 하이픈 삽입 기능만 유지
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // 숫자와 하이픈만 허용
    const cleanValue = rawValue.replace(/[^\d-]/g, '');

    // 숫자만 추출
    const digits = cleanValue.replace(/-/g, '');

    // 자동 하이픈 삽입
    let formattedValue = '';

    // 연도 부분 (최대 4자리)
    if (digits.length > 0) {
      formattedValue = digits.slice(0, Math.min(4, digits.length));
    }

    // 월 부분 추가 (하이픈 + 최대 2자리)
    if (digits.length > 4) {
      formattedValue += `-${digits.slice(4, Math.min(6, digits.length))}`;
    }

    // 일 부분 추가 (하이픈 + 최대 2자리)
    if (digits.length > 6) {
      formattedValue += `-${digits.slice(6, Math.min(8, digits.length))}`;
    }

    setBirth(formattedValue);
  };

  // 완료 상태 확인
  const isComplete = isValidDate(birth);

  // 최종 제출시 날짜 표준화 (서버에 보내기 전 YYYY-MM-DD 형식으로 변환)
  const standardizeDate = (dateString: string): string => {
    if (!isValidDate(dateString)) return dateString;

    const [year, month, day] = dateString.split('-').map(Number);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    console.log('✅ handleStart 호출됨'); // 제일 먼저 이거 찍히는지 확인

    if (!isComplete) {
      console.log('❌ isComplete가 false라서 종료');
      return;
    }
    const standardizedDate = standardizeDate(birth);

    const token = localStorage.getItem('token') || '';
    console.log('불러온 토큰:', token);

    if (!token) {
      alert('로그인 후 다시 시도해 주세요.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/firstMet/firstmet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 토큰 추가
        },
        body: JSON.stringify({ firstMetDate: standardizedDate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '처음 만난 날짜 설정 실패');
      }

      router.push('/memory');
    } catch (error: any) {
      console.error('처음 만난 날짜 설정 실패:', error.message);
      alert(`오류: ${error.message}`);
    }
  };

  const steps = ['1', '2', '3', '4'];

  return (
    <>
      <div className='flex flex-col min-h-[calc(100vh-56px)] pt-8 justify-between'>
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
            <ProfileItem />
            <div className='flex flex-col gap-1'>
              <Input
                label='두 사람의 첫 순간을 기록해 보세요.'
                placeholder='연도-월-일(YYYY-MM-DD) 형식으로 입력해 주세요.'
                value={birth}
                maxLength={10}
                onChange={handleInputChange}
              />
              {!isValidDate(birth) && birth && (
                <div className='text-[#FF2A2A] text-sm ml-1 mt-1'>날짜는 YYYY-MM-DD 형식의 올바른 날짜여야 합니다.</div>
              )}
            </div>
          </div>
        </div>
        <Button isComplete={isComplete} onClick={handleStart} className='mb-4'>
          시작하기
        </Button>
      </div>
    </>
  );
}
