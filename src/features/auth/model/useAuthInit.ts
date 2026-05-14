import { useUsersStore } from '@/entities/user';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/features/auth/api/auth.api';
import { useEffect } from 'react';

export const useAuthInit = () => {
  const login = useUsersStore((state) => state.login);
  const updateProfile = useUsersStore((state) => state.updateProfile);
  const logout = useUsersStore((state) => state.logout);
  const isLoggedIn = useUsersStore((state) => state.isLoggedIn);

  const { data, isError } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: isLoggedIn,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // getMe 실패(세션 만료) → localStorage 상태 정리
    // 이후 다른 인증 API 호출이 enabled: false로 차단되어 강제 로그아웃 방지
    if (isError && isLoggedIn) {
      logout();
    }
  }, [isError, isLoggedIn, logout]);

  useEffect(() => {
    if (!data?.data?.user) return;

    if (!isLoggedIn) {
      // 첫 로그인 (자동 로그인)
      login({
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.nickname,
        role: data.data.user.role,
        image: data.data.user.avatarEmoji || data.data.user.image,
      });
    } else {
      // 이미 로그인 상태 → 프로필 업데이트 (invalidateQueries 이후 반영)
      updateProfile(data.data.user.nickname, data.data.user.avatarEmoji || data.data.user.image);
    }
  }, [data, login, updateProfile, isLoggedIn]);
};
