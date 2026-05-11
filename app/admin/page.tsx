export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import { AdminPipelinePage } from '@/views/admin-pipeline/ui/AdminPipelinePage';

export default function Page() {
  return (
    <Suspense>
      <AdminPipelinePage />
    </Suspense>
  );
}
