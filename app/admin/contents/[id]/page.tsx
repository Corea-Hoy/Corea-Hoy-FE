import { ContentDetailPage } from '@/views/content-management/ui/ContentDetailPage';

export default async function AdminContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ContentDetailPage contentId={id} />;
}
