import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/features/auth/api/auth.api';
import { useUsersStore } from '@/entities/user/model/user.store';

export const useLogout = () => {
  const router = useRouter();
  const storeLogout = useUsersStore((state) => state.logout);

  const { mutate: onLogout, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      storeLogout();
      router.push('/login');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });

  return { onLogout, isPending };
};
