'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Database } from 'lucide-react';
import Link from 'next/link';
import '../instances.css';

export default function NewInstance() {
  const router = useRouter();
  const [instanceName, setInstanceName] = useState('');
  const [subscriptionTier, setSubscriptionTier] = useState('Bronze');
  const [platformType, setPlatformType] = useState('ecommerce');
  const [domains, setDomains] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch('/api/dashboard/instances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: instanceName,
        subscriptionTier,
        platformType,
        domains,
      }),
    });

    const result = await response.json().catch(() => null);
    if (!response.ok) {
      setError(result?.error || 'Unable to create instance. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push(`/dashboard/instances/${result.id}`);
  };

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <Link href="/dashboard" className="back-link">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="mt-4">Create a new workspace</h1>
          <p className="subtitle">Provision a recommendation workspace with its own API key and remote instance id.</p>
        </div>
      </header>

      <section className="form-section glass">
        <div className="form-header">
          <Database className="text-primary" size={32} />
          <div>
            <h3>Workspace setup</h3>
            <p>Deploy a dedicated tenant for one storefront, catalog, or content surface.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="instanceName">Workspace Name</label>
            <input
              type="text"
              id="instanceName"
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
              placeholder="e.g. Summer Catalog Recommendations"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subscriptionTier">Plan</label>
            <select
              id="subscriptionTier"
              value={subscriptionTier}
              onChange={(e) => setSubscriptionTier(e.target.value)}
              disabled={loading}
            >
              <option value="Bronze">Bronze (8,000 DA/month)</option>
              <option value="Argent">Argent (20,000 DA/month)</option>
              <option value="Or">Or (55,000 DA/month)</option>
              <option value="Platine">Platine (125,000 DA/month)</option>
            </select>
            <small className="text-muted">Each tier includes different capacity limits for traffic and event volume. You can create multiple instances with different tiers.</small>
          </div>

          <div className="form-group">
            <label htmlFor="platformType">Platform Type</label>
            <select
              id="platformType"
              value={platformType}
              onChange={(e) => setPlatformType(e.target.value)}
              disabled={loading}
            >
              <option value="ecommerce">E-commerce</option>
              <option value="media">Media & Streaming</option>
              <option value="marketplace">Marketplace</option>
              <option value="custom">Custom API</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="domains">Allowed Domains (Optional)</label>
            <input
              type="text"
              id="domains"
              value={domains}
              onChange={(e) => setDomains(e.target.value)}
              placeholder="https://yourstore.com, localhost"
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <Link href="/dashboard" className="button-secondary">Cancel</Link>
            <button type="submit" className="button-primary" disabled={loading || !instanceName.trim()}>
              {loading ? 'Processing...' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
