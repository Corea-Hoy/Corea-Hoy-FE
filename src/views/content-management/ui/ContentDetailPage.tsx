'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ContentDetailPageProps {
  contentId: string;
}

export function ContentDetailPage({ contentId }: ContentDetailPageProps) {
  const router = useRouter();

  useEffect(() => {
    // 관리자용 편집 폼(두 번째 이미지) 제거 요구사항에 따라,
    // 실제 사용자가 보는 상세 페이지로 곧바로 리다이렉트합니다.
    router.replace(`/detail/${contentId}`);
  }, [contentId, router]);

  return null;
}
