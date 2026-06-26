'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Copy, Download, ExternalLink, FileCode2, Plug, ShieldCheck, Smartphone } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import '../dashboard.css';

type WorkspaceOption = {
  id: string;
  name: string;
  apiKey: string;
  apiKeyPreview: string;
  springBootInstanceId: string;
  createdAt: string;
};

type InstancesResponse = {
  workspaces: WorkspaceOption[];
};

export default function IntegrationClient() {
  const { client, isLoggedIn } = useAuth();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [workspaces, setWorkspaces] = useState<WorkspaceOption[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadInstances() {
      if (!isLoggedIn || !client?.id) {
        setLoading(false);
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
          const entries = (result as InstancesResponse).workspaces ?? [];
          setWorkspaces(entries);
          setSelectedId(searchParams.get('workspaceId') || entries[0]?.id || '');
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
  }, [client?.id, isLoggedIn, searchParams]);

  const selectedWorkspace = useMemo(() => workspaces.find((workspace) => workspace.id === selectedId) || null, [selectedId, workspaces]);
  const integrationCode = selectedWorkspace ? `<script src="https://api.hypergraph.ai/widget.js" data-api-key="${selectedWorkspace.apiKey}"></script>` : '';

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="dashboard-main">
      <header className="page-shell-header">
        <div>
          <p className="eyebrow">{t('integrationEyebrow')}</p>
          <h1>{t('connectStoreTitle')}</h1>
          <p className="subtitle">{t('integrationSubtitle')}</p>
        </div>
      </header>

      {!isLoggedIn ? (
        <section className="panel-surface dashboard-empty-state">
          <p>{t('signInIntegration')}</p>
          <Link href="/login" className="button-primary mt-4 inline-flex">{t('goToLogin')}</Link>
        </section>
      ) : loading ? (
        <section className="panel-surface dashboard-empty-state">
          <p>{t('loadingInstances')}</p>
        </section>
      ) : error ? (
        <section className="panel-surface dashboard-empty-state">
          <p className="form-error">{error}</p>
        </section>
      ) : workspaces.length === 0 ? (
        <section className="panel-surface dashboard-empty-state">
          <Plug size={26} className="text-primary" />
          <p>{t('createFirstIntegration')}</p>
          <Link href="/dashboard/instances/new" className="button-primary mt-4 inline-flex">{t('createInstance')}</Link>
        </section>
      ) : (
        <div className="integration-layout">
          <section className="panel-surface dashboard-panel">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">{t('pickInstance')}</p>
                <h2>{t('apiKeyAndSnippet')}</h2>
              </div>
              <select className="integration-select" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>{workspace.name}</option>
                ))}
              </select>
            </div>

            {selectedWorkspace && (
              <>
                <div className="integration-step">
                  <div className="integration-step-head">
                    <span className="step-number">1</span>
                    <h3>{t('intStep1')}</h3>
                  </div>
                  <div className="secret-box mt-3">
                    <div>
                      <span className="meta-label">{t('apiKeyLabel')}</span>
                      <strong>{selectedWorkspace.apiKey}</strong>
                    </div>
                    <button type="button" className="button-secondary button-small" onClick={() => copy(selectedWorkspace.apiKey)}>
                      <Copy size={16} /> {copied ? t('copiedLabel') : t('copyLabel')}
                    </button>
                  </div>
                </div>

                <div className="integration-step">
                  <div className="integration-step-head">
                    <span className="step-number">2</span>
                    <h3>{t('intStep2')}</h3>
                  </div>
                  <div className="integration-snippet mt-3">
                    <code>{integrationCode}</code>
                  </div>
                  <div className="hero-actions mt-3">
                    <button type="button" className="button-outline button-small" onClick={() => copy(integrationCode)}>
                      <Copy size={16} /> {t('copyLabel')}
                    </button>
                    <button type="button" className="button-secondary button-small" onClick={() => window.alert(t('runNote'))}>
                      <ExternalLink size={16} /> {t('runLabel')}
                    </button>
                    <button type="button" className="button-secondary button-small">
                      <Download size={16} /> {t('downloadLabel')}
                    </button>
                  </div>
                </div>

                <div className="integration-step success-step">
                  <div className="integration-step-head">
                    <span className="step-number">3</span>
                    <h3>{t('youreDone')}</h3>
                  </div>
                  <p className="subtitle mt-3">{t('recsWithin24')}</p>
                  <div className="status-chip mt-3"><CheckCircle2 size={16} /> {t('integrationReady')}</div>
                </div>
              </>
            )}
          </section>

          <aside className="panel-surface dashboard-panel">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">{t('supportedPlatforms')}</p>
                <h2>{t('chooseStack')}</h2>
              </div>
            </div>

            <div className="platform-grid mt-4">
              <PlatformCard title="Shopify" description={t('platShopifyDesc')} icon={<ShieldCheck size={18} />} />
              <PlatformCard title="WooCommerce" description={t('platWooDesc')} icon={<FileCode2 size={18} />} />
              <PlatformCard title={t('platCustom')} description={t('platCustomDesc')} icon={<Plug size={18} />} />
              <PlatformCard title="Magento" description={t('platMagentoDesc')} icon={<Smartphone size={18} />} />
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

function PlatformCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <article className="platform-card">
      <div className="platform-icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </article>
  );
}
