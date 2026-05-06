import { Suspense } from 'react';
import { AdminPipelinePage } from '@/views/admin-pipeline';

export default function Page() {
  return (
    <Suspense>
      <AdminPipelinePage />
    </Suspense>
  );
}
