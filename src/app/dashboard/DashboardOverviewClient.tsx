'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Boxes, Clock3, DollarSign, Percent, Plus, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import './dashboard.css';

type Workspace = {
  id: string;
  name: string;
  subscriptionTier?: string;
  instanceType?: string;
  status?: string;
  springBootInstanceId?: string;
  createdAt?: string;
};

type OverviewResponse = {
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
  chart: Array<{ label: string; recommendations: number; clicks: number }>;
  activity: Array<{ title: string; detail: string; tone: 'success' | 'info' | 'warning' }>;
  engineReachable: boolean;
  recentInstances: Workspace[];
};

const emptyMetrics = {
  totalEvents: 0,
  totalProducts: 0,
  totalUsers: 0,
  totalClicks: 0,
  ctr: 0,
  conversions: 0,
  revenue: 0,
  totalInstances: 0,
  activeInstances: 0,
};

export default function DashboardOverviewClient() {
  const { client, isLoggedIn } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientId = client?.id || '';

  useEffect(() => {
    let mounted = true;

    async function loadOverview() {
      if (!isLoggedIn || !clientId) {
        if (!mounted) return;
        setData(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/dashboard/overview?clientId=${encodeURIComponent(clientId)}`);
        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(result?.error || t('loadingOverview'));
        }

        if (mounted) {
          setData(result as OverviewResponse);
        }
      } catch (loadError) {
        if (!mounted) return;
        setError(loadError instanceof Error ? loadError.message : t('loadingOverview'));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOverview();

    return () => {
      mounted = false;
    };
  }, [clientId, isLoggedIn, t]);

  const metrics = data?.metrics ?? emptyMetrics;
  const recentInstances = data?.recentInstances ?? [];
  const chart = data?.chart ?? [];
  const activity = data?.activity ?? [];
  const chartMax = Math.max(...chart.map((point) => Math.max(point.recommendations, point.clicks)), 1);

  // Activity items are emitted as "marker|arg1|arg2" so they can be localized here.
  const renderActivity = (code: string) => {
    const [marker, ...args] = code.split('|');
    const map: Record<string, string> = {
      'activity.created': 'actCreated',
      'activity.createdDetail': 'actCreatedDetail',
      'activity.events': 'actEvents',
      'activity.eventsDetail': 'actEventsDetail',
      'activity.healthy': 'actHealthy',
      'activity.healthyDetail': 'actHealthyDetail',
      'activity.unreachable': 'actUnreachable',
      'activity.unreachableDetail': 'actUnreachableDetail',
    };
    let text = t(map[marker] ?? marker);
    if (marker === 'activity.created') text = text.replace('{name}', args[0] ?? '');
    if (marker === 'activity.createdDetail') {
      text = text.replace('{tier}', args[0] ?? '').replace('{date}', args[1] ? new Date(args[1]).toLocaleDateString() : '');
    }
    if (marker === 'activity.events') text = text.replace('{n}', Number(args[0] ?? 0).toLocaleString());
    if (marker === 'activity.eventsDetail') text = text.replace('{n}', args[0] ?? '0');
    if (marker === 'activity.healthyDetail') text = text.replace('{a}', args[0] ?? '0').replace('{b}', args[1] ?? '0');
    return text;
  };

  const accountName = useMemo(() => {
    if (data?.client.fullName) return data.client.fullName;
    if (data?.client.companyName) return data.client.companyName;
    return client?.fullName || client?.companyName || client?.email || '';
  }, [client, data]);

  return (
    <main className="dashboard-main">
      <header className="dashboard-hero dashboard-home-hero">
        <div className="dashboard-hero-copy">
          <p className="eyebrow">{t('dashHome')}</p>
          <h1>{t('dashWelcome')}, {accountName}</h1>
          <p className="subtitle">{t('dashSubtitle')}</p>

          <div className="hero-actions">
            <Link href="/dashboard/instances/new" className="button-primary button-large">
              <Plus size={18} /> {t('createInstance')}
            </Link>
            <Link href="/dashboard/instances" className="button-secondary button-large">
              {t('viewAllInstances')} <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="dashboard-hero-side">
          <div className={`status-badge ${data?.engineReachable === false ? 'warning' : 'active'}`}>
            <span className="pulse-dot" /> {data?.engineReachable === false ? t('engineOffline') : t('allHealthy')}
          </div>
          <div className="hero-summary-card panel-surface">
            <p className="meta-label">{t('currentAccount')}</p>
            <h3>{data?.client.companyName || client?.companyName || t('noCompany')}</h3>
            <p className="text-muted mt-2">{data?.client.email || client?.email || t('signInToLoad')}</p>
            <div className="hero-summary-metrics">
              <div>
                <span>{t('instancesLabel')}</span>
                <strong>{metrics.totalInstances}</strong>
              </div>
              <div>
                <span>{t('activeLabel')}</span>
                <strong>{metrics.activeInstances}</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <section className="panel-surface dashboard-empty-state">
          <Sparkles size={28} className="text-primary" />
          <p>{t('loadingOverview')}</p>
        </section>
      ) : error ? (
        <section className="panel-surface dashboard-empty-state">
          <p className="form-error">{error}</p>
          <button className="button-secondary" type="button" onClick={() => window.location.reload()}>
            {t('tryAgain')}
          </button>
        </section>
      ) : !isLoggedIn ? (
        <section className="panel-surface dashboard-empty-state">
          <p className="text-muted">{t('signInToSee')}</p>
          <Link href="/login" className="button-primary mt-4 inline-flex">{t('goToLogin')}</Link>
        </section>
      ) : (
        <>
          <section className="kpi-grid dashboard-grid-5">
            <MetricCard icon={<TrendingUp size={24} />} label={t('kpiEvents')} value={metrics.totalEvents.toLocaleString()} tone="blue" />
            <MetricCard icon={<Boxes size={24} />} label={t('kpiProducts')} value={metrics.totalProducts.toLocaleString()} tone="green" />
            <MetricCard icon={<Users size={24} />} label={t('kpiActiveUsers')} value={metrics.totalUsers.toLocaleString()} tone="violet" />
            <MetricCard icon={<Percent size={24} />} label={t('kpiCtr')} value={`${metrics.ctr.toFixed(1)}%`} tone="amber" />
          </section>

          <section className="dashboard-content-grid home-two-column">
            <article className="panel-surface dashboard-panel chart-panel">
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">{t('liveStats')}</p>
                  <h2>{t('eventsByStore')}</h2>
                </div>
                <span className="status-chip">{t('perStore')}</span>
              </div>

              <div className="chart-legend">
                <span><i className="legend-dot recommendations" /> {t('legendEvents')}</span>
                <span><i className="legend-dot clicks" /> {t('legendClicks')}</span>
              </div>

              <div className="bar-chart" aria-label={t('eventsByStore')}>
                {chart.map((point) => (
                  <div key={point.label} className="bar-chart-day">
                    <div className="bar-columns">
                      <div className="bar-column">
                        <div className="bar-track">
                          <div className="bar-fill recommendations" style={{ height: `${(point.recommendations / chartMax) * 100}%` }} />
                        </div>
                      </div>
                      <div className="bar-column">
                        <div className="bar-track">
                          <div className="bar-fill clicks" style={{ height: `${(point.clicks / chartMax) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                    <span className="chart-label">{point.label}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel-surface dashboard-panel activity-panel">
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">{t('recentActivity')}</p>
                  <h2>{t('latestUpdates')}</h2>
                </div>
                <Clock3 size={18} className="text-muted" />
              </div>

              <div className="activity-feed">
                {activity.map((item, index) => (
                  <div key={index} className={`activity-item ${item.tone}`}>
                    <div className="activity-badge" />
                    <div>
                      <strong>{renderActivity(item.title)}</strong>
                      <p>{renderActivity(item.detail)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="panel-surface dashboard-panel">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">{t('recentInstances')}</p>
                <h2>{t('latestStores')}</h2>
              </div>
              <Link href="/dashboard/instances" className="button-text-link">{t('viewAll')} <ArrowRight size={16} /></Link>
            </div>

            <div className="instance-preview-grid mt-4">
              {recentInstances.length > 0 ? recentInstances.map((instance) => (
                <article key={instance.id} className="instance-preview-card panel-surface">
                  <div className="instance-preview-head">
                    <div>
                      <p className="meta-label">{t('storeLabel')}</p>
                      <h3>{instance.name}</h3>
                    </div>
                    <span className={`status-pill ${instance.status === 'active' ? 'success' : 'warning'}`}>
                      {instance.status === 'active' ? t('statusActive') : t('statusPending')}
                    </span>
                  </div>
                  <p className="text-muted small-gap">{t('idLabel')}: {instance.springBootInstanceId}</p>
                  <div className="instance-preview-actions">
                    <Link href={`/dashboard/instances/${instance.id}`} className="button-secondary button-small">{t('viewDetails')}</Link>
                    <Link href={`/dashboard/integration?workspaceId=${instance.id}`} className="button-outline button-small">{t('integrationCodeShort')}</Link>
                  </div>
                </article>
              )) : (
                <div className="dashboard-empty-state dashboard-empty-inset">
                  <p>{t('noStoresYet')}</p>
                  <Link href="/dashboard/instances/new" className="button-primary mt-4 inline-flex">{t('createFirstStore')}</Link>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'blue' | 'green' | 'amber' | 'violet' | 'emerald';
}) {
  return (
    <article className={`metric-card panel-surface tone-${tone}`}>
      <div className="metric-card-icon">{icon}</div>
      <div>
        <p className="metric-label">{label}</p>
        <h3 className="metric-value">{value}</h3>
      </div>
    </article>
  );
}
