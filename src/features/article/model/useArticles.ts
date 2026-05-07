import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { getLocalizedField } from '@/features/article/model/getLocalizedField';
import { getNewsDetail } from '@/features/article/api/article.api';

export const useArticles = () => {
  const [like, setLike] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);

  const locale = useLocale();

  const { id } = useParams<{ id: string }>();

  const newsQuery = useQuery({
    queryKey: ['newsDetail', id],
    queryFn: () => getNewsDetail(id),
  });

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
   * 상세 뉴스 조회
   **/
  const onShareModal = () => {
    setShowShareModal(false);
  };

  /**
   * 상세 뉴스 조회
   **/
  const onLikeToggle = () => {
    setLike(!like);
  };

  return {
    title,
    body,
    note,
    newsData: newsQuery.data,
    newsIsLoading: newsQuery.isLoading,
    like,
    showShareModal,
    showDeletePostModal,
    setLike,
    setShowShareModal,
    setShowDeletePostModal,
    onEdit,
    onDeletePostModal,
    onDeletePost,
    onShareModal,
    onLikeToggle,
  };
};
