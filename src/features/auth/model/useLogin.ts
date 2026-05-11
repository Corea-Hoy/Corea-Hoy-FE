import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { googleLogin } from '@/features/auth/api/auth.api';
import { initGoogleAuth } from '@/shared/lib/google/googleAuth';
import { useUsersStore } from '@/entities/user';

export const useLogin = () => {
  const router = useRouter();
  const login = useUsersStore((state) => state.login);

  const { mutate, isPending } = useMutation({
    mutationFn: googleLogin,
    onSuccess: (res) => {
      login({
        id: res.data.user.id ?? 'id확인',
        email: res.data.user.email ?? 'email확인',
        name: res.data.user.nickname ?? 'name확인',
        role: res.data.user.role ?? 'role확인',
        image: res.data.user.avatarEmoji || res.data.user.image || undefined,
      });
      router.push('/');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  /**
   * 구글 로그인
   **/
  const onGoogleLogin = () => {
    if (isPending) return;

    if (!window.google?.accounts) {
      console.error('Google SDK not loaded');
      return;
    }

    initGoogleAuth((res) => {
      mutate({ id_token: res.credential });
    });

    window.google.accounts.id.prompt();
  };

  return { isPending, onGoogleLogin };
};
