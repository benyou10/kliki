'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, Bell, Shield, Globe, Database } from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<'general' | 'notifications' | 'security' | 'webhooks' | 'retention'>('general');
  const [workspaceName, setWorkspaceName] = useState('Primary Recommendation Workspace');
  const [primaryRegion, setPrimaryRegion] = useState('Africa / Algeria (Algiers) 🇩🇿');
  const [defaultInstance, setDefaultInstance] = useState('Primary storefront instance');
  const [historyRetention, setHistoryRetention] = useState('90 Days');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const stored = window.localStorage.getItem('kliki-workspace-settings');
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as {
        workspaceName?: string;
        primaryRegion?: string;
        defaultInstance?: string;
        historyRetention?: string;
      };

      if (parsed.workspaceName) setWorkspaceName(parsed.workspaceName);
      if (parsed.primaryRegion) setPrimaryRegion(parsed.primaryRegion);
      if (parsed.defaultInstance) setDefaultInstance(parsed.defaultInstance);
      if (parsed.historyRetention) setHistoryRetention(parsed.historyRetention);
    } catch {
      window.localStorage.removeItem('kliki-workspace-settings');
    }
  }, []);

  const handleSave = () => {
    window.localStorage.setItem(
      'kliki-workspace-settings',
      JSON.stringify({ workspaceName, primaryRegion, defaultInstance, historyRetention })
    );
    setStatusMessage('Workspace settings saved locally.');
  };

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>Workspace Settings</h1>
          <p className="subtitle">Configure the defaults that apply to this recommendation workspace.</p>
        </div>
        <button className="button-primary flex-align gap-2" onClick={handleSave} type="button"><Save size={20} /> Save Changes</button>
      </header>

      <div className="settings-layout">
        <aside className="settings-nav dashboard-section glass">
          <nav className="flex flex-col gap-2">
            <button className={`nav-item ${activeSection === 'general' ? 'active' : ''} flex-align gap-3`} onClick={() => setActiveSection('general')} type="button"><Settings size={18} /> General</button>
            <button className={`nav-item ${activeSection === 'notifications' ? 'active' : ''} flex-align gap-3`} onClick={() => setActiveSection('notifications')} type="button"><Bell size={18} /> Notifications</button>
            <button className={`nav-item ${activeSection === 'security' ? 'active' : ''} flex-align gap-3`} onClick={() => setActiveSection('security')} type="button"><Shield size={18} /> Security</button>
            <button className={`nav-item ${activeSection === 'webhooks' ? 'active' : ''} flex-align gap-3`} onClick={() => setActiveSection('webhooks')} type="button"><Globe size={18} /> Webhooks</button>
            <button className={`nav-item ${activeSection === 'retention' ? 'active' : ''} flex-align gap-3`} onClick={() => setActiveSection('retention')} type="button"><Database size={18} /> Data Retention</button>
          </nav>
        </aside>

        <section className="settings-content flex-1">
          {activeSection === 'general' && (
            <div className="dashboard-section glass">
              <h2>General configuration</h2>
              <div className="form-group mt-6">
                <label>Workspace Name</label>
                <input type="text" className="glass-input w-100 mt-2" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
              </div>
              <div className="form-group mt-6">
                <label>Primary Region</label>
                <select className="glass-select w-100 mt-2" value={primaryRegion} onChange={(e) => setPrimaryRegion(e.target.value)}>
                  <option>Africa / Algeria (Algiers) 🇩🇿</option>
                  <option>Europe (Paris)</option>
                  <option>Europe (Frankfurt)</option>
                </select>
              </div>
              <div className="form-group mt-6">
                <label>Default instance</label>
                <select className="glass-select w-100 mt-2" value={defaultInstance} onChange={(e) => setDefaultInstance(e.target.value)}>
                  <option>Primary storefront instance</option>
                  <option>Content discovery instance</option>
                </select>
              </div>
              {statusMessage && <p className="text-success mt-4">{statusMessage}</p>}
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="dashboard-section glass">
              <h2>Notifications</h2>
              <p className="text-muted mt-2">Notification preferences are connected to your workspace alerts.</p>
              <button className="button-secondary mt-4" type="button" onClick={() => setStatusMessage('Notification settings will connect to the alert service next.')}>Review alerts</button>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="dashboard-section glass">
              <h2>Security</h2>
              <p className="text-muted mt-2">Keys are workspace-scoped. Rotate them from the API page when ownership changes.</p>
              <button className="button-secondary mt-4" type="button" onClick={() => setStatusMessage('Security checks are configured from the API page.')}>Open API page</button>
            </div>
          )}

          {activeSection === 'webhooks' && (
            <div className="dashboard-section glass">
              <h2>Webhooks</h2>
              <p className="text-muted mt-2">Connect downstream systems to instance events and recommendations.</p>
              <button className="button-secondary mt-4" type="button" onClick={() => setStatusMessage('Webhook configuration is handled per instance.')}>View webhook guide</button>
            </div>
          )}

          {activeSection === 'retention' && (
            <div className="dashboard-section glass mt-6">
              <h2>Data retention</h2>
              <p className="text-muted text-sm mt-2">Specify how long events and logs should be stored for this workspace.</p>
              <div className="form-group mt-4">
                <label>Interaction History</label>
                <select className="glass-select w-100 mt-2" value={historyRetention} onChange={(e) => setHistoryRetention(e.target.value)}>
                  <option>90 Days</option>
                  <option>180 Days</option>
                  <option>1 Year</option>
                  <option>Indefinitely</option>
                </select>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
