import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  createComment,
  deleteComment,
  getCommentsList,
  updateComment,
} from '@/features/comment/api/comment.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useComments = () => {
  const [textarea, setTextarea] = useState('');
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const commentQuery = useQuery({
    queryKey: ['newsComments', id],
    queryFn: () => getCommentsList(id),
  });

  const commentEdit = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsComments', id] });
    },
    onError: () => {
      toast.error('댓글 등록에 실패했습니다.');
    },
  });

  const commentUpdate = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsComments', id] });
      setEditCommentId(null);
    },
    onError: () => {
      toast.error('댓글 수정을 실패했습니다.');
    },
  });

  const commentDelete = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsComments', id] });
    },
    onError: () => {
      toast.error('댓글 삭제를 실패했습니다.');
    },
  });

  /**
   * 새로운 댓글 추가
   *
   **/
  const onCreateComment = (body: string) => {
    if (body.trim().length < 10) return;

    commentEdit.mutate({ id, body });
    setTextarea('');
  };

  /**
   * 댓글 수정 버튼 클릭 시 edit input 활성화
   * @param id
   **/
  const onEditComment = (id: string) => {
    setEditCommentId(id);
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

  return {
    commentsData: commentQuery.data ?? [],
    commentsIsLoading: commentQuery.isLoading,
    textarea,
    setTextarea,
    showDeleteCommentModal,
    editCommentId,
    setShowDeleteCommentModal,
    setEditCommentId,
    onCreateComment,
    onEditComment,
    onDeleteComment,
    onDeleteCommentModal,
    onCloseDeleteCommentModal,
    onUpdateComment,
  };
};
