'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import './footer.css';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer-main glass">
      <div className="container footer-container">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <div className="logo-mask-container footer-logo-size">
              {/* Dynamic Logo via Mask */}
            </div>
            <span>Kliki</span>
          </Link>
          <p className="footer-tagline">
            {t('footerTagline')}
          </p>
        </div>

        <div className="footer-links-group">
          <div className="footer-column">
            <h4>{t('integrations')}</h4>
            <Link href="/pricing">{t('pricing')}</Link>
            <Link href="/docs">{t('docs')}</Link>
            <Link href="/signup">{t('signup')}</Link>
            <Link href="/login">{t('login')}</Link>
          </div>
          
          <div className="footer-column">
            <h4>Solutions</h4>
            <Link href="/#ecommerce">{t('ecommerce')}</Link>
            <Link href="/#media">{t('media')}</Link>
            <Link href="/#research">{t('research')}</Link>
            <Link href="/docs#instances">Workspaces</Link>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <Link href="/contact">{t('contact')}</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/docs">Documentation</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} Kliki. Recommendation infrastructure for commerce teams.</p>
        <span className="badge glass">Production platform</span>
      </div>
    </footer>
  );
};

export default Footer;
