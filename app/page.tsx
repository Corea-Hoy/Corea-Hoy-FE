import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { HomePage } from '@/views/home/ui/HomePage';
import { getArticlesOnServer } from '@/views/home/api/articles.server';

export const dynamic = 'force-dynamic';

/**
 * useArticlesQuery(...)가 만드는 queryKey와 정확히 동일해야 하이드레이션이 연결된다.
 * HomePage의 상단 두 쿼리:
 *   useArticlesQuery({ sort: 'popular', limit: 6 })  → 핫뉴스 캐러셀
 *   useArticlesQuery({ sort: 'latest',  limit: 4 })  → 최신 뉴스 카드 4장
 */
const POPULAR_PARAMS = { sort: 'popular', limit: 6 };
const LATEST_PARAMS = { sort: 'latest', limit: 4 };

export default async function Page() {
  // retry: false — 프리페치 실패 시 재시도하며 TTFB를 끌지 않도록.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  // 첫 화면(above the fold)에 보이는 두 블록만 서버에서 미리 받아 초기 HTML에 담는다.
  // 카테고리별 섹션 6개는 스크롤 아래라 LCP 경로 밖이므로 기존대로 클라이언트에서 가져온다.
  //
  // Promise.all로 동시에 쏴서 서버 대기 시간이 두 배가 되지 않게 한다.
  // prefetchQuery는 실패를 내부에서 삼키고 dehydrate는 성공한 쿼리만 직렬화하므로,
  // 백엔드가 느리거나 죽어 있으면 아무것도 실려가지 않고 기존 동작으로 되돌아간다.
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['articles', POPULAR_PARAMS],
      queryFn: () => getArticlesOnServer(POPULAR_PARAMS),
    }),
    queryClient.prefetchQuery({
      queryKey: ['articles', LATEST_PARAMS],
      queryFn: () => getArticlesOnServer(LATEST_PARAMS),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePage />
    </HydrationBoundary>
  );
}
