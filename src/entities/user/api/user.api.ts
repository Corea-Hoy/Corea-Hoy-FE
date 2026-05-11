import api from '@/shared/api';

export interface UpdateProfileRequest {
  nickname: string;
  avatarEmoji: string;
  avatarColor: string;
}

/** 프로필 업데이트 [PUT] */
export const updateProfileApi = (data: UpdateProfileRequest) => {
  return api.put('/api/users/me', data);
};

/** 계정 탈퇴 [DELETE] */
export const deleteAccountApi = () => {
  return api.delete('/api/users/me');
};

/** 좋아요한 콘텐츠 목록 조회 [GET] */
export const getLikedContentsApi = () => {
  return api.get('/api/users/me/likes');
};
