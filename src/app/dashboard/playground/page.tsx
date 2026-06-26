'use client';

import React, { useState } from 'react';
import { Play, Settings, Grid, List, RefreshCw, Search } from 'lucide-react';
import { getRecommendations, type RecommendationResponse } from '@/lib/hypergraphApi';

export default function PlaygroundPage() {
  const [loading, setLoading] = useState(false);
  const [instanceId, setInstanceId] = useState('');
  const [userId, setUserId] = useState('user_123');
  const [limit, setLimit] = useState('10');
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<RecommendationResponse | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await getRecommendations(instanceId.trim(), {
        userId: userId.trim() || 'anonymous',
        limit: Number(limit) || 10,
      });

      setResponse(result);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : 'Unable to fetch recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>Playground</h1>
          <p className="subtitle">Test recommendation requests against a live instance.</p>
        </div>
        <button className="button-primary flex-align gap-2" onClick={runTest} disabled={loading}>
          {loading ? <RefreshCw className="animate-spin" size={20} /> : <Play size={20} />}
          {loading ? 'Running...' : 'Run Query'}
        </button>
      </header>

      <div className="playground-layout">
        <aside className="playground-sidebar dashboard-section glass">
          <h3>Configuration</h3>
          <div className="form-group mt-4">
            <label>Instance ID</label>
            <div className="search-box glass flex-1">
              <Search size={18} />
              <input
                type="text"
                className="glass-input w-100"
                placeholder="inst_123456789abc"
                value={instanceId}
                onChange={(e) => setInstanceId(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group mt-4">
            <label>User ID</label>
            <input
              type="text"
              className="glass-input w-100"
              placeholder="e.g. user_123"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="form-group mt-4">
            <label>Recommendation Limit</label>
            <input
              type="number"
              min={1}
              max={50}
              className="glass-input w-100"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>
          <div className="mt-6">
             <label className="flex-align justify-between">
               Endpoint
               <Settings size={16} className="text-muted" />
             </label>
             <p className="text-muted mt-2">GET /api/v1/instances/{'{instanceId}'}/recommend?userId=&limit=</p>
          </div>
        </aside>

        <section className="playground-results dashboard-section glass">
          <div className="section-title-row">
            <h2>Results</h2>
            <div className="flex-align gap-2">
              <button className={`icon-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} type="button"><Grid size={18} /></button>
              <button className={`icon-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} type="button"><List size={18} /></button>
            </div>
          </div>
          
          <div className={`results-placeholder py-20 text-center ${viewMode === 'list' ? 'results-list-mode' : ''}`}>
            {loading ? (
              <div className="loading-state">
                <RefreshCw className="animate-spin mb-4 mx-auto" size={40} />
                <p>Fetching recommendations...</p>
              </div>
            ) : error ? (
              <div className="form-error">{error}</div>
            ) : response ? (
              <div className="recommendation-results text-left">
                <p className="text-muted mb-4">Instance {response.instanceId} for user {response.userId}</p>
                <div className="health-table">
                  <div className="table-header">
                    <span>Rank</span>
                    <span>Item ID</span>
                    <span>Score</span>
                    <span>Reason</span>
                  </div>
                  {response.recommendations.map((item) => (
                    <div key={`${item.rank}-${item.itemId}`} className="table-row">
                      <span>{item.rank}</span>
                      <span>{item.itemId}</span>
                      <span>{item.score ?? item.similarity ?? item.trendScore ?? '-'}</span>
                      <span>{item.reason || 'personalized_preference'}</span>
                    </div>
                  ))}
                </div>
                <p className="text-muted mt-4">Generated at {response.generatedAt} in {response.responseTime}ms</p>
              </div>
            ) : (
              <>
                <div className="empty-icon glass mx-auto mb-4">
                  <Play size={40} className="opacity-20" />
                </div>
                <p className="text-muted">Configure your query and hit "Run Query" to see recommendations from the live instance.</p>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
