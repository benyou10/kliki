import { prisma } from '@/lib/prisma';
import { createInstance as createRemoteInstance } from '@/lib/hypergraphApi';

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
  const domains = typeof body?.domains === 'string' ? body.domains.trim() : '';

  if (!name) {
    return new Response(JSON.stringify({ error: 'Instance name is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const client = await prisma.client.findFirst();
  if (!client) {
    return new Response(JSON.stringify({ error: 'No account exists yet. Sign up first.' }), {
      status: 400,
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
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
