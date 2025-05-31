import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import PresentItem from '@/components/shared/PresentItem';
import React, { ReactNode, useEffect, useState } from 'react';
import { backendUrl } from '@/config/config';

interface GiftItem {
  detail: string;
  product: string;
}

export default function PresentPage() {
  const [wishlistGifts, setWishlistGifts] = useState<GiftItem[]>([]);
  const [partnerName, setPartnerName] = useState<string>('상대방');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGifts() {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/recommend/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const json = await res.json();
          setPartnerName(json.partnerName || '상대방');
          setWishlistGifts(json.recommended || []);
        } else {
          setError('추천 데이터를 불러올 수 없습니다.');
        }
      } catch (err: any) {
        setError(err.message || '서버 요청 실패');
      } finally {
        setLoading(false);
      }
    }

    fetchGifts();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className='min-h-[calc(100vh-112px)] pb-[56px] bg-[#F6F8FA] items-center'>
      <main className='w-full max-w-[412px] mx-auto flex flex-col gap-8 py-8 px-4 md:px-8'>
        <PresentItem
          sectionTitle={`${partnerName}님의 위시리스트 기반 추천 선물`}
          sectionSubtitle='관심 키워드별로 G마켓에서 추천해봤어요!'
          items={wishlistGifts.map((gift) => ({
            label: gift.detail,
            title: gift.product,
            description: `${partnerName}님의 관심사 "${gift.detail}"에 대한 추천 상품이에요.`,
            href: `https://browse.gmarket.co.kr/search?keyword=${encodeURIComponent('커플' + gift.detail + ' 선물')}`, // 🔗 detail + " 선물"을 붙여 검색
          }))}
        />
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
