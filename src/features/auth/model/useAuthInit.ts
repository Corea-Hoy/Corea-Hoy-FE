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
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.data?.user && !isLoggedIn) {
      login(data.data.user);
    }
  }, [data, login, isLoggedIn]);
};
