import BottomBar from '@/components/shared/BottomBar';
import Header from '@/components/shared/Header';
import PresentItem from '@/components/shared/PresentItem';
import React, { ReactNode, useEffect, useState } from 'react';
import { backendUrl } from '@/config/config';

interface GiftItem {
  _id?: string;
  category: string;
  productName: string;
  recommendation: string;
  keywords?: string[]; // keywords 추가 (필요시)
}

export default function PresentPage() {
  const [wishlistGifts, setWishlistGifts] = useState<GiftItem[]>([]);
  const [recommendedGifts, setRecommendedGifts] = useState<GiftItem[]>([]);
  const [title, setTitle] = useState<string>('');
  const [partnerName, setPartnerName] = useState<string>('상대방'); // 상대 이름 저장
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
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        const memberId = payload.memberId;

        // 1. 위시리스트 추천
        const wishlistRes = await fetch(`${backendUrl}/recommend/wishlist`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (wishlistRes.ok) {
          const wishlistJson = await wishlistRes.json();
          const wishlistData = wishlistJson.recommended || [];

          // 상대방 닉네임 저장
          if (wishlistJson.partnerName) {
            setPartnerName(wishlistJson.partnerName);
          }

          const wishlistMapped: GiftItem[] = wishlistData.map((gift: any) => ({
            category: gift.subCategory || '',
            productName: gift.details || '',
            recommendation: '', // 설명은 없으므로 비워둠
          }));

          setWishlistGifts(wishlistMapped);
        }

        // 2. AI 추천
        const aiRes = await fetch(`${backendUrl}/gift/recommend-products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ memberId }),
        });

        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          if (aiJson.success) {
            // AI 추천 데이터
            const recommended = aiJson.data || [];

            // 요청 키워드 (예: "500일") - 필요에 따라 동적으로 설정 가능
            const requestedKeyword = aiJson.title?.trim() || '';

            // 추천 리스트 중 요청 키워드를 포함하는 항목이 있는지 체크
            const hasRequestedKeyword = recommended.some(
              (item: any) => item.keywords && Array.isArray(item.keywords) && item.keywords.includes(requestedKeyword)
            );

            // title 초기값
            let newTitle = aiJson.title && aiJson.title.trim() !== '' ? aiJson.title : '기념일';

            // 추천 데이터가 비어있거나 요청 키워드가 없는 경우 기본 '기념일'로 설정
            if (recommended.length === 0 || !hasRequestedKeyword) {
              newTitle = '기념일';
            }

            setTitle(newTitle);
            setRecommendedGifts(recommended);
          }
        }
      } catch (err: any) {
        setError(err.message || '데이터 로드 실패');
      } finally {
        setLoading(false);
      }
    }

    fetchGifts();
  }, []);

  if (loading) return <div>추천 선물 로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className='min-h-[calc(100vh-112px)] bg-[#F6F8FA] items-center'>
      <main className='w-full max-w-[412px] mx-auto flex flex-col gap-8 py-8 px-4 md:px-8'>
        {/* 상대방 위시리스트 추천 */}
        {wishlistGifts.length > 0 && (
          <PresentItem
            sectionTitle={`${partnerName}님의 위시리스트 기반 추천`}
            sectionSubtitle='관심 있는 카테고리 기반 추천입니다.'
            items={wishlistGifts.map((gift) => ({
              label: gift.category, // subCategory
              title: gift.productName, // details
              description: `${partnerName}님이 찜했어요!`,
            }))}
          />
        )}

        {/* AI 추천 */}
        {recommendedGifts.length > 0 && (
          <PresentItem
            sectionTitle={`${title} 관련 추천 선물입니다.`}
            sectionSubtitle=''
            items={recommendedGifts.map((gift) => ({
              label: gift.category,
              title: gift.productName,
              description: gift.recommendation,
            }))}
          />
        )}
      </main>
      {title && (
        <div className='text-center mb-4'>
          <a
            href={`https://www.coupang.com/np/search?q=${encodeURIComponent(title + ' 선물')}`}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-block px-4 py-2 bg-[#D1A6F5]/20 text-[#A569E5] text-sm rounded-full hover:bg-[#D1A6F5]/35 transition'
          >
            🔎 쿠팡에서 “{title} 선물” 더 보기
          </a>
        </div>
      )}
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
