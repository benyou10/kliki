const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://138.68.90.21:8080';

export interface HypergraphInstance {
  id: string;
  name?: string;
  status?: string;
  createdAt?: string;
}

export interface CreateInstancePayload {
  instanceName: string;
  subscriptionTier: string;
  algorithmicType: string;
  configuration?: Record<string, unknown>;
}

export interface CreateInstanceResponse {
  instanceId: string;
  message: string;
  endpointUrl: string;
  status?: string;
  createdAt?: string;
}

export interface InstanceDetailsResponse {
  instanceId: string;
  name: string;
  subscriptionTier: string;
  algorithmicType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  stats?: Record<string, unknown>;
  configuration?: Record<string, unknown>;
  endpoints?: Record<string, string>;
}

export interface InstanceStatusResponse {
  instanceId: string;
  status: string;
  health: string;
  uptime?: number;
  lastHeartbeat?: string;
  metrics?: {
    queuedEvents?: number;
    [key: string]: unknown;
  };
}

export interface RecommendationRequest {
  userId: string;
  limit?: number;
}

export interface RecommendationItem {
  rank: number;
  itemId: string;
  score?: number;
  reason?: string;
  similarity?: number;
  trendScore?: number;
}

export interface RecommendationResponse {
  instanceId: string;
  userId: string;
  recommendations: RecommendationItem[];
  generatedAt: string;
  responseTime: number;
}

export interface InjectEventPayload {
  userId: string;
  itemId: string;
  actionType: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export interface InjectEventResponse {
  message: string;
  eventId: string;
  instanceId: string;
  timestamp: string;
  eventCount: number;
}

async function requestJson<T>(url: string, init: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = 10000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const response = await fetch(url, {
    ...init,
    signal: init.signal ?? controller.signal,
  }).catch((error) => {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`API request timed out after ${timeoutMs / 1000}s.`);
    }
    throw error;
  }).finally(() => {
    clearTimeout(timeoutId);
  });

  const text = await response.text();
  let data: any = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message = typeof data === 'string'
      ? data
      : data?.error || data?.message || response.statusText || 'Unknown error';
    throw new Error(`API request failed (${response.status}): ${message}`);
  }

  return data as T;
}

function assertInstanceId(instanceId: string) {
  const trimmed = instanceId.trim();
  if (!trimmed) {
    throw new Error('Instance ID is required.');
  }
  return trimmed;
}

export async function getInstances(): Promise<HypergraphInstance[]> {
  const instances = await requestJson<string[]>(`${API_BASE_URL}/api/v1/instances`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  return instances.map((id) => ({ id }));
}

export async function createInstance(
  instanceData?: CreateInstancePayload
): Promise<CreateInstanceResponse> {
  const init: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };

  if (instanceData && Object.keys(instanceData).length > 0) {
    init.body = JSON.stringify(instanceData);
  }

  return requestJson<CreateInstanceResponse>(`${API_BASE_URL}/api/v1/instances`, init);
}

export async function getInstance(instanceId: string): Promise<InstanceDetailsResponse> {
  const normalizedInstanceId = assertInstanceId(instanceId);
  return requestJson<InstanceDetailsResponse>(`${API_BASE_URL}/api/v1/instances/${normalizedInstanceId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getInstanceStatus(instanceId: string): Promise<InstanceStatusResponse> {
  const normalizedInstanceId = assertInstanceId(instanceId);
  return requestJson<InstanceStatusResponse>(`${API_BASE_URL}/api/v1/instances/${normalizedInstanceId}/status`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getRecommendations(
  instanceId: string,
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  const normalizedInstanceId = assertInstanceId(instanceId);
  const params = new URLSearchParams({
    userId: request.userId,
    limit: String(request.limit ?? 10),
  });

  return requestJson<RecommendationResponse>(
    `${API_BASE_URL}/api/v1/instances/${normalizedInstanceId}/recommend?${params.toString()}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export interface InstanceAnalyticsResponse {
  instanceId: string;
  metrics: {
    totalItems: number;
    totalEvents: number;
    uniqueUsers: number;
    avgResponseTime: number;
    recommendationClickthrough: number;
    conversionRate: number;
    revenueImpact: number;
  };
  systemHealth: {
    uptime: number;
    averageLatency: number;
    errorRate: number;
  };
}

export interface TrendingResponse {
  instanceId: string;
  trendingItems: Array<{ rank: number; itemId: string; trendScore: number }>;
  generatedAt: string;
}

export async function getInstanceAnalytics(instanceId: string): Promise<InstanceAnalyticsResponse> {
  const normalizedInstanceId = assertInstanceId(instanceId);
  return requestJson<InstanceAnalyticsResponse>(`${API_BASE_URL}/api/v1/instances/${normalizedInstanceId}/analytics`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getTrending(instanceId: string, limit = 5): Promise<TrendingResponse> {
  const normalizedInstanceId = assertInstanceId(instanceId);
  return requestJson<TrendingResponse>(`${API_BASE_URL}/api/v1/instances/${normalizedInstanceId}/trending?limit=${limit}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function injectEvent(
  instanceId: string,
  payload: InjectEventPayload
): Promise<InjectEventResponse> {
  const normalizedInstanceId = assertInstanceId(instanceId);
  return requestJson<InjectEventResponse>(`${API_BASE_URL}/api/v1/instances/${normalizedInstanceId}/inject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export const apiService = {
  getInstances,
  createInstance,
  getInstance,
  getInstanceStatus,
  getInstanceAnalytics,
  getTrending,
  getRecommendations,
  injectEvent,
};
