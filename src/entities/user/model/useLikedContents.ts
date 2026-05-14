import { useQuery } from '@tanstack/react-query';
import { getLikedContentsApi } from '@/entities/user/api/user.api';
import { useUsersStore } from '@/entities/user';

export interface LikedArticle {
  id: string;
  titleKo: string;
  titleEs: string;
  thumbnailUrl?: string;
  category: { id: number; name: string; slug: string } | string;
  publishedAt: string;
}

export const useLikedContents = () => {
  const isLoggedIn = useUsersStore((state) => state.isLoggedIn);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['liked-contents'],
    queryFn: getLikedContentsApi,
    enabled: isLoggedIn, // 로그인 상태에서만 호출
    retry: false,
  });

  const likedContents: LikedArticle[] = data?.data?.articles ?? [];

  return { likedContents, isLoading, isError };
};
