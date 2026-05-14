import { ENV } from '@/shared/config/env';

export const initGoogleAuth = (callback: (res: { credential: string }) => void) => {
  if (!window.google?.accounts?.id) {
    console.error('[initGoogleAuth] Google Identity Services SDK가 아직 로드되지 않았습니다.');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: ENV.GOOGLE_CLIENT_ID,
    callback,
    itp_support: true,
  });
};
