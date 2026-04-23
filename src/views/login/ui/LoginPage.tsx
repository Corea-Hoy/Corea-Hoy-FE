import { authApi } from '@/src/features/auth';

export function LoginPage() {
  return (
    <main>
      <button onClick={authApi.kakaoLogin}>카카오로 로그인</button>
      <button onClick={authApi.googleLogin}>구글로 로그인</button>
    </main>
  );
}
