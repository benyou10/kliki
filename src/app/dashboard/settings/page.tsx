'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Bell, CreditCard, Save, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import '../dashboard.css';

type SettingsState = {
  fullName: string;
  email: string;
  companyName: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  emailNotifications: boolean;
  weeklyReport: boolean;
};

const defaultSettings: SettingsState = {
  fullName: '',
  email: '',
  companyName: '',
  plan: 'Free',
  emailNotifications: true,
  weeklyReport: true,
};

export default function SettingsPage() {
  const { client } = useAuth();
  const { t } = useLanguage();
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [saved, setSaved] = useState('');

  useEffect(() => {
    const stored = window.localStorage.getItem('dashboard-settings');
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
        return;
      } catch {
        window.localStorage.removeItem('dashboard-settings');
      }
    }

    setSettings((current) => ({
      ...current,
      fullName: client?.fullName || '',
      email: client?.email || '',
      companyName: client?.companyName || '',
    }));
  }, [client]);

  const updateField = <K extends keyof SettingsState>(field: K, value: SettingsState[K]) => {
    setSettings((current) => ({ ...current, [field]: value }));
  };

  const save = () => {
    window.localStorage.setItem('dashboard-settings', JSON.stringify(settings));
    setSaved(t('settingsSaved'));
  };

  return (
    <main className="dashboard-main">
      <header className="page-shell-header">
        <div>
          <p className="eyebrow">{t('settingsEyebrow')}</p>
          <h1>{t('accountPreferences')}</h1>
          <p className="subtitle">{t('settingsSubtitle')}</p>
        </div>
        <button type="button" className="button-primary button-large" onClick={save}>
          <Save size={18} /> {t('saveChanges')}
        </button>
      </header>

      <section className="settings-grid">
        <article className="panel-surface dashboard-panel">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">{t('profileInfo')}</p>
              <h2>{t('accountDetails')}</h2>
            </div>
          </div>

          <div className="support-form mt-4">
            <div className="form-group">
              <label>{t('nameLabel')}</label>
              <input value={settings.fullName} onChange={(event) => updateField('fullName', event.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('emailLabel')}</label>
              <input value={settings.email} onChange={(event) => updateField('email', event.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('companyLabel')}</label>
              <input value={settings.companyName} onChange={(event) => updateField('companyName', event.target.value)} />
            </div>
            {saved && <p className="form-success">{saved}</p>}
          </div>
        </article>

        <article className="panel-surface dashboard-panel">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">{t('billingLabel')}</p>
              <h2>{t('planUsage')}</h2>
            </div>
            <CreditCard size={18} className="text-primary" />
          </div>

          <div className="settings-stack mt-4">
            <div className="setting-row">
              <span>{t('currentPlan')}</span>
              <select value={settings.plan} onChange={(event) => updateField('plan', event.target.value as SettingsState['plan'])}>
                <option>Free</option>
                <option>Pro</option>
                <option>Enterprise</option>
              </select>
            </div>
            <div className="dashboard-note">
              <p className="text-muted">{t('usageNote')}</p>
            </div>
            <button type="button" className="button-secondary">{t('upgradePlan')}</button>
          </div>
        </article>

        <article className="panel-surface dashboard-panel">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">{t('notificationsLabel')}</p>
              <h2>{t('alertsReports')}</h2>
            </div>
            <Bell size={18} className="text-primary" />
          </div>

          <div className="settings-stack mt-4">
            <label className="toggle-row">
              <input type="checkbox" checked={settings.emailNotifications} onChange={(event) => updateField('emailNotifications', event.target.checked)} />
              {t('emailNotifications')}
            </label>
            <label className="toggle-row">
              <input type="checkbox" checked={settings.weeklyReport} onChange={(event) => updateField('weeklyReport', event.target.checked)} />
              {t('weeklyReport')}
            </label>
          </div>
        </article>

        <article className="panel-surface dashboard-panel danger-panel">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">{t('dangerZone')}</p>
              <h2>{t('deleteAccountTitle')}</h2>
            </div>
            <Shield size={18} className="text-danger" />
          </div>

          <div className="dashboard-note mt-4">
            <p className="text-muted">{t('deleteAccountNote')}</p>
          </div>
          <button type="button" className="button-danger mt-4">
            <AlertTriangle size={18} /> {t('deleteAccountBtn')}
          </button>
        </article>
      </section>
    </main>
  );
}
