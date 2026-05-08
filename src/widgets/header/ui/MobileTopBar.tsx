'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
// import { useUserStore } from '@/entities/user';
import { useUsersStore } from '@/entities/user';

interface MobileTopBarProps {
  isKo: boolean;
}

const MobileTopBar = ({ isKo }: MobileTopBarProps) => {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { isLoggedIn } = useUsersStore();

  const bottomTabs = [
    { href: '/', label: t('home'), icon: '🏠' },
    { href: '/feedback', label: t('feedback'), icon: '💬' },
    {
      href: isLoggedIn ? '/mypage' : '/login',
      label: isLoggedIn ? t('mypage') : t('login'),
      icon: '👤',
    },
  ];

  return (
    <nav
      aria-label={isKo ? '주요 메뉴' : 'Menú principal'}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-100/50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center justify-around h-16 pb-safe">
        {bottomTabs.map(({ href, label, icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center gap-1 flex-1 py-2 min-w-0 transition-all active:scale-95"
            >
              <span
                className={`text-xl transition-all duration-300 ${isActive ? 'scale-110 opacity-100' : 'opacity-30 grayscale'}`}
                aria-hidden="true"
              >
                {icon}
              </span>
              <span
                className={`text-[10px] font-bold truncate max-w-full px-1 transition-colors ${isActive ? 'text-black' : 'text-gray-400'}`}
              >
                {label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-black rounded-full mt-0.5 animate-in zoom-in duration-300" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTopBar;
