import { unstable_cache } from 'next/cache';
import { Article, GetArticlesResponse } from '@/entities/content/model/articles';
import { GetArticlesParams } from './articles.api';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

/**
 * 백엔드가 콜드 스타트 중이면 20초 이상 걸린다. 그만큼 렌더가 밀리면 프리페치가
 * 오히려 손해이므로 타임아웃 후 예외를 던진다. 호출부(app/page.tsx)는 이 실패를
 * 무시하고 기존처럼 클라이언트 페치로 넘어간다.
 *
 * 값 근거: 목록 응답은 단일 요청이면 1.6~2.0초지만, app/page.tsx가 popular/latest를
 * Promise.all로 동시에 쏘면 서로 경합해 3~4초까지 늘어난다. 3초로 두면 정상 응답이
 * 전부 잘려 백그라운드 재검증이 매번 실패하고 캐시가 stale로 고착된다.
 * 콜드 스타트(약 26초)는 여전히 여기서 끊긴다.
 */
const PREFETCH_TIMEOUT_MS = 8000;

/** 캐시 수명. 뉴스 목록이라 1분이면 신선도와 속도의 균형이 맞는다. */
const CACHE_TTL_SECONDS = 60;

/**
 * 서버 컴포넌트에서 기사 목록을 직접 가져온다.
 *
 * 브라우저는 next.config.ts의 rewrites()로 `/api/...`(상대 경로)를 쓰지만,
 * 서버에는 상대 경로를 해석할 오리진이 없으므로 백엔드를 직접 호출한다.
 */
async function fetchArticles(params: GetArticlesParams): Promise<Article[]> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) search.set(key, String(value));
  }

  const res = await fetch(`${API_URL}/api/articles?${search.toString()}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(PREFETCH_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`fetchArticles failed: ${res.status}`);
  }

  const json = (await res.json()) as GetArticlesResponse;
  return json.data.articles;
}

/**
 * 백엔드(Render, DB는 시드니 리전)가 목록 하나에 1.5~1.7초를 쓴다. 매 요청마다
 * 그 값을 치르면 서버 렌더가 그만큼 밀리므로 결과를 60초간 캐싱한다.
 *
 * 주의: 응답의 isLiked는 사용자별 값이다. 서버 페치는 쿠키를 보내지 않아 항상
 * false로 내려오고 목록 UI(ContentCard/HotNewsCarousel)도 이 필드를 쓰지 않으므로
 * 공유 캐시에 담아도 안전하다. 나중에 목록에서 isLiked를 쓰게 되면 이 캐시를
 * 반드시 사용자별로 분리하거나 제거해야 한다.
 *
 * unstable_cache는 Next 16에서 `use cache`로 대체 예고된 API다. cacheComponents를
 * 켜면 마이그레이션해야 한다.
 */
export const getArticlesOnServer = unstable_cache(fetchArticles, ['articles-list'], {
  revalidate: CACHE_TTL_SECONDS,
  tags: ['articles'],
});
