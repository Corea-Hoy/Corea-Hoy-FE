import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '@/features/auth/api/auth.api';
import { useUsersStore } from '@/entities/user/model/user.store';

export const useLogout = () => {
  const router = useRouter();
  const storeLogout = useUsersStore((state) => state.logout);

  const queryClient = useQueryClient();

  const { mutate: onLogout, isPending } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.removeQueries({ queryKey: ['me'] });
      storeLogout();
      router.push('/login');
    },
  });

  return { onLogout, isPending };
};
