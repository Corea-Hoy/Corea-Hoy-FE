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
    if (isError && isLoggedIn) {
      logout();
    }
  }, [isError, isLoggedIn, logout]);

  useEffect(() => {
    if (!data?.data?.user) return;

    if (!isLoggedIn) {
      login({
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.nickname,
        role: data.data.user.role,
        image: data.data.user.avatarEmoji || data.data.user.image,
      });
    } else {
      updateProfile(data.data.user.nickname, data.data.user.avatarEmoji || data.data.user.image);
    }
  }, [data, login, updateProfile, isLoggedIn]);
};
