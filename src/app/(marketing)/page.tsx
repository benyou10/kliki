'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, GitCommit, Layers, Code, Play, ShoppingCart, Film, Search, CheckCircle2, ArrowRight, ShieldCheck, Gauge } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import './page.css';

export default function Home() {
  const { t } = useLanguage();
  
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const capabilityNodes = [
    { name: 'Workspaces', icon: <Layers size={18} />, x: [0, 20, 0], y: [0, -30, 0], delay: 0, color: '#8b5cf6' },
    { name: 'Events', icon: <Zap size={18} />, x: [0, -25, 0], y: [0, 25, 0], delay: 1, color: '#14b8a6' },
    { name: 'API Keys', icon: <ShieldCheck size={18} />, x: [0, 15, 0], y: [0, 35, 0], delay: 0.5, color: '#f59e0b' },
    { name: 'Insights', icon: <Gauge size={18} />, x: [0, -20, 0], y: [0, -25, 0], delay: 1.5, color: '#60a5fa' }
  ];

  return (
    <main className="landing-main">
      {/* SECTION 1: HERO */}
      <section className="hero-section container">
        <motion.div 
          className="hero-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <motion.div className="hero-badge glass">
            <span>■</span>
            <span>{t('prototype')}</span>
          </motion.div>
          
          <h1 className="hero-title">
            {t('heroTitle').split('[').map((part, i) => {
              if (part.includes(']')) {
                const [highlight, rest] = part.split(']');
                return (
                  <React.Fragment key={i}>
                    <span className="text-gradient">{highlight}</span>
                    {rest}
                  </React.Fragment>
                );
              }
              return part;
            })}
          </h1>
          
          <p className="hero-subtitle">
            {t('heroSubtitle')}
          </p>
          
          <div className="hero-cta">
            <Link href="/signup" className="button-primary hero-btn">{t('signup')}</Link>
            <Link href="/docs" className="button-secondary hero-btn">{t('readDocs')}</Link>
          </div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="hypergraph-container">
            {/* Main Central Node */}
            <div className="floating-node node-main">
              <div className="logo-mask-container hero-logo-size">
                {/* Dynamic Hero Logo via Mask */}
              </div>
              <span className="node-label-main">Kliki</span>
            </div>

            {/* Capability Nodes */}
            {capabilityNodes.map((tech, i) => (
              <motion.div 
                key={tech.name}
                className={`floating-node node-tech tech-${i} glass`}
                animate={{ x: tech.x, y: tech.y }}
                transition={{ repeat: Infinity, duration: 6 + i, ease: "easeInOut", delay: tech.delay }}
                style={{ borderColor: `${tech.color}44` }}
              >
                <div className="tech-icon-wrapper" style={{ color: tech.color }}>
                  {tech.icon}
                </div>
                <span className="tech-name">{tech.name}</span>
              </motion.div>
            ))}

            {/* Connection Lines (Visual Decor) */}
            <div className="connection-mesh">
              <div className="mesh-line line-1"></div>
              <div className="mesh-line line-2"></div>
              <div className="mesh-line line-3"></div>
            </div>

            <div className="orbit-circle orbit-1"></div>
            <div className="orbit-circle orbit-2"></div>
          </div>
        </motion.div>
      </section>

      {/* SECTION: COMPARISON */}
      <section className="comparison-section glass-section">
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="section-title">{t('whyChoose')}</h2>
            <p className="section-desc">{t('whyDesc')}</p>
          </motion.div>

          <div className="comparison-grid">
            <motion.div className="comparison-card glass" variants={fadeUp} initial="hidden" whileInView="visible">
              <h3 className="text-muted">{t('classicalAI')}</h3>
              <ul className="comparison-list">
                <li><span className="icon-no">✕</span> Shows the same products to every customer</li>
                <li><span className="icon-no">✕</span> Needs weeks of setup and data collection</li>
                <li><span className="icon-no">✕</span> Expensive to maintain and update</li>
                <li><span className="icon-no">✕</span> Gets it wrong for new customers</li>
              </ul>
            </motion.div>

            <motion.div className="comparison-card highlight-card" variants={fadeUp} initial="hidden" whileInView="visible">
              <div className="recommend-label">{t('kliki')}</div>
              <ul className="comparison-list">
                <li><span className="icon-yes">✓</span> {t('instantLearning')}</li>
                <li><span className="icon-yes">✓</span> {t('realTime')}</li>
                <li><span className="icon-yes">✓</span> {t('lowCompute')}</li>
                <li><span className="icon-yes">✓</span> {t('contextAware')}</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: DOMAINS */}
      <section className="segments-section container">
        <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="section-title">{t('builtFor')}</h2>
          <p className="section-desc">{t('builtForDesc')}</p>
        </motion.div>

        <div className="segments-grid">
          <motion.div className="segment-card glass" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="segment-icon-wrapper"><ShoppingCart size={28} /></div>
            <h3>{t('ecommerce')}</h3>
            <p>{t('ecommerceDesc')}</p>
          </motion.div>
          
          <motion.div className="segment-card glass" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="segment-icon-wrapper"><Film size={28} /></div>
            <h3>{t('media')}</h3>
            <p>{t('mediaDesc')}</p>
          </motion.div>

          <motion.div className="segment-card glass" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="segment-icon-wrapper"><Search size={28} /></div>
            <h3>{t('research')}</h3>
            <p>{t('researchDesc')}</p>
          </motion.div>
        </div>
      </section>

      {/* SECTION: INTEGRATIONS */}
      <section className="integrations-showcase glass-section">
        <div className="container">
          <div className="integrations-layout">
            <motion.div className="integrations-text" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="section-title">{t('builtInConnectors')}</h2>
              <p>{t('builtInDesc')}</p>
              
              <div className="platform-list">
                <div className="platform-item"><CheckCircle2 className="text-primary" size={20} /> <span><strong>Workspace isolation:</strong> Each customer account keeps its own data and key.</span></div>
                <div className="platform-item"><CheckCircle2 className="text-primary" size={20} /> <span><strong>Live instance status:</strong> Monitor health, uptime, and event flow from the dashboard.</span></div>
                <div className="platform-item"><CheckCircle2 className="text-primary" size={20} /> <span><strong>API-first workflow:</strong> Send events and fetch recommendations from the same control plane.</span></div>
              </div>
            </motion.div>

            <motion.div className="integrations-logos" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
               <div className="logo-float shopify glass">Workspace</div>
               <div className="logo-float woo glass">Instance</div>
               <div className="logo-float react glass">API</div>
               <div className="logo-float node glass">Insights</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4: INTEGRATION & HOW IT WORKS */}
      <section className="integration-section container">
        <div className="integration-container">
          <motion.div className="integration-content" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="section-title">Deploy, Observe, and Iterate.</h2>
            <ul className="checklist">
              <li><GitCommit className="check-icon text-primary" size={24} /> <strong>Clear setup:</strong> Create the workspace, instance, and key in one flow.</li>
              <li><Layers className="check-icon text-primary" size={24} /> <strong>Always current:</strong> Events and live status update as traffic arrives.</li>
              <li><Code className="check-icon text-primary" size={24} /> <strong>API-first:</strong> Connect storefronts, marketplaces, or content apps.</li>
            </ul>
            <Link href="/docs" className="button-secondary push-down">See the docs <ArrowRight size={18} /></Link>
          </motion.div>
          
          <motion.div className="integration-code glass" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="code-header">
              <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
              <span className="file-name">recommender.ts</span>
            </div>
            <pre>
              <code>
{`// 1. Initialize your client with the workspace API key
const engine = new Kliki(API_KEY);

// 2. Track the user action for this instance
await engine.track({
  user: 'user_99',
  action: 'purchase',
  items: ['prod_1', 'prod_2'],
  metadata: { wilaya: 'alger', platform: 'mobile' }
});

// 3. Request recommendations for the same instance
const suggestions = await engine.getSimilar(
  'user_99', 
  { limit: 10 }
);`}
              </code>
            </pre>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section className="cta-section container">
        <motion.div className="cta-box glass" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2>{t('readyToRev')}</h2>
          <p>{t('scaleIntel')}</p>
          <div className="hero-cta justify-center">
            <Link href="/signup" className="button-primary">{t('signup')}</Link>
            <Link href="/contact" className="button-secondary">{t('contactSales')}</Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
