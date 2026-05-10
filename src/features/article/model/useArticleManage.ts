import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteNewsDetail,
  getNewsDetail,
  updateNewsDetail,
} from '@/features/article/api/article.api';
import { toast } from 'sonner';
import { getLocalizedField, Locale } from '@/features/article/model/getLocalizedField';
import { useLocale, useTranslations } from 'next-intl';
import { articleKeys } from '@/features/article/model/queryKeys';

export const useArticleManage = () => {
  const route = useRouter();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const locale = useLocale() as Locale;
  const t = useTranslations('admin');

  /** 게시글 상세 조회 쿼리 */
  const newsQuery = useQuery({
    queryKey: articleKeys.detail(id),
    queryFn: () => getNewsDetail(id),
  });

  /** 게시글 수정 쿼리 */
  const newsUpdate = useMutation({
    mutationFn: updateNewsDetail,
    onSuccess: () => {},
    onError: () => {
      toast.error('');
    },
  });

  /** 게시글 삭제 쿼리 */
  const newsDelete = useMutation({
    mutationFn: deleteNewsDetail,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: articleKeys.detail(id) });
      queryClient.removeQueries({ queryKey: articleKeys.comments(id) });
      toast.success(t('deleteArticle'));
      route.push('/');
    },
    onError: () => {
      toast.error(t('deleteArticleError'));
    },
  });

  const serverTitle = getLocalizedField(newsQuery.data, 'title', locale) ?? '';
  const serverBody = getLocalizedField(newsQuery.data, 'body', locale) ?? '';

  const [titleOverride, setTitleOverride] = useState<string | null>(null);
  const [editOverride, setEditOverride] = useState<string | null>(null);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showEditExitModal, setShowEditExitModal] = useState(false);

  const titleValue = titleOverride ?? serverTitle;
  const editValue = editOverride ?? serverBody;

  /**
   * 게시글 수정
   * @param val
   **/
  const onTitleEdit = (val: string) => {
    setTitleOverride(val);
  };

  /**
   * 게시글 수정 화면으로 이동
   **/
  const onEdit = () => {
    route.push(`/article/${id}/edit`);
  };

  /**
   * 게시글 수정 에디터 수정
   * @param val
   **/
  const onContentEditChange = (val: string) => {
    setEditOverride(val);
  };

  /**
   * 게시글 수정 후 등록
   **/
  const onSubmitEdit = () => {};

  /**
   * 게시글 삭제 버튼: 확인 모달 열기
   **/
  const onDeletePost = () => {
    setShowDeletePostModal(true);
  };

  /**
   * 게시글 삭제 모달 확인: 실제 삭제 실행
   **/
  const onDeletePostModal = () => {
    newsDelete.mutate(id);
  };

  /**
   * 게시글 수정화면 이탈 시 모달 확인
   **/
  const onEditExitModal = () => {
    setShowEditExitModal(false);
  };

  return {
    data: newsQuery.data,
    titleValue,
    editValue,
    showDeletePostModal,
    setShowDeletePostModal,
    isLoading: newsDelete.isPending || newsUpdate.isPending,
    onTitleEdit,
    onContentEditChange,
    onEdit,
    onDeletePostModal,
    onDeletePost,
    showEditExitModal,
    setShowEditExitModal,
    onEditExitModal,
  };
};
