'use client';

import { GoogleLoginButton } from '@/features/auth';

const onGoogle = () => {};

export function LoginPage() {
  return (
    <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 pt-20">
      <div className="w-full max-w-sm mx-auto bg-white p-8">
        <div className="mx-auto mb-4 max-w-[6rem]">
          <img src="/images/logo/logo.svg" alt="corea hoy" />
        </div>

        <p className="text-center text-gray-500 text-sm mb-[4rem] leading-relaxed">
          요즘, 한국에는 무슨 일이 있을까?
          <br />
          로그인하고 소식을 더욱 빠르게 만나보세요
        </p>

        <form>
          <div className="relative">
            <GoogleLoginButton onClick={onGoogle} />
            <div className="absolute right-[-1rem] top-[-3.5rem] w-[5rem]">
              <img src="/images/characters/mascot-v.svg" alt="" />
            </div>
          </div>
          <p className="mt-5 text-[11px] leading-relaxed text-gray-400 text-center px-2">
            계속 진행하면 코레아 호이의 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
          </p>
        </form>
      </div>
    </div>
  );
}
