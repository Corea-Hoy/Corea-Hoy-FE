'use client';

import { Suspense } from 'react';
import { HeaderInner } from './HeaderInner';

export function Header() {
  return (
    <Suspense fallback={null}>
      <HeaderInner />
    </Suspense>
  );
}
