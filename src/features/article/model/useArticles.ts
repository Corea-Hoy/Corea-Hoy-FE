import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { getLocalizedField, Locale } from '@/features/article/model/getLocalizedField';
import { getNewsDetail, toggleArticleLike } from '@/features/article/api/article.api';
import { toast } from 'sonner';
import { DetailRequest } from '@/entities/article';

export const useArticles = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);

  const locale = useLocale() as Locale;

  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const newsQuery = useQuery({
    queryKey: ['newsDetail', id],
    queryFn: () => getNewsDetail(id),
  });

  const newsLike = useMutation({
    mutationFn: toggleArticleLike,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['newsDetail', id] });

      const previousData = queryClient.getQueryData<DetailRequest>(['newsDetail', id]);

      queryClient.setQueryData<DetailRequest>(['newsDetail', id], (old) => {
        if (!old) return old;
        const isLiked = old._count.likes > 0;
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
      }
      toast.error('좋아요 처리에 실패했습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['newsDetail', id] });
    },
  });

  const like = (newsQuery.data?._count.likes ?? 0) > 0;
  const likeCount = newsQuery.data?._count.likes ?? 0;
  const title = getLocalizedField(newsQuery.data, 'title', locale);
  const body = getLocalizedField(newsQuery.data, 'body', locale);
  const note = getLocalizedField(newsQuery.data, 'culturalNote', locale);

  /**
   * 게시글 수정
   **/
  const onEdit = () => {
    console.log('데이터', newsQuery.data);
    console.log('내용', locale);
  };

  /**
   * 게시글 삭제
   **/
  const onDeletePost = () => {
    setShowDeletePostModal(true);
  };

  /**
   * 게시글 삭제 확인
   **/
  const onDeletePostModal = () => {
    console.log('삭제 모달');
  };

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
