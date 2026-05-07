import api from '@/shared/api';
import { GoogleLoginRequest } from '@/entities/user/model/types';

/**
 * 구글 로그인 요청
 **/
export const googleLogin = (id: GoogleLoginRequest) => {
  return api.post('/api/auth/google', id);
};

/**
 * 로그아웃 요청
 **/
export const logout = () => {
  return api.post('/api/auth/logout');
};

/**
 * 토큰 확인
 **/
export const getMe = () => {
  return api.get('/api/auth/me');
};
