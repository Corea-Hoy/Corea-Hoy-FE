import { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/app/providers';
import { IntlProvider } from '@/app/providers/IntlProvider';
import Footer from '@/widgets/footer/footer/Footer';
import { Header } from '@/widgets/header/index';
import { Toaster } from 'sonner';
import { GoogleScript, KakaoScript } from '@/shared/lib';

// ----------- Components -----------

export const metadata: Metadata = {
  title: 'corea hoy',
  description: '',
  icons: {
    icon: 'favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <IntlProvider>
        <body className="bg-white text-black min-h-screen flex flex-col">
          <Providers>
            <Header />
            <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 pb-20 lg:pb-0">
              <Suspense fallback={null}>{children}</Suspense>
            </main>
            <Footer />
          </Providers>
          <GoogleScript />
          <KakaoScript />
          <Toaster position="top-center" />
        </body>
      </IntlProvider>
    </html>
  );
}
