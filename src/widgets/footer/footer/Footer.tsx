'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  const navLinks = [
    { href: '/labs', label: t('labs') },
    { href: '/feedback', label: t('feedback') },
    { href: '/privacy', label: t('privacy') },
  ];

  return (
    <footer className="mt-20 border-t border-gray-100 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10">
          {/* Brand & Description */}
          <div className="max-w-sm">
            <Link href="/" className="inline-block mb-4 hover:opacity-70 transition-opacity">
              <Image
                src="/logo.png"
                alt="Corea Hoy"
                width={110}
                height={44}
                style={{ objectFit: 'contain' }}
              />
            </Link>
            <p className="text-sm font-semibold text-gray-700 mb-2">{t('tagline')}</p>
            <p className="text-xs text-gray-400 leading-relaxed">{t('desc')}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs text-amber-600 font-semibold">{t('demo')}</span>
            </div>
          </div>

          {/* Nav links */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {t('nav')}
            </p>
            <ul className="flex flex-col gap-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-black transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                {t('contact')}
              </p>
              <a
                href={`mailto:${t('email')}`}
                className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                {t('email')}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>
            © {year} Corea Hoy. {t('rights')}
          </span>
          <span className="hidden sm:inline">·</span>
          <span>Made with ❤️ for Latin America</span>
        </div>
      </div>
    </footer>
  );
}
