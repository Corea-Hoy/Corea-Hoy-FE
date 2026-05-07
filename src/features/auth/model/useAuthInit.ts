import { useUserStore } from '@/entities/user';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/features/auth/api/auth.api';
import { useEffect } from 'react';

export const useAuthInit = () => {
  const login = useUserStore((state) => state.login);

  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
  });

  console.log(data);

  useEffect(() => {
    if (data?.data?.user) {
      login(data.data.user);
    }
  }, [data]);
};
