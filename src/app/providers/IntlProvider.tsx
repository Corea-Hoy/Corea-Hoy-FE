'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useSyncExternalStore } from 'react';
import { useLanguageStore } from '@/shared/model';
import koMessages from '../../../message/ko.json';
import esMessages from '../../../message/es.json';

const emptySubscribe = () => () => {};

export function IntlProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguageStore();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const locale = isClient ? language : 'ko';
  const messages = locale === 'ko' ? koMessages : esMessages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
