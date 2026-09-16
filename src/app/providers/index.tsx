'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthInitializer } from './AuthInitializer';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // staleTime이 0이면 서버에서 프리페치해 내려준 데이터도 하이드레이션 직후
            // 곧바로 stale로 간주되어 다시 요청한다. 그러면 프리페치 이득이 사라진다.
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      {children}
    </QueryClientProvider>
  );
}
