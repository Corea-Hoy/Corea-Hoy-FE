import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { getLocalizedField, Locale } from '@/features/article/model/getLocalizedField';
import { getNewsDetail, toggleArticleLike } from '@/features/article/api/article.api';
import { toast } from 'sonner';
import { ArticleRequest } from '@/entities/article';
import { useUsersStore } from '@/entities/user';

export const useArticles = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const locale = useLocale() as Locale;

  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { isLoggedIn } = useUsersStore();

  const route = useRouter();

  const newsQuery = useQuery({
    queryKey: ['newsDetail', id],
    queryFn: () => getNewsDetail(id),
  });

  const newsLike = useMutation({
    mutationFn: toggleArticleLike,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['newsDetail', id] });

      const previousData = queryClient.getQueryData<ArticleRequest>(['newsDetail', id]);

      const isLiked = previousData?.isLiked ?? false;

      queryClient.setQueryData<ArticleRequest>(['newsDetail', id], (old) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: !isLiked,
          _count: {
            ...old._count,
            likes: isLiked ? old._count.likes - 1 : old._count.likes + 1,
          },
        };
      });

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context) {
        queryClient.setQueryData(['newsDetail', id], context.previousData);
      }
      toast.error('좋아요 처리에 실패했습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['newsDetail', id] });
    },
  });

  const like = newsQuery.data?.isLiked ?? false;
  const likeCount = newsQuery.data?._count.likes ?? 0;
  const title = getLocalizedField(newsQuery.data, 'title', locale);
  const body = getLocalizedField(newsQuery.data, 'body', locale);
  const note = getLocalizedField(newsQuery.data, 'culturalNote', locale);

  /**
   *
   **/
  const onShare = () => {
    setShowShareModal(true);
  };

  /**
   * 공유하기 링크 카피 모달
   **/
  const onShareModal = () => {
    setShowShareModal(false);
  };

  /**
   * 좋아요
   **/
  const onLikeToggle = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    newsLike.mutate(id);
  };

  /**
   * 비로그인 상태로 좋아요를 클릭했을 시 로그인 화면으로 이동
   **/
  const onLikeWithoutLogin = () => {
    route.push('/login');
  };

  return {
    title,
    body,
    note,
    newsData: newsQuery.data,
    newsIsLoading: newsQuery.isLoading,
    like,
    likeCount,
    showShareModal,
    showLoginModal,
    setShowLoginModal,
    setShowShareModal,
    onShare,
    onShareModal,
    onLikeToggle,
    onLikeWithoutLogin,
  };
};
