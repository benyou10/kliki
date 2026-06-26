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
  const response = await fetch(url, init);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.error || data?.message || response.statusText || 'Unknown error';
    throw new Error(`API request failed (${response.status}): ${message}`);
  }

  return data as T;
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
  return requestJson<InstanceDetailsResponse>(`${API_BASE_URL}/api/v1/instances/${instanceId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getInstanceStatus(instanceId: string): Promise<InstanceStatusResponse> {
  return requestJson<InstanceStatusResponse>(`${API_BASE_URL}/api/v1/instances/${instanceId}/status`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getRecommendations(
  instanceId: string,
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  const params = new URLSearchParams({
    userId: request.userId,
    limit: String(request.limit ?? 10),
  });

  return requestJson<RecommendationResponse>(
    `${API_BASE_URL}/api/v1/instances/${instanceId}/recommend?${params.toString()}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export async function injectEvent(
  instanceId: string,
  payload: InjectEventPayload
): Promise<InjectEventResponse> {
  return requestJson<InjectEventResponse>(`${API_BASE_URL}/api/v1/instances/${instanceId}/inject`, {
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
  getRecommendations,
  injectEvent,
};
