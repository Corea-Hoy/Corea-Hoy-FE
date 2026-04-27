import type { Metadata } from 'next';
import './globals.css';
import Header from '@/widgets/header/ui/Header';
import { Providers } from '@/app/providers';
import { IntlProvider } from '@/app/providers/IntlProvider';
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
      <IntlProvider>
        <body className="bg-white text-black min-h-screen">
          <Header />
          <Providers>{children}</Providers>
          <Footer />
        </body>
      </IntlProvider>
    </html>
  );
}
