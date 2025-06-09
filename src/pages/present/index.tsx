import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import PresentItem from '@/components/shared/PresentItem';
import React, { ReactNode, useEffect, useState } from 'react';
import { backendUrl } from '@/config/config';

interface GiftItem {
  detail: string;
  product: string;
}

interface DdayRecommendation {
  dday: string;
  keyword: string;
  recommended: string[];
}

export default function PresentPage() {
  const [wishlistGifts, setWishlistGifts] = useState<GiftItem[]>([]);
  const [ddayGifts, setDdayGifts] = useState<DdayRecommendation | null>(null);
  const [partnerName, setPartnerName] = useState<string>(''); // 빈 문자열로 초기화

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        // 위시리스트 추천
        const wishlistRes = await fetch(`${backendUrl}/recommend/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (wishlistRes.ok) {
          const json = await wishlistRes.json();
          console.log('partnerName from API:', json.partnerName);
          setPartnerName(json.partnerName || '상대방');

          setWishlistGifts(json.recommended || []);
        } else {
          console.warn('위시리스트 추천 불러오기 실패');
        }

        // D-day 추천 (항상 실행)
        const ddayRes = await fetch(`${backendUrl}/recommend/dday`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (ddayRes.ok) {
          const ddayJson = await ddayRes.json();
          console.log('D-day 응답 확인:', ddayJson);

          const recommended = ddayJson.recommended || ddayJson.giftList;

          if (recommended && recommended.length > 0) {
            setDdayGifts({ ...ddayJson, recommended });
          } else {
            console.log('추천 선물 없음');
          }
        } else {
          console.error('D-day API 실패:', ddayRes.status);
        }
      } catch (err: any) {
        setError(err.message || '서버 요청 실패');
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  if (loading) return <div></div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className='min-h-[calc(100vh-112px)] pb-[56px] bg-[#F6F8FA] items-center'>
      <main className='w-full max-w-[412px] mx-auto flex flex-col gap-8 py-8 px-4 md:px-8'>
        {/* 위시리스트 기반 추천 */}
        {wishlistGifts.length > 0 ? (
          <PresentItem
            sectionTitle={`${partnerName}님의 위시리스트 기반 추천 선물`}
            sectionSubtitle='관심 키워드별로 G마켓에서 추천해봤어요!'
            items={wishlistGifts.map((gift) => ({
              label: gift.detail,
              title: gift.product,
              description: `${partnerName}님의 관심사 "${gift.detail}"에 대한 추천 상품이에요.`,
              href: `https://browse.gmarket.co.kr/search?keyword=${encodeURIComponent('커플' + gift.detail + ' 선물')}`,
            }))}
          />
        ) : (
          <div className='text-center text-gray-500 text-sm'>{`${partnerName || '상대방'}이 위시리스트를 선택하지 않았습니다.`}</div>
        )}

        {/* D-day 기반 추천 */}
        {ddayGifts && (
          <PresentItem
            sectionTitle={`D-day(${ddayGifts.dday}) 기념일 추천 선물`}
            sectionSubtitle={`다가오는 기념일 키워드 "${ddayGifts.keyword}"로 준비해봤어요!`}
            items={ddayGifts.recommended.map((item) => ({
              title: item,
              label: ddayGifts.keyword,
              description: `다가오는 기념일에 어울리는 "${ddayGifts.keyword}" 선물이에요.`,
              href: `https://browse.gmarket.co.kr/search?keyword=${encodeURIComponent('커플 ' + ddayGifts.keyword + ' 선물')}`,
            }))}
          />
        )}
      </main>
    </div>
  );
}

PresentPage.getLayout = (page: ReactNode) => {
  return (
    <>
      <Header>선물 추천</Header>
      {page}
      <BottomBar />
    </>
  );
};
