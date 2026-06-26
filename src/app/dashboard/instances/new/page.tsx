'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Copy, ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import '../../dashboard.css';

export default function NewInstance() {
  const { client, isLoggedIn } = useAuth();
  const { t } = useLanguage();
  const [instanceName, setInstanceName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{
    id: string;
    instanceId: string;
    apiKey: string;
    integrationCode: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/dashboard/instances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: instanceName,
          websiteUrl,
          description,
          clientId: client?.id,
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || t('createFailed'));
      }

      setCreated({
        id: result.id,
        instanceId: result.instanceId,
        apiKey: result.apiKey,
        integrationCode: result.integrationCode,
      });
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : t('createFailed'));
    } finally {
      setLoading(false);
    }
  };

  const copyValue = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="dashboard-main">
      <header className="page-shell-header">
        <div>
          <Link href="/dashboard/instances" className="back-link">
            <ArrowLeft size={16} /> {t('backToInstances')}
          </Link>
          <p className="eyebrow mt-3">{t('createInstance')}</p>
          <h1>{t('superSimple')}</h1>
          <p className="subtitle">{t('createInstanceSubtitle')}</p>
        </div>
      </header>

      {!isLoggedIn ? (
        <section className="panel-surface dashboard-empty-state">
          <p>{t('signInCreate')}</p>
          <Link href="/login" className="button-primary mt-4 inline-flex">{t('goToLogin')}</Link>
        </section>
      ) : created ? (
        <section className="create-success-layout">
          <div className="panel-surface dashboard-panel success-panel">
            <CheckCircle2 size={28} className="text-success" />
            <h2>{t('instanceCreated')}</h2>
            <p className="subtitle">{t('copyKeyOnce')}</p>

            <div className="secret-box">
              <div>
                <span className="meta-label">{t('apiKeyLabel')}</span>
                <strong>{created.apiKey}</strong>
              </div>
              <button className="button-secondary button-small" type="button" onClick={() => copyValue(created.apiKey)}>
                <Copy size={16} /> {copied ? t('copiedLabel') : t('copyLabel')}
              </button>
            </div>

            <div className="secret-box">
              <div>
                <span className="meta-label">{t('integrationCodeLabel')}</span>
                <code>{created.integrationCode}</code>
              </div>
              <button className="button-secondary button-small" type="button" onClick={() => copyValue(created.integrationCode)}>
                <Copy size={16} /> {copied ? t('copiedLabel') : t('copyLabel')}
              </button>
            </div>

            <div className="hero-actions mt-6">
              <Link href={`/dashboard/instances/${created.id}`} className="button-primary button-large">
                {t('viewInstanceDash')} <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard/integration" className="button-outline button-large">
                {t('integrationPageLabel')} <ExternalLink size={18} />
              </Link>
            </div>
          </div>

          <div className="panel-surface dashboard-panel">
            <h3>{t('nextSteps')}</h3>
            <ol className="step-list">
              <li>{t('newStep1')}</li>
              <li>{t('newStep2')}</li>
              <li>{t('newStep3')}</li>
            </ol>
          </div>
        </section>
      ) : (
        <section className="panel-surface dashboard-panel create-panel">
          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-group">
              <label htmlFor="instanceName">{t('instanceNameLabel')}</label>
              <input id="instanceName" value={instanceName} onChange={(e) => setInstanceName(e.target.value)} placeholder={t('phStoreName')} required disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="websiteUrl">{t('websiteUrlLabel')}</label>
              <input id="websiteUrl" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://my-store.com" disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="description">{t('descriptionLabel')}</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder={t('phStoreDesc')} disabled={loading} />
            </div>

            <div className="form-actions">
              <Link href="/dashboard/instances" className="button-secondary">{t('cancelLabel')}</Link>
              <button type="submit" className="button-primary" disabled={loading || !instanceName.trim()}>
                {loading ? t('creatingLabel') : <><Plus size={18} /> {t('createInstanceBtn')}</>}
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
