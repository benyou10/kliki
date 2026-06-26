import { prisma } from '@/lib/prisma';
import { getInstances } from '@/lib/hypergraphApi';
import { buildOverviewDashboardData } from '@/lib/dashboardMetrics';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId')?.trim() || '';

  if (!clientId) {
    return Response.json({ error: 'Missing clientId.' }, { status: 400 });
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    return Response.json({ error: 'Account not found.' }, { status: 404 });
  }

  const workspaces = await prisma.workspace.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });

  const remoteInstances = await getInstances().catch(() => []);
  const remoteWorkspaceIds = new Set(remoteInstances.map((instance) => instance.id));
  const visibleWorkspaces = remoteInstances.length > 0
    ? workspaces.filter((workspace) => remoteWorkspaceIds.has(workspace.springBootInstanceId))
    : workspaces;

  const overview = await buildOverviewDashboardData(client, visibleWorkspaces);

  return Response.json(overview);
}
