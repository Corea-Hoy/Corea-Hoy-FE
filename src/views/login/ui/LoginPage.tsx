'use client';

import Image from 'next/image';
import { GoogleLoginButton } from '@/features/auth';
import { useLogin } from '@/features/auth/model/useLogin';
import { useUsersStore } from '@/entities/user';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function LoginPage() {
  const { onGoogleLogin, isPending } = useLogin();
  const { isLoggedIn } = useUsersStore();
  const router = useRouter();
  const t = useTranslations('login');

  useEffect(() => {
    if (isLoggedIn) router.replace('/');
  }, [isLoggedIn, router]);

  if (isLoggedIn) return null;

  return (
    <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 pt-20">
      <div className="w-full max-w-sm mx-auto bg-white p-8">
        <div className="mx-auto mb-4 max-w-[6rem]">
          <Image
            src="/images/logo/logo.svg"
            alt="corea hoy"
            width={96}
            height={96}
            className="w-full h-auto"
          />
        </div>

        <p className="text-center text-gray-500 text-sm mb-[4rem] leading-relaxed">
          {t('description')}
        </p>

        <form>
          <div className="relative">
            <GoogleLoginButton onClick={onGoogleLogin} disabled={isPending} />
            <div className="absolute right-[-1rem] top-[-3.5rem] w-[5rem]">
              <Image
                src="/images/characters/mascot-v.svg"
                alt=""
                width={80}
                height={80}
                className="w-full h-auto"
              />
            </div>
          </div>
          <p className="mt-5 text-[11px] leading-relaxed text-gray-400 text-center px-2">
            {t('loginAgreementText')}
          </p>
        </form>
      </div>
    </div>
  );
}
