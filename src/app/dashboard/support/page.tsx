'use client';

import Link from 'next/link';
import { Mail, BookOpen, LifeBuoy, CircleCheck, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import '../dashboard.css';

export default function SupportPage() {
  const { t } = useLanguage();

  return (
    <main className="dashboard-main">
      <header className="page-shell-header">
        <div>
          <p className="eyebrow">{t('supportEyebrow')}</p>
          <h1>{t('helpDocs')}</h1>
          <p className="subtitle">{t('supportSubtitle')}</p>
        </div>
      </header>

      <section className="support-grid">
        <article className="panel-surface dashboard-panel">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">{t('faqEyebrow')}</p>
              <h2>{t('commonQuestions')}</h2>
            </div>
          </div>

          <div className="faq-list mt-4">
            <details open>
              <summary>{t('faqQ1')}</summary>
              <p>{t('faqA1')}</p>
            </details>
            <details>
              <summary>{t('faqQ2')}</summary>
              <p>{t('faqA2')}</p>
            </details>
            <details>
              <summary>{t('faqQ3')}</summary>
              <p>{t('faqA3')}</p>
            </details>
          </div>
        </article>

        <article className="panel-surface dashboard-panel">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">{t('linksEyebrow')}</p>
              <h2>{t('quickResources')}</h2>
            </div>
          </div>

          <div className="resource-list mt-4">
            <Link href="/docs" className="resource-card">
              <BookOpen size={18} /> {t('documentationLabel')}
            </Link>
            <Link href="/dashboard/integration" className="resource-card">
              <ExternalLink size={18} /> {t('integrationPageLabel')}
            </Link>
            <a href="mailto:support@kliki.dz" className="resource-card">
              <Mail size={18} /> {t('contactSupport')}
            </a>
            <a href="/" className="resource-card">
              <CircleCheck size={18} /> {t('statusPageLabel')}
            </a>
          </div>
        </article>

        <article className="panel-surface dashboard-panel support-form-card">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">{t('contact')}</p>
              <h2>{t('sendMessage')}</h2>
            </div>
          </div>

          <form className="support-form mt-4">
            <div className="form-group">
              <label>{t('nameLabel')}</label>
              <input type="text" placeholder={t('contactNamePh')} />
            </div>
            <div className="form-group">
              <label>{t('emailLabel')}</label>
              <input type="email" placeholder="you@company.com" />
            </div>
            <div className="form-group">
              <label>{t('messageLabel')}</label>
              <textarea rows={5} placeholder={t('phMessage')} />
            </div>
            <button type="button" className="button-primary">
              <LifeBuoy size={18} /> {t('contactSupport')}
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
