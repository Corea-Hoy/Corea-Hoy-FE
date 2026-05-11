import { useUsersStore } from '@/entities/user';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/features/auth/api/auth.api';
import { useEffect } from 'react';

export const useAuthInit = () => {
  const login = useUsersStore((state) => state.login);
  const updateProfile = useUsersStore((state) => state.updateProfile);
  const isLoggedIn = useUsersStore((state) => state.isLoggedIn);

  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });

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
