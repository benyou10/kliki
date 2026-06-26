'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Network } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import './login.css';

export default function Login() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('loginFailed'));
    }
    setLoading(false);
  };

  return (
    <main className="login-main">
      <div className="login-container glass">
        <div className="login-header">
          <Network className="logo-icon center-icon" size={48} />
          <h2>{t('loginTitle')}</h2>
          <p>{t('loginSubtitle')}</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">{t('emailLabel')}</label>
            <input
              type="email"
              id="email"
              placeholder="john@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={loading} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('passwordLabel')}</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={loading} 
            />
          </div>

          <button type="submit" className="button-primary full-width" disabled={loading}>
            {loading ? t('loginLoading') : t('loginButton')}
          </button>
        </form>

        <p className="signup-link">
          {t('loginNoAccount')} <Link href="/signup" className="text-primary">{t('loginSignupLink')}</Link>
        </p>
      </div>
    </main>
  );
}
