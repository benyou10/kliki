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
            <h4>{t('footerSolutions')}</h4>
            <Link href="/#ecommerce">{t('ecommerce')}</Link>
            <Link href="/#media">{t('media')}</Link>
            <Link href="/#research">{t('research')}</Link>
            <Link href="/docs#instances">{t('footerStores')}</Link>
          </div>

          <div className="footer-column">
            <h4>{t('footerCompany')}</h4>
            <Link href="/contact">{t('contact')}</Link>
            <Link href="/dashboard">{t('footerDashboard')}</Link>
            <Link href="/docs">{t('footerDocumentation')}</Link>
            <Link href="/pricing">{t('pricing')}</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} {t('footerRights')}</p>
        <span className="badge glass">{t('footerBadge')}</span>
      </div>
    </footer>
  );
};

export default Footer;
