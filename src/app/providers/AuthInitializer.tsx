'use client';

import { useAuthInit } from '@/features/auth';

export const AuthInitializer = () => {
  useAuthInit();
  return null;
};
