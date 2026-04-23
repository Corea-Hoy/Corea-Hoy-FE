import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import './globals.css';
import Header from '@/widgets/header/ui/Header';
import { Providers } from '@/app/providers';
import Footer from '@/widgets/footer/footer/Footer';

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
      <NextIntlClientProvider>
        <body>
          <Header />
          <Providers>{children}</Providers>
          <Footer />
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
