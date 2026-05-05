import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { googleLogin } from '@/features/auth/api/auth.api';
import { initGoogleAuth } from '@/shared/lib/google/googleAuth';

export const useLogin = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: googleLogin,
    onSuccess: (res) => {},
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
