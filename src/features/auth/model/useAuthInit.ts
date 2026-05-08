import { useUsersStore } from '@/entities/user';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/features/auth/api/auth.api';
import { useEffect } from 'react';

export const useAuthInit = () => {
  const login = useUsersStore((state) => state.login);
  const isLoggedIn = useUsersStore((state) => state.isLoggedIn);

  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
  });

  useEffect(() => {
    if (data?.data?.user && !isLoggedIn) {
      login({
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.nickname,
        role: data.data.user.role,
        image: data.data.user.avatarEmoji || data.data.user.image,
      });
    }
  }, [data, login, isLoggedIn]);
};
