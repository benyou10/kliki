'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import './docs.css';

export default function Docs() {
  const { t } = useLanguage();

  return (
    <div className="docs-layout">
      {/* Sidebar Navigation */}
      <aside className="docs-sidebar glass">
        <nav className="docs-nav">
          <div className="nav-group">
            <h4 className="nav-group-title">{t('docsNavGettingStarted')}</h4>
            <a href="#introduction" className="nav-item">{t('docsNavIntro')}</a>
            <a href="#how-it-works" className="nav-item">{t('docsNavHow')}</a>
            <a href="#quickstart" className="nav-item">{t('docsNavQuickstart')}</a>
          </div>
          
          <div className="nav-group">
            <h4 className="nav-group-title">{t('docsNavIntegration')}</h4>
            <a href="#shopify" className="nav-item">{t('docsNavShopify')}</a>
            <a href="#woocommerce" className="nav-item">{t('docsNavWoo')}</a>
            <a href="#rest-api" className="nav-item">{t('docsNavApi')}</a>
          </div>
          
          <div className="nav-group">
            <h4 className="nav-group-title">{t('docsNavConcepts')}</h4>
            <a href="#instances" className="nav-item">{t('docsNavInstances')}</a>
          </div>
        </nav>
      </aside>

      {/* Main Documentation Content */}
      <main className="docs-main">
        <div className="docs-content">
          <h1 id="introduction">{t('docsTitle')}</h1>
          <p className="lead">{t('docsIntro')}</p>

          <hr />

          <h2 id="how-it-works">{t('docsHowTitle')}</h2>
          <div className="docs-card glass">
            <h3>{t('docsHowSubtitle')}</h3>
            <p>{t('docsHowBody')}</p>
            <ul className="docs-list">
              <li>{t('docsHowBullet1')}</li>
              <li>{t('docsHowBullet2')}</li>
              <li>{t('docsHowBullet3')}</li>
            </ul>
          </div>

          <h2 id="quickstart" className="mt-10">{t('docsQuickstartTitle')}</h2>
          <p>{t('docsQuickstartBody')}</p>

          <div className="integration-grid-docs">
            <div className="int-card glass">
              <h4>{t('docsIntCard1Title')}</h4>
              <p>{t('docsIntCard1Desc')}</p>
            </div>
            <div className="int-card glass">
              <h4>{t('docsIntCard2Title')}</h4>
              <p>{t('docsIntCard2Desc')}</p>
            </div>
            <div className="int-card glass">
              <h4>{t('docsIntCard3Title')}</h4>
              <p>{t('docsIntCard3Desc')}</p>
            </div>
          </div>

          <hr />

          <h2 id="shopify">{t('docsShopifyTitle')}</h2>
          <p>{t('docsShopifyBody')}</p>

          <hr />

          <h2 id="woocommerce">{t('docsNavWoo')}</h2>
          <p>Use the ingestion flow to send views, clicks, add-to-cart actions, and purchases into the correct instance.</p>

          <hr />

          <h2 id="rest-api">{t('docsApiTitle')}</h2>
          <p>{t('docsApiBody')}</p>
          
          <div className="endpoint-block">
            <span className="method post">POST</span>
            <span className="path">/api/v1/instances/:instanceId/inject</span>
          </div>

          <div className="endpoint-block mt-3">
            <span className="method get">GET</span>
            <span className="path">/api/v1/instances/:instanceId/recommend?userId=&limit=</span>
          </div>

          <div className="code-block mt-4">
            <pre>
              <code>
{`{
  "userId": "usr_789",
  "itemId": "itm_456",
  "actionType": "view",
  "sessionId": "sess_001",
  "metadata": { "platform": "web" }
}`}
              </code>
            </pre>
          </div>

          <h2 id="instances" className="mt-10">{t('docsInstancesTitle')}</h2>
          <p>{t('docsInstancesBody')}</p>
        </div>
      </main>
    </div>
  );
}
