import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import WorkspaceDetailsClient from '../WorkspaceDetailsClient';

export const dynamic = 'force-dynamic';

export default async function WorkspaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    notFound();
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id },
  });

  if (!workspace) {
    notFound();
  }

  return (
    <WorkspaceDetailsClient
      workspace={{
        id: workspace.id,
        name: workspace.name,
        apiKey: workspace.apiKey,
        springBootInstanceId: workspace.springBootInstanceId,
        subscriptionTier: workspace.subscriptionTier ?? undefined,
        platformType: workspace.platformType ?? undefined,
        domains: workspace.domains ?? undefined,
        createdAt: workspace.createdAt.toISOString(),
        updatedAt: workspace.updatedAt.toISOString(),
      }}
    />
  );
}
