import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  createComment,
  deleteComment,
  getCommentsList,
  updateComment,
} from '@/features/comment/api/comment.api';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { articleKeys } from '@/features/article/model/queryKeys';
import { useTranslations } from 'next-intl';

export const useComments = () => {
  const [textarea, setTextarea] = useState('');
  const [editTextarea, setEditTextarea] = useState('');
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const t = useTranslations();

  const commentQuery = useInfiniteQuery({
    queryKey: articleKeys.comments(id),
    queryFn: ({ pageParam }) => getCommentsList({ id, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const commentEdit = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.comments(id) });
    },
    onError: () => {
      toast.error(t('comment.commentError'));
    },
  });

  const commentUpdate = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.comments(id) });
      setEditCommentId(null);
    },
    onError: () => {
      toast.error(t('comment.commentEditError'));
    },
  });

  const commentDelete = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.comments(id) });
    },
    onError: () => {
      toast.error(t('comment.commentDeleteError'));
    },
  });

  /**
   * 새로운 댓글 추가
   * @param body
   **/
  const onCreateComment = (body: string) => {
    if (body.trim().length < 10) return;

    commentEdit.mutate({ id, body });
    setTextarea('');
  };

  /**
   * 댓글 수정 버튼 클릭 시 edit input 활성화
   * @param id
   * @param body
   **/
  const onEditComment = (id: string, body: string) => {
    setEditCommentId(id);
    setEditTextarea(body);
  };

  /**
   * 댓글 수정 완료 후 변경된 댓글 반영
   * @param body 댓글 수정 내용
   **/
  const onUpdateComment = (body: string) => {
    if (!editCommentId) return;
    commentUpdate.mutate({ id: editCommentId, body });
  };

  /**
   * 댓글 삭제 버튼 클릭 시 확인 모달 활성화
   * @param id
   **/
  const onDeleteComment = (id: string) => {
    setDeleteCommentId(id);
    setShowDeleteCommentModal(true);
  };

  /**
   * 댓글 삭제 모달 활성화 후 삭제
   **/
  const onDeleteCommentModal = () => {
    if (!deleteCommentId) return;
    commentDelete.mutate(deleteCommentId);
    setDeleteCommentId(null);
    setShowDeleteCommentModal(false);
  };

  /**
   * 댓글 삭제 모달 취소
   **/
  const onCloseDeleteCommentModal = () => {
    setDeleteCommentId(null);
    setShowDeleteCommentModal(false);
  };

  /**
   * 댓글 더보기
   **/
  const onMoreComment = () => {
    if (commentQuery.hasNextPage && !commentQuery.isFetchingNextPage) {
      commentQuery.fetchNextPage();
    }
  };

  return {
    commentsData: commentQuery.data?.pages.flatMap((page) => page.data) ?? [],
    commentsIsLoading: commentQuery.isLoading,
    hasNextPage: commentQuery.hasNextPage,
    textarea,
    setTextarea,
    showDeleteCommentModal,
    editCommentId,
    editTextarea,
    setEditTextarea,
    setShowDeleteCommentModal,
    setEditCommentId,
    onCreateComment,
    onEditComment,
    onDeleteComment,
    onDeleteCommentModal,
    onCloseDeleteCommentModal,
    onUpdateComment,
    onMoreComment,
  };
};
