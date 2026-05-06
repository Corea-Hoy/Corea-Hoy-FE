import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getNewsDetail } from '@/features/detail/api/detail.api';
import { useLocale } from 'next-intl';
import { getLocalizedField } from '@/features/detail/model/getLocalizedField';

export const useDetails = () => {
  const [like, setLike] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);

  const locale = useLocale();

  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['newsDetail', id],
    queryFn: () => getNewsDetail(id),
  });

  const title = getLocalizedField(data, 'title', locale);
  const body = getLocalizedField(data, 'body', locale);
  const note = getLocalizedField(data, 'culturalNote', locale);

  /**
   * 게시글 수정
   **/
  const onEdit = () => {
    console.log('데이터', data);
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
    data,
    isLoading,
    error,
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
