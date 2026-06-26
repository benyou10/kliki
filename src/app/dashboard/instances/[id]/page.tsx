'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Boxes, Clock, Copy, Eye, EyeOff, Gauge, Percent, ShieldAlert, Sparkles, Users, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import '../../dashboard.css';

type InstanceResponse = {
  client: { id: string; fullName: string; companyName: string; email: string };
  workspace: {
    id: string;
    name: string;
    apiKey: string;
    springBootInstanceId: string;
    subscriptionTier?: string;
    platformType?: string;
    domains?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  apiKeyPreview: string;
  integrationCode: string;
  endpointUrl: string;
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

export default function InstanceDashboardPage() {
  const params = useParams<{ id: string }>();
  const { client, isLoggedIn } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState<InstanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const workspaceId = params?.id || '';

  useEffect(() => {
    let mounted = true;

    async function loadInstance() {
      if (!isLoggedIn || !client?.id || !workspaceId) {
        setLoading(false);
        setData(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/dashboard/instances?clientId=${encodeURIComponent(client.id)}&workspaceId=${encodeURIComponent(workspaceId)}`);
        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(result?.error || t('loadingInstanceDash'));
        }

        if (mounted) {
          setData(result as InstanceResponse);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : t('loadingInstanceDash'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadInstance();

    return () => {
      mounted = false;
    };
  }, [client?.id, isLoggedIn, workspaceId, t]);

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <main className="dashboard-main">
      <header className="page-shell-header">
        <div>
          <Link href="/dashboard/instances" className="back-link">
            <ArrowLeft size={16} /> {t('backToInstances')}
          </Link>
          <p className="eyebrow mt-3">{t('instanceDashboardEyebrow')}</p>
          <h1>{data?.workspace.name || t('instanceDashboardEyebrow')}</h1>
          <p className="subtitle">{t('instanceDashSubtitle')}</p>
        </div>
      </header>

      {!isLoggedIn ? (
        <section className="panel-surface dashboard-empty-state">
          <p>{t('signInToSee')}</p>
          <Link href="/login" className="button-primary mt-4 inline-flex">{t('goToLogin')}</Link>
        </section>
      ) : loading ? (
        <section className="panel-surface dashboard-empty-state">
          <Sparkles size={28} className="text-primary" />
          <p>{t('loadingInstanceDash')}</p>
        </section>
      ) : error ? (
        <section className="panel-surface dashboard-empty-state">
          <p className="form-error">{error}</p>
          <Link href="/dashboard/instances" className="button-secondary mt-4 inline-flex">{t('backToInstances')}</Link>
        </section>
      ) : data ? (
        <>
          <section className="kpi-grid dashboard-grid-5">
            <MetricCard icon={<Boxes size={22} />} label={t('kpiProducts')} value={data.metrics.products.toLocaleString()} />
            <MetricCard icon={<Users size={22} />} label={t('kpiActiveUsers')} value={data.metrics.users.toLocaleString()} />
            <MetricCard icon={<Zap size={22} />} label={t('kpiEvents')} value={data.metrics.events.toLocaleString()} />
            <MetricCard icon={<Percent size={22} />} label={t('kpiCtr')} value={`${data.metrics.ctr.toFixed(1)}%`} />
            <MetricCard icon={<Clock size={22} />} label={t('kpiAvgResponse')} value={data.metrics.avgResponseTime.toLocaleString()} />
          </section>

          {!data.engineReachable && (
            <section className="panel-surface dashboard-empty-state">
              <ShieldAlert size={24} className="text-primary" />
              <p className="text-muted">{t('engineUnreachableNote')}</p>
            </section>
          )}

          <section className="dashboard-content-grid instance-dashboard-grid">
            <article className="panel-surface dashboard-panel">
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">{t('systemHealthEyebrow')}</p>
                  <h2>{t('liveEngineStatus')}</h2>
                </div>
                <span className={`status-pill ${data.metrics.statusTone}`}>{data.metrics.statusLabel}</span>
              </div>

              <div className="settings-stack mt-4">
                <div className="setting-row"><span><Gauge size={16} /> {t('mUptime')}</span><strong>{data.metrics.uptime.toFixed(2)}%</strong></div>
                <div className="setting-row"><span><Clock size={16} /> {t('mLatency')}</span><strong>{data.metrics.latency} ms</strong></div>
                <div className="setting-row"><span><ShieldAlert size={16} /> {t('mErrorRate')}</span><strong>{data.metrics.errorRate.toFixed(2)}%</strong></div>
                <div className="setting-row"><span><Zap size={16} /> {t('mQueued')}</span><strong>{data.metrics.queuedEvents.toLocaleString()}</strong></div>
                <div className="setting-row"><span><Sparkles size={16} /> {t('mHealth')}</span><strong>{data.metrics.health}</strong></div>
              </div>
            </article>

            <aside className="panel-surface dashboard-panel settings-panel">
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">{t('instanceSettingsEyebrow')}</p>
                  <h2>{t('apiKeyIntegration')}</h2>
                </div>
              </div>

              <div className="secret-box mt-4">
                <div>
                  <span className="meta-label">{t('apiKeyLabel')}</span>
                  <strong>{showKey ? data.workspace.apiKey : data.apiKeyPreview}</strong>
                </div>
                <button type="button" className="button-secondary button-small" onClick={() => setShowKey((current) => !current)}>
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showKey ? t('hideLabelShort') : t('showLabel')}
                </button>
              </div>

              <div className="hero-actions mt-4">
                <button type="button" className="button-outline button-small" onClick={() => copy(data.integrationCode)}>
                  <Copy size={16} /> {t('copyIntegration')}
                </button>
                <button type="button" className="button-danger button-small" onClick={() => window.alert(t('regenerateNote'))}>
                  <ShieldAlert size={16} /> {t('regenerateKey')}
                </button>
              </div>

              <div className="integration-snippet mt-4">
                <code>{data.integrationCode}</code>
              </div>

              <div className="dashboard-note mt-4">
                <p className="text-muted">{t('pasteHeaderNote')}</p>
              </div>
            </aside>
          </section>

          <section className="panel-surface dashboard-panel">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">{t('topProductsEyebrow')}</p>
                <h2>{t('mostSuggested')}</h2>
              </div>
            </div>

            {data.topProducts.length > 0 ? (
              <div className="detail-table mt-4">
                <div className="table-header">
                  <span>{t('colProduct')}</span>
                  <span>{t('colRank')}</span>
                  <span>{t('colScore')}</span>
                </div>
                {data.topProducts.map((row) => (
                  <div key={row.product} className="table-row">
                    <span>{row.product}</span>
                    <span>{row.recommended.toLocaleString()}</span>
                    <span>{row.score.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state dashboard-empty-inset mt-4">
                <p className="text-muted">{t('noTrendingYet')}</p>
              </div>
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <article className="metric-card panel-surface">
      <div className="metric-card-icon">{icon}</div>
      <div>
        <p className="metric-label">{label}</p>
        <h3 className="metric-value">{value}</h3>
      </div>
    </article>
  );
}
