'use client';

import React, { useMemo, useState } from 'react';
import { FileCode, Search, Filter, Terminal } from 'lucide-react';

export default function LogsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [level, setLevel] = useState<'all' | 'info' | 'warn' | 'error'>('all');

  const exportLogs = () => {
    const payload = [
      'Kliki Logs Export',
      `Generated: ${new Date().toISOString()}`,
      `Filter: ${level}`,
      'No log events have been recorded yet.',
    ].join('\n');

    const blob = new Blob([payload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'kliki-logs.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>API Logs & Monitoring</h1>
          <p className="subtitle">Inspect events, requests, and failures across your recommendation instances.</p>
        </div>
        <div className="flex-align gap-3">
          <button className="button-secondary flex-align gap-2" onClick={() => setShowFilters((current) => !current)} type="button">
            <Filter size={18} /> {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
          <button className="button-primary" onClick={exportLogs} type="button">Export Logs</button>
        </div>
      </header>

      <div className="dashboard-section glass">
        {showFilters && (
          <div className="glass p-4 mb-4">
            <div className="flex-align gap-3 flex-wrap">
              {(['all', 'info', 'warn', 'error'] as const).map((itemLevel) => (
                <button
                  key={itemLevel}
                  type="button"
                  className={`button-secondary ${level === itemLevel ? 'active' : ''}`}
                  onClick={() => setLevel(itemLevel)}
                >
                  {itemLevel === 'all' ? 'All levels' : itemLevel.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="section-title-row">
          <div className="search-box glass flex-1">
            <Search size={18} />
            <input type="text" placeholder="Search by User ID, Request ID..." className="w-100" />
          </div>
        </div>

        <div className="empty-state py-20 text-center">
          <FileCode size={48} className="mb-4 opacity-70" />
          <p className="text-lg font-semibold">No logs available yet.</p>
          <p className="text-muted mt-2">Logs will appear here once your recommendation endpoints receive traffic.</p>
        </div>
      </div>
    </main>
  );
}
