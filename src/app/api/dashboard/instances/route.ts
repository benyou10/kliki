import { prisma } from '@/lib/prisma';
import { createInstance as createRemoteInstance } from '@/lib/hypergraphApi';
import { buildInstanceDashboardData, fetchInstanceLive, maskApiKey } from '@/lib/dashboardMetrics';

function createApiKey() {
  return `gr_live_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`;
}

function createInstanceId() {
  return `inst_${crypto.randomUUID().replace(/-/g, '').slice(0, 18)}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const subscriptionTier = typeof body?.subscriptionTier === 'string' ? body.subscriptionTier.trim() : 'Bronze';
  const platformType = typeof body?.platformType === 'string' ? body.platformType.trim() : '';
  const domains = typeof body?.domains === 'string'
    ? body.domains.trim()
    : typeof body?.websiteUrl === 'string'
      ? body.websiteUrl.trim()
      : '';
  const clientId = typeof body?.clientId === 'string' ? body.clientId.trim() : '';

  if (!name) {
    return new Response(JSON.stringify({ error: 'Instance name is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!clientId) {
    return new Response(JSON.stringify({ error: 'You must be signed in to create a workspace.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    return new Response(JSON.stringify({ error: 'Account not found. Please sign in again.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let instanceId = createInstanceId();
  let endpointUrl = `${process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://138.68.90.21:8080'}/api/v1/instances/${instanceId}/inject`;

  try {
    const remoteInstance = await createRemoteInstance({
      instanceName: name,
      subscriptionTier,
      algorithmicType: 'walker-hypergraph',
      configuration: {
        platformType: platformType || 'ecommerce',
        domains: domains ? domains.split(',').map((domain: string) => domain.trim()).filter(Boolean) : [],
        source: 'gorecommend-web',
      },
    });
    instanceId = remoteInstance.instanceId;
    endpointUrl = remoteInstance.endpointUrl;
  } catch (error) {
    console.warn('Falling back to a local instance id because the remote recommendation service could not be reached.', error);
  }

  const workspace = await prisma.workspace.create({
    data: {
      name,
      subscriptionTier,
      platformType,
      domains,
      springBootInstanceId: instanceId,
      apiKey: createApiKey(),
      clientId: client.id,
    },
  });

  return new Response(JSON.stringify({
    id: workspace.id,
    instanceId: workspace.springBootInstanceId,
    endpointUrl,
    apiKey: workspace.apiKey,
    integrationCode: `<script src="https://api.hypergraph.ai/widget.js" data-api-key="${workspace.apiKey}"></script>`,
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId')?.trim() || '';
  const workspaceId = searchParams.get('workspaceId')?.trim() || '';

  if (!clientId) {
    return Response.json({ error: 'Missing clientId.' }, { status: 400 });
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    return Response.json({ error: 'Account not found.' }, { status: 404 });
  }

  if (workspaceId) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        clientId,
      },
    });

    if (!workspace) {
      return Response.json({ error: 'Instance not found.' }, { status: 404 });
    }

    const data = await buildInstanceDashboardData(workspace);

    return Response.json({
      client: {
        id: client.id,
        fullName: client.fullName,
        companyName: client.companyName,
        email: client.email,
      },
      workspace: {
        ...data.workspace,
        apiKey: workspace.apiKey,
      },
      apiKeyPreview: maskApiKey(workspace.apiKey),
      integrationCode: `<script src="https://api.hypergraph.ai/widget.js" data-api-key="${workspace.apiKey}"></script>`,
      endpointUrl: `${process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://138.68.90.21:8080'}/api/v1/instances/${workspace.springBootInstanceId}/inject`,
      metrics: data.metrics,
      topProducts: data.topProducts,
      engineReachable: data.engineReachable,
    });
  }

  const workspaces = await prisma.workspace.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  });

  // Real usage (events processed) for each store, pulled from the engine in parallel.
  const liveList = await Promise.all(workspaces.map((workspace) => fetchInstanceLive(workspace.springBootInstanceId)));

  const workspaceEntries = workspaces.map((workspace, index) => ({
    id: workspace.id,
    name: workspace.name,
    apiKey: workspace.apiKey,
    apiKeyPreview: maskApiKey(workspace.apiKey),
    springBootInstanceId: workspace.springBootInstanceId,
    subscriptionTier: workspace.subscriptionTier,
    status: workspace.status,
    createdAt: workspace.createdAt.toISOString(),
    monthlyUsage: liveList[index].events,
  }));

  return Response.json({
    client: {
      id: client.id,
      fullName: client.fullName,
      companyName: client.companyName,
      email: client.email,
    },
    workspaces: workspaceEntries,
    summary: {
      total: workspaces.length,
      active: workspaces.filter((workspace) => workspace.status === 'active').length,
      inactive: workspaces.filter((workspace) => workspace.status !== 'active').length,
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId')?.trim() || '';
  const workspaceId = searchParams.get('workspaceId')?.trim() || '';

  if (!clientId || !workspaceId) {
    return Response.json({ error: 'Missing clientId or workspaceId.' }, { status: 400 });
  }

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      clientId,
    },
  });

  if (!workspace) {
    return Response.json({ error: 'Instance not found.' }, { status: 404 });
  }

  await prisma.workspace.delete({
    where: { id: workspace.id },
  });

  return Response.json({ ok: true });
}
