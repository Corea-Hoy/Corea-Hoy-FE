import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
  images: {
    // 썸네일 출처 허용 목록.
    // 여기 없는 호스트는 /_next/image가 400을 반환하므로, 백엔드에 새 뉴스 소스가
    // 추가되면 이 목록에도 반드시 도메인을 추가해야 한다.
    // (누락 시 ContentCard/HotNewsCarousel은 onError로 마스코트 이미지를 대신 노출)
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/**' }, // 유튜브 썸네일
      { protocol: 'https', hostname: 'img.yna.co.kr', pathname: '/**' }, // 연합뉴스
      { protocol: 'https', hostname: 'img.sbs.co.kr', pathname: '/**' }, // SBS
      { protocol: 'https', hostname: 'pimg.mk.co.kr', pathname: '/**' }, // 매일경제
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' }, // 구글 프로필
    ],
    // 최적화된 이미지의 캐시 수명. 기본값 4시간이라 같은 썸네일을 하루에도 몇 번씩
    // 원본 fetch + 재인코딩하게 된다. 뉴스 썸네일 URL은 사실상 불변이므로 31일로 연장.
    minimumCacheTTL: 2678400,
    // 원본이 5MB를 넘으면 최적화를 포기(에러)한다. 뉴스 썸네일은 보통 1MB 미만이라
    // 메모리 보호 목적으로 상한을 낮춘다.
    maximumResponseBody: 5_000_000,
    // 기본값과 동일하지만 의도를 명시. AVIF는 20% 더 작지만 인코딩이 50% 느려
    // 캐시 미스일 때 첫 응답이 오히려 느려지므로 WebP만 사용한다.
    formats: ['image/webp'],
  },
};

export default withNextIntl(nextConfig);
