import api from '@/shared/api';
import { DetailRequest } from '@/entities/article';

/**
 * 상세 뉴스 조회
 * @param id
 **/
export const getNewsDetail = (id: string) => {
  return api.get<{ data: DetailRequest }>(`/api/articles/${id}`).then((res) => res.data.data);
};

/**
 * 게시글 수정
 * @param id
 **/
// export const updateNewsDetail = (id: string) => {
//   return api.get<DetailRequest>(`/api/articles/${id}`).then((res) => res.data.data);
// };

/**
 * 게시글 삭제
 * @param id
 **/
// export const deleteNewsDetail = (id: string) => {
//   return api.get<DetailRequest>(`/api/articles/${id}`).then((res) => res.data.data);
// };

/**
 * 좋아요 추가
 * @param id
 **/
// export const toggleArticleLike = (id: string) => {
//   return api.post<>(`/api/articles/${id}/like`).then((res) => res.data.data);
// };
