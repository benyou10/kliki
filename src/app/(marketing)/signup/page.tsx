'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Network } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import './signup.css';

export default function Signup() {
  const router = useRouter();
  const { signup, isLoggedIn } = useAuth();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signup(email, password, fullName, companyName);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('signupFailed'));
    }
    setLoading(false);
  };

  return (
    <main className="signup-main">
      <div className="signup-container glass">
        <div className="signup-header">
          <Network className="logo-icon center-icon" size={48} />
          <h2>{t('signupTitle')}</h2>
          <p>{t('signupSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {error && <p className="form-error">{error}</p>}
          <div className="form-group">
            <label htmlFor="fullName">{t('signupFullName')}</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('signupFullNamePh')}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyName">{t('signupCompany')}</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder={t('signupCompanyPh')}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('emailLabel')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@company.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('passwordLabel')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="button-primary full-width" disabled={loading}>
            {loading ? t('signupLoading') : t('signupButton')}
          </button>
        </form>

        <p className="login-link">
          {t('signupHaveAccount')} <Link href="/login" className="text-primary">{t('signupLoginLink')}</Link>
        </p>
      </div>
    </main>
  );
}
