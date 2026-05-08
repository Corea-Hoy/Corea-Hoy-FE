import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { getLocalizedField, Locale } from '@/features/article/model/getLocalizedField';
import { getNewsDetail, toggleArticleLike } from '@/features/article/api/article.api';
import { toast } from 'sonner';
import { DetailRequest } from '@/entities/article';
import { useUsersStore } from '@/entities/user';

export const useArticles = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);

  const locale = useLocale() as Locale;

  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const likedContentIds = useUsersStore((state) => state.likedContentIds);
  const toggleLike = useUsersStore((state) => state.toggleLike);

  const newsQuery = useQuery({
    queryKey: ['newsDetail', id],
    queryFn: () => getNewsDetail(id),
  });

  const newsLike = useMutation({
    mutationFn: toggleArticleLike,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['newsDetail', id] });

      const previousData = queryClient.getQueryData<DetailRequest>(['newsDetail', id]);

      const isLiked = likedContentIds.includes(id);
      toggleLike(id);

      queryClient.setQueryData<DetailRequest>(['newsDetail', id], (old) => {
        if (!old) return old;
        return {
          ...old,
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
        toggleLike(id); // 롤백
      }
      toast.error('좋아요 처리에 실패했습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['newsDetail', id] });
    },
  });

  const like = likedContentIds.includes(id);
  const likeCount = newsQuery.data?._count.likes ?? 0;
  const title = getLocalizedField(newsQuery.data, 'title', locale);
  const body = getLocalizedField(newsQuery.data, 'body', locale);
  const note = getLocalizedField(newsQuery.data, 'culturalNote', locale);

  /**
   * 게시글 수정
   **/
  const onEdit = () => {};

  /**
   * 게시글 삭제
   **/
  const onDeletePost = () => {
    setShowDeletePostModal(true);
  };

  /**
   * 게시글 삭제 확인
   **/
  const onDeletePostModal = () => {};

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
    newsLike.mutate(id);
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
    showDeletePostModal,
    setShowShareModal,
    setShowDeletePostModal,
    onEdit,
    onDeletePostModal,
    onDeletePost,
    onShare,
    onShareModal,
    onLikeToggle,
  };
};
