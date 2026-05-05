import api from '@/shared/api';
import { GoogleLoginRequest } from '@/entities/user/model/types';

/**
 * 구글 로그인 요청
 * @param id
 **/
export const googleLogin = (id: GoogleLoginRequest) => {
  return api.post('/api/auth/google', id);
};
