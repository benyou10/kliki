'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Copy, Eye, EyeOff, LayoutGrid, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { maskApiKey, formatMetric } from '@/lib/dashboardMetrics';
import '../dashboard.css';

type WorkspaceItem = {
  id: string;
  name: string;
  apiKey: string;
  springBootInstanceId: string;
  subscriptionTier?: string;
  status?: string;
  createdAt: string;
  monthlyUsage?: number;
};

type InstancesResponse = {
  client: {
    id: string;
    fullName: string;
    companyName: string;
    email: string;
  };
  workspaces: WorkspaceItem[];
  summary: {
    total: number;
    active: number;
    inactive: number;
  };
};

export default function InstancesPage() {
  const { client, isLoggedIn } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState<InstancesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;

    async function loadInstances() {
      if (!client?.id || !isLoggedIn) {
        setLoading(false);
        setData(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/dashboard/instances?clientId=${encodeURIComponent(client.id)}`);
        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(result?.error || 'Unable to load instances.');
        }

        if (mounted) {
          setData(result as InstancesResponse);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load instances.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadInstances();

    return () => {
      mounted = false;
    };
  }, [client?.id, isLoggedIn]);

  const handleDelete = async (workspaceId: string) => {
    if (!client?.id) return;
    const confirmed = window.confirm(t('deleteConfirm'));
    if (!confirmed) return;

    const response = await fetch(`/api/dashboard/instances?clientId=${encodeURIComponent(client.id)}&workspaceId=${encodeURIComponent(workspaceId)}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setData((current) => {
        if (!current) return current;
        return {
          ...current,
          workspaces: current.workspaces.filter((workspace) => workspace.id !== workspaceId),
          summary: {
            total: Math.max(0, current.summary.total - 1),
            active: current.summary.active,
            inactive: current.summary.inactive,
          },
        };
      });
      return;
    }

    const result = await response.json().catch(() => null);
    window.alert(result?.error || t('deleteFailed'));
  };

  const toggleKey = (workspaceId: string) => {
    setRevealedKeys((current) => ({
      ...current,
      [workspaceId]: !current[workspaceId],
    }));
  };

  return (
    <main className="dashboard-main">
      <header className="page-shell-header">
        <div>
          <p className="eyebrow">{t('navInstances')}</p>
          <h1>{t('instancesTitle')}</h1>
          <p className="subtitle">{t('instancesSubtitle')}</p>
        </div>
        <Link href="/dashboard/instances/new" className="button-primary button-large">
          <Plus size={18} /> {t('createInstance')}
        </Link>
      </header>

      {!isLoggedIn ? (
        <section className="panel-surface dashboard-empty-state">
          <p>{t('signInInstances')}</p>
          <Link href="/login" className="button-primary mt-4 inline-flex">{t('goToLogin')}</Link>
        </section>
      ) : loading ? (
        <section className="panel-surface dashboard-empty-state">
          <p>{t('loadingInstances')}</p>
        </section>
      ) : error ? (
        <section className="panel-surface dashboard-empty-state">
          <p className="form-error">{error}</p>
          <button type="button" className="button-secondary" onClick={() => window.location.reload()}>{t('tryAgain')}</button>
        </section>
      ) : (
        <>
          <section className="instances-summary-grid">
            <div className="metric-card panel-surface">
              <p className="metric-label">{t('totalInstancesLabel')}</p>
              <h3 className="metric-value">{data?.summary.total ?? 0}</h3>
            </div>
            <div className="metric-card panel-surface">
              <p className="metric-label">{t('activeLabel')}</p>
              <h3 className="metric-value">{data?.summary.active ?? 0}</h3>
            </div>
            <div className="metric-card panel-surface">
              <p className="metric-label">{t('inactiveLabel')}</p>
              <h3 className="metric-value">{data?.summary.inactive ?? 0}</h3>
            </div>
          </section>

          <section className="instances-grid">
            {(data?.workspaces ?? []).map((workspace, index) => {
              const revealed = revealedKeys[workspace.id];
              const maskedKey = maskApiKey(workspace.apiKey);
              const usage = workspace.monthlyUsage ?? 0;

              return (
                <article key={workspace.id} className="instance-card panel-surface">
                  <div className="instance-card-top">
                    <div>
                      <p className="meta-label">{t('instanceNameLabel')}</p>
                      <h3>{workspace.name}</h3>
                    </div>
                    <span className={`status-pill ${workspace.status === 'active' ? 'success' : 'warning'}`}>
                      {workspace.status === 'active' ? t('statusActive') : workspace.status === 'paused' ? t('statusPending') : t('inactiveLabel')}
                    </span>
                  </div>

                  <div className="instance-card-meta">
                    <div>
                      <span className="meta-label">{t('instanceIdLabel')}</span>
                      <strong>{workspace.springBootInstanceId}</strong>
                    </div>
                    <div>
                      <span className="meta-label">{t('createdDateLabel')}</span>
                      <strong>{new Date(workspace.createdAt).toLocaleDateString()}</strong>
                    </div>
                    <div>
                      <span className="meta-label">{t('apiKeyLabel')}</span>
                      <strong>{revealed ? workspace.apiKey : maskedKey}</strong>
                    </div>
                    <div>
                      <span className="meta-label">{t('usageLabel')}</span>
                      <strong>{formatMetric(usage)} {t('usageSuffix')}</strong>
                    </div>
                  </div>

                  <div className="instance-card-actions">
                    <button type="button" className="button-secondary button-small" onClick={() => toggleKey(workspace.id)}>
                      {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                      {revealed ? t('hideKey') : t('revealKey')}
                    </button>
                    <Link href={`/dashboard/instances/${workspace.id}`} className="button-primary button-small">
                      {t('viewDetails')}
                    </Link>
                    <Link href={`/dashboard/integration?workspaceId=${workspace.id}`} className="button-outline button-small">
                      {t('getIntegrationCode')}
                    </Link>
                    <Link href={`/dashboard/instances/${workspace.id}`} className="button-text-link button-small">
                      {t('viewDashboard')} <ArrowRight size={16} />
                    </Link>
                    <button type="button" className="button-danger button-small" onClick={() => handleDelete(workspace.id)}>
                      <Trash2 size={16} /> {t('deleteLabel')}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          {(data?.workspaces ?? []).length === 0 && (
            <section className="panel-surface dashboard-empty-state">
              <LayoutGrid size={24} className="text-primary" />
              <p>{t('noInstancesYet')}</p>
              <Link href="/dashboard/instances/new" className="button-primary mt-4 inline-flex">{t('createInstance')}</Link>
            </section>
          )}
        </>
      )}
    </main>
  );
}
