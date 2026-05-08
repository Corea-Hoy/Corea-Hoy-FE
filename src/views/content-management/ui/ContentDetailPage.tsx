'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ContentDetailPageProps {
  contentId: string;
}

export function ContentDetailPage({ contentId }: ContentDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 실제 사용자가 보는 상세 페이지로 곧바로 리다이렉트
    const query = searchParams.toString();
    router.replace(`/article/${contentId}${query ? `?${query}` : ''}`);
  }, [contentId, router, searchParams]);

  return null;
}
