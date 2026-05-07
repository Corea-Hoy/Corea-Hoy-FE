import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { googleLogin } from '@/features/auth/api/auth.api';
import { initGoogleAuth } from '@/shared/lib/google/googleAuth';
import { useUserStore } from '@/entities/user/model/user.store';

export const useLogin = () => {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  const { mutate, isPending } = useMutation({
    mutationFn: googleLogin,
    onSuccess: (res) => {
      login(res.data.user);
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
