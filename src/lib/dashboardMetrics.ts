import type { Client, Workspace } from '@/generated/prisma/client';
import { getInstanceAnalytics, getInstanceStatus, getTrending } from '@/lib/hypergraphApi';

export type DashboardChartPoint = {
  label: string;
  recommendations: number;
  clicks: number;
};

export type DashboardActivityItem = {
  title: string;
  detail: string;
  tone: 'success' | 'info' | 'warning';
};

/**
 * Real per-instance metrics pulled from the restapi recommendation engine.
 * Counts (products/users/events/uptime) are tracked live by the engine; the
 * rate/revenue figures come from the engine's analytics endpoint.
 */
export type LiveMetrics = {
  products: number;
  users: number;
  events: number;
  clicks: number;
  avgResponseTime: number;
  ctr: number; // percentage
  conversions: number;
  revenue: number;
  uptime: number; // percentage
  latency: number;
  errorRate: number; // percentage
  queuedEvents: number;
  health: string;
  reachable: boolean;
};

const ZERO_LIVE: LiveMetrics = {
  products: 0,
  users: 0,
  events: 0,
  clicks: 0,
  avgResponseTime: 0,
  ctr: 0,
  conversions: 0,
  revenue: 0,
  uptime: 0,
  latency: 0,
  errorRate: 0,
  queuedEvents: 0,
  health: 'unknown',
  reachable: false,
};

export type OverviewDashboardData = {
  client: { id: string; fullName: string; companyName: string; email: string };
  metrics: {
    totalEvents: number;
    totalProducts: number;
    totalUsers: number;
    totalClicks: number;
    ctr: number;
    conversions: number;
    revenue: number;
    totalInstances: number;
    activeInstances: number;
  };
  chart: DashboardChartPoint[];
  activity: DashboardActivityItem[];
  engineReachable: boolean;
  recentInstances: Array<{
    id: string;
    name: string;
    subscriptionTier: string;
    instanceType: string;
    status: string;
    springBootInstanceId: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type InstanceDashboardData = {
  workspace: {
    id: string;
    name: string;
    subscriptionTier: string;
    instanceType: string;
    platformType: string | null;
    domains: string | null;
    springBootInstanceId: string;
    apiKey: string;
    status: string;
    clientId: string;
    createdAt: string;
    updatedAt: string;
  };
  metrics: {
    products: number;
    users: number;
    events: number;
    clicks: number;
    ctr: number;
    conversions: number;
    revenue: number;
    avgResponseTime: number;
    uptime: number;
    latency: number;
    errorRate: number;
    queuedEvents: number;
    monthlyUsage: number;
    health: string;
    statusLabel: string;
    statusTone: 'success' | 'warning' | 'danger';
  };
  topProducts: Array<{ product: string; recommended: number; score: number }>;
  engineReachable: boolean;
};

/**
 * Fetch live metrics for a single engine instance. Tolerates an unreachable
 * engine by returning zeros with reachable=false rather than throwing.
 */
export async function fetchInstanceLive(springBootInstanceId: string): Promise<LiveMetrics> {
  if (!springBootInstanceId) return { ...ZERO_LIVE };

  const [analytics, status] = await Promise.all([
    getInstanceAnalytics(springBootInstanceId).catch(() => null),
    getInstanceStatus(springBootInstanceId).catch(() => null),
  ]);

  if (!analytics && !status) return { ...ZERO_LIVE };

  const m = analytics?.metrics;
  const h = analytics?.systemHealth;
  const events = m?.totalEvents ?? 0;
  const ctrFraction = m?.recommendationClickthrough ?? 0;
  const clicks = Math.round(events * ctrFraction);
  const conversions = Math.round(clicks * (m?.conversionRate ?? 0));

  return {
    products: m?.totalItems ?? 0,
    users: m?.uniqueUsers ?? 0,
    events,
    clicks,
    avgResponseTime: m?.avgResponseTime ?? 0,
    ctr: ctrFraction * 100,
    conversions,
    revenue: m?.revenueImpact ?? 0,
    uptime: h?.uptime ?? 0,
    latency: h?.averageLatency ?? 0,
    errorRate: (h?.errorRate ?? 0) * 100,
    queuedEvents: status?.metrics?.queuedEvents ?? 0,
    health: status?.health ?? (analytics ? 'healthy' : 'unknown'),
    reachable: Boolean(analytics || status),
  };
}

function isActive(status: string) {
  return status === 'active' || status === 'Running';
}

export async function buildOverviewDashboardData(client: Client, workspaces: Workspace[]): Promise<OverviewDashboardData> {
  // Pull real metrics for every workspace from the engine, in parallel.
  const live = await Promise.all(workspaces.map((w) => fetchInstanceLive(w.springBootInstanceId)));

  const totalEvents = live.reduce((sum, l) => sum + l.events, 0);
  const totalProducts = live.reduce((sum, l) => sum + l.products, 0);
  const totalUsers = live.reduce((sum, l) => sum + l.users, 0);
  const totalClicks = live.reduce((sum, l) => sum + l.clicks, 0);
  const conversions = live.reduce((sum, l) => sum + l.conversions, 0);
  const revenue = live.reduce((sum, l) => sum + l.revenue, 0);
  const ctr = totalEvents > 0 ? (totalClicks / totalEvents) * 100 : 0;
  const activeInstances = workspaces.filter((w) => isActive(w.status)).length;
  const engineReachable = live.some((l) => l.reachable);

  // Real "by instance" chart: each bar is one store's actual engine activity.
  const chart: DashboardChartPoint[] = workspaces.slice(0, 7).map((w, i) => ({
    label: w.name.length > 10 ? `${w.name.slice(0, 9)}…` : w.name,
    recommendations: live[i].events,
    clicks: live[i].clicks,
  }));

  const sortedRecent = [...workspaces].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const recentInstances = sortedRecent.slice(0, 4).map((w) => ({
    id: w.id,
    name: w.name,
    subscriptionTier: w.subscriptionTier,
    instanceType: w.instanceType,
    status: w.status,
    springBootInstanceId: w.springBootInstanceId,
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
  }));

  const activity: DashboardActivityItem[] = [];

  if (sortedRecent[0]) {
    activity.push({
      title: `activity.created|${sortedRecent[0].name}`,
      detail: `activity.createdDetail|${sortedRecent[0].subscriptionTier || 'Bronze'}|${sortedRecent[0].createdAt.toISOString()}`,
      tone: 'success',
    });
  }

  activity.push({
    title: `activity.events|${totalEvents}`,
    detail: `activity.eventsDetail|${activeInstances}`,
    tone: 'info',
  });

  activity.push(
    engineReachable
      ? { title: 'activity.healthy', detail: `activity.healthyDetail|${activeInstances}|${workspaces.length}`, tone: 'success' }
      : { title: 'activity.unreachable', detail: 'activity.unreachableDetail', tone: 'warning' },
  );

  return {
    client: { id: client.id, fullName: client.fullName, companyName: client.companyName, email: client.email },
    metrics: {
      totalEvents,
      totalProducts,
      totalUsers,
      totalClicks,
      ctr: Number.isFinite(ctr) ? ctr : 0,
      conversions,
      revenue,
      totalInstances: workspaces.length,
      activeInstances,
    },
    chart,
    activity,
    engineReachable,
    recentInstances,
  };
}

export async function buildInstanceDashboardData(workspace: Workspace): Promise<InstanceDashboardData> {
  const [live, trending] = await Promise.all([
    fetchInstanceLive(workspace.springBootInstanceId),
    getTrending(workspace.springBootInstanceId, 5).catch(() => null),
  ]);

  const topProducts = (trending?.trendingItems ?? []).map((item) => ({
    product: item.itemId,
    recommended: item.rank,
    score: Math.round((item.trendScore ?? 0) * 100),
  }));

  return {
    workspace: {
      id: workspace.id,
      name: workspace.name,
      subscriptionTier: workspace.subscriptionTier,
      instanceType: workspace.instanceType,
      platformType: workspace.platformType,
      domains: workspace.domains,
      springBootInstanceId: workspace.springBootInstanceId,
      apiKey: workspace.apiKey,
      status: workspace.status,
      clientId: workspace.clientId,
      createdAt: workspace.createdAt.toISOString(),
      updatedAt: workspace.updatedAt.toISOString(),
    },
    metrics: {
      products: live.products,
      users: live.users,
      events: live.events,
      clicks: live.clicks,
      ctr: live.ctr,
      conversions: live.conversions,
      revenue: live.revenue,
      avgResponseTime: live.avgResponseTime,
      uptime: live.uptime,
      latency: live.latency,
      errorRate: live.errorRate,
      queuedEvents: live.queuedEvents,
      monthlyUsage: live.events,
      health: live.health,
      statusLabel: isActive(workspace.status) ? 'Active' : workspace.status === 'paused' ? 'Pending' : 'Inactive',
      statusTone: isActive(workspace.status) ? 'success' : workspace.status === 'paused' ? 'warning' : 'danger',
    },
    topProducts,
    engineReachable: live.reachable,
  };
}

export function formatMetric(value: number) {
  return value.toLocaleString();
}

export function formatCurrency(value: number) {
  return `${value.toLocaleString()} DA`;
}

export function maskApiKey(apiKey: string) {
  return apiKey.replace(/.(?=.{4})/g, '•');
}
