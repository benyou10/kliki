'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Key, Code, CheckCircle, Copy } from 'lucide-react';
import Link from 'next/link';
import {
  getInstance,
  getInstanceStatus,
  injectEvent,
  type InstanceDetailsResponse,
  type InstanceStatusResponse,
} from '@/lib/hypergraphApi';

interface WorkspaceProps {
  id: string;
  name: string;
  apiKey: string;
  springBootInstanceId: string;
  subscriptionTier?: string;
  platformType?: string;
  domains?: string;
  createdAt: string;
  updatedAt: string;
}

export default function WorkspaceDetailsClient({ workspace }: { workspace: WorkspaceProps }) {
  const [copied, setCopied] = useState(false);
  const [details, setDetails] = useState<InstanceDetailsResponse | null>(null);
  const [status, setStatus] = useState<InstanceStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingEvent, setRefreshingEvent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState('user_123');
  const [itemId, setItemId] = useState('product_abc');
  const [actionType, setActionType] = useState('view');
  const [sessionId, setSessionId] = useState('session_001');
  const [category, setCategory] = useState('default');
  const [eventResult, setEventResult] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://138.68.90.21:8080';

  useEffect(() => {
    let isMounted = true;

    const loadLiveData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [instanceDetails, instanceStatus] = await Promise.all([
          getInstance(workspace.springBootInstanceId),
          getInstanceStatus(workspace.springBootInstanceId),
        ]);

        if (!isMounted) return;

        setDetails(instanceDetails);
        setStatus(instanceStatus);
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError instanceof Error ? loadError.message : 'Unable to load live instance data.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadLiveData();

    return () => {
      isMounted = false;
    };
  }, [workspace.springBootInstanceId]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(workspace.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const endpoint = `${baseUrl}/api/v1/instances/${workspace.springBootInstanceId}/inject`;

  const refreshLiveData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [instanceDetails, instanceStatus] = await Promise.all([
        getInstance(workspace.springBootInstanceId),
        getInstanceStatus(workspace.springBootInstanceId),
      ]);

      setDetails(instanceDetails);
      setStatus(instanceStatus);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Unable to refresh live instance data.');
    } finally {
      setLoading(false);
    }
  };

  const sendTestEvent = async () => {
    setRefreshingEvent(true);
    setEventResult(null);
    setError(null);

    try {
      const response = await injectEvent(workspace.springBootInstanceId, {
        userId,
        itemId,
        actionType,
        sessionId,
        metadata: { category },
      });

      setEventResult(`${response.message} Event count: ${response.eventCount}`);
      await refreshLiveData();
    } catch (eventError) {
      setError(eventError instanceof Error ? eventError.message : 'Unable to send test event.');
    } finally {
      setRefreshingEvent(false);
    }
  };

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <Link href="/dashboard" className="back-link">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="mt-4">{workspace.name}</h1>
          <p className="subtitle">Instance ID: {workspace.springBootInstanceId}</p>
        </div>
        <button className="button-secondary">Archive instance</button>
      </header>

      <div className="instance-grid">
        <section className="dashboard-section glass">
          <div className="section-title-row">
            <h2 className="flex-align">
              <Key className="text-secondary" size={24} /> API Credentials
            </h2>
          </div>
          <p className="text-muted">Use this API key to authenticate your requests. Do not share it publicly.</p>

          <div className="api-key-box mt-4">
            <code>{workspace.apiKey}</code>
            <button className="copy-btn" onClick={copyToClipboard} title="Copy API Key">
              {copied ? <CheckCircle size={18} className="text-success" /> : <Copy size={18} />}
            </button>
          </div>

          <div className="mt-4 text-sm text-muted">
            <div>Created: {new Date(workspace.createdAt).toLocaleString()}</div>
            <div>Updated: {new Date(workspace.updatedAt).toLocaleString()}</div>
          </div>
        </section>

        <section className="dashboard-section glass">
          <div className="section-title-row">
            <h2 className="flex-align">
              <Code className="text-secondary" size={24} /> Live Status
            </h2>
            <button className="button-secondary" onClick={refreshLiveData} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {error && <div className="form-error mt-4">{error}</div>}

          <div className="metric-grid mt-4">
            <div className="metric-card">
              <span className="metric-label">Health</span>
              <h3>{status?.health || 'Unknown'}</h3>
              <p className="text-muted">Current engine health state.</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Status</span>
              <h3>{status?.status || details?.status || 'Unknown'}</h3>
              <p className="text-muted">Instance lifecycle state.</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Uptime</span>
              <h3>{status?.uptime != null ? `${status.uptime}s` : 'N/A'}</h3>
              <p className="text-muted">Reported by the recommendation service.</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Events queued</span>
              <h3>{status?.metrics?.queuedEvents ?? 0}</h3>
              <p className="text-muted">Server-side queue depth.</p>
            </div>
          </div>

          <div className="dashboard-section glass mt-4" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px' }}>
            <div className="section-title-row">
              <h3 className="flex-align">Engine Metadata</h3>
            </div>
            <div className="mt-4 text-sm text-muted">
              <div>Instance name: {details?.name || workspace.name}</div>
              <div>Algorithm: {details?.algorithmicType || 'walker-hypergraph'}</div>
              <div>Created at: {details?.createdAt || workspace.createdAt}</div>
              <div>Updated at: {details?.updatedAt || workspace.updatedAt}</div>
              {details?.configuration && (
                <div className="mt-3">
                  <div className="mb-2">Configuration</div>
                  <pre className="code-block" style={{ whiteSpace: 'pre-wrap' }}>
                    <code>{JSON.stringify(details.configuration, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="dashboard-section glass">
          <div className="section-title-row">
            <h2 className="flex-align">
              <Code className="text-secondary" size={24} /> Recommendation endpoint
            </h2>
          </div>
          <p className="text-muted">Send interaction payloads to this instance injection endpoint.</p>
          <div className="api-key-box mt-4">
            <code>{endpoint}</code>
            <button className="copy-btn" onClick={async () => {
              await navigator.clipboard.writeText(endpoint);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }} title="Copy endpoint">
              {copied ? <CheckCircle size={18} className="text-success" /> : <Copy size={18} />}
            </button>
          </div>
          {workspace.subscriptionTier && (
            <div className="mt-4 text-sm text-muted">
              <div>Plan: {workspace.subscriptionTier}</div>
              <div>Platform: {workspace.platformType || 'Custom'}</div>
              {workspace.domains && <div>Domains: {workspace.domains}</div>}
            </div>
          )}
        </section>

        <section className="dashboard-section glass">
          <div className="section-title-row">
            <h2 className="flex-align">
              <Code className="text-secondary" size={24} /> Send Test Event
            </h2>
          </div>

          <div className="setup-form mt-4">
            <div className="form-group">
              <label htmlFor="userId">User ID</label>
              <input id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="itemId">Item ID</label>
              <input id="itemId" value={itemId} onChange={(e) => setItemId(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="actionType">Action Type</label>
              <input id="actionType" value={actionType} onChange={(e) => setActionType(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="sessionId">Session ID</label>
              <input id="sessionId" value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>

            <button className="button-primary" type="button" onClick={sendTestEvent} disabled={refreshingEvent || loading}>
              {refreshingEvent ? 'Sending...' : 'Inject Event'}
            </button>

            {eventResult && <div className="form-success mt-3">{eventResult}</div>}
          </div>
        </section>

        <section className="dashboard-section glass">
          <div className="section-title-row">
            <h2 className="flex-align">
              <Code className="text-secondary" size={24} /> Integration
            </h2>
          </div>
          <p className="text-muted">Initialize the SDK in your application using the workspace key.</p>

          <div className="code-block mt-4">
            <pre>
              <code>{`import { Kliki } from '@kliki/sdk';

const client = new Kliki({
  apiKey: '${workspace.apiKey}',
  environment: 'production',
});

await client.pushInteraction({
  userId: 'user_123',
  itemId: 'product_abc',
  actionType: 'view',
});`}</code>
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
