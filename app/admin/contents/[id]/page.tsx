export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import { ContentDetailPage } from '@/views/content-management/ui/ContentDetailPage';

export default async function AdminContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={null}>
      <ContentDetailPage contentId={id} />
    </Suspense>
  );
}
