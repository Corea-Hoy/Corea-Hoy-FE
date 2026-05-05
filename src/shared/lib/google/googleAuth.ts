import { ENV } from '@/shared/config/env';

export const initGoogleAuth = (callback: (res: { credential: string }) => void) => {
  window.google.accounts.id.initialize({
    client_id: ENV.GOOGLE_CLIENT_ID,
    callback,
  });
};
