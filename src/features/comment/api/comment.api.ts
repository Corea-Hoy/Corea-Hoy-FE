import api from '@/shared/api';
import { CommentsRequest, CommentsResponse } from '@/entities/comment/model/types';

/**
 * 댓글 조회
 * @param id
 **/
export const getCommentsList = (id: string) => {
  return api.get<{ data: CommentsResponse[] }>(`/api/articles/${id}/comments`).then((res) => res.data.data);
};

/**
 * 댓글 추가
 * @param id
 * @param body 댓글 내용
 **/
export const createComment = ({ id, body }: CommentsRequest) => {
  return api.post(`/api/articles/${id}/comments`, { body }).then((res) => res.data.data);
};

/**
 * 댓글 수정
 * @param id
 * @param body 댓글 내용
 **/
export const updateComment = ({ id, body }: CommentsRequest) => {
  return api.put(`/api/comments/${id}`, { body }).then((res) => res.data.data);
};

/**
 * 댓글 삭제
 * @param id
 **/
export const deleteComment = (id: string) => {
  return api.delete(`/api/comments/${id}`).then((res) => res.data.data);
};
