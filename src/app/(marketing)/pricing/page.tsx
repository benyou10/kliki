'use client';

import Link from 'next/link';
import { Check, Zap, Globe, Shield, BarChart3, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import '../pricing/pricing.css';

type Feature = { k: string; n?: string };
type Cell = { k?: string; v?: string };

const pricingPlans = [
  {
    name: 'Bronze',
    descKey: 'planBronzeDesc',
    price: '8,000',
    currency: 'DA',
    yearly: '80,000',
    badgeKey: null,
    features: [
      { k: 'pUpToProducts', n: '5,000' },
      { k: 'pUpToUsers', n: '15,000' },
      { k: 'fRealtime' },
      { k: 'fBasicAnalytics' },
      { k: 'fEmailSupport' },
      { k: 'fApiAccess' },
      { k: 'fInstantDeploy' },
    ] as Feature[],
    ctaKey: 'getStarted',
    highlighted: false,
    specs: { products: '5,000', users: '15,000', supportKey: 'supEmail' },
  },
  {
    name: 'Argent',
    descKey: 'planArgentDesc',
    price: '20,000',
    currency: 'DA',
    yearly: '200,000',
    badgeKey: 'badgePopular',
    features: [
      { k: 'pUpToProducts', n: '20,000' },
      { k: 'pUpToUsers', n: '40,000' },
      { k: 'fAdvRealtime' },
      { k: 'fAdvAnalytics' },
      { k: 'fPriorityChat' },
      { k: 'fWebhooks' },
      { k: 'fAdvApi' },
      { k: 'fEngineTuning' },
    ] as Feature[],
    ctaKey: 'getStarted',
    highlighted: true,
    specs: { products: '20,000', users: '40,000', supportKey: 'supChatEmail' },
  },
  {
    name: 'Or',
    descKey: 'planOrDesc',
    price: '55,000',
    currency: 'DA',
    yearly: '550,000',
    badgeKey: null,
    features: [
      { k: 'pUpToProducts', n: '50,000' },
      { k: 'pUpToUsers', n: '80,000' },
      { k: 'fMultiEngine' },
      { k: 'fRealtimeInsights' },
      { k: 'fPrioritySupport' },
      { k: 'fDedicatedDash' },
      { k: 'fFullApiWebhooks' },
      { k: 'fAlgoMatching' },
      { k: 'fMultiInstance' },
    ] as Feature[],
    ctaKey: 'getStarted',
    highlighted: false,
    specs: { products: '50,000', users: '80,000', supportKey: 'supPriority' },
  },
  {
    name: 'Platine',
    descKey: 'planPlatineDesc',
    price: '125,000',
    currency: 'DA',
    yearly: '1,250,000',
    badgeKey: 'badgeEnterprise',
    features: [
      { k: 'pUpToProducts', n: '100,000' },
      { k: 'pUpToUsers', n: '150,000' },
      { k: 'fUnlimitedEngines' },
      { k: 'fMlInsights' },
      { k: 'fDedicatedTeam' },
      { k: 'fCustomIntegrations' },
      { k: 'fGraphql' },
      { k: 'fWhiteLabel' },
      { k: 'fSla' },
      { k: 'fCustomMl' },
      { k: 'fInfraConsult' },
    ] as Feature[],
    ctaKey: 'contactSales',
    highlighted: false,
    specs: { products: '100,000', users: '150,000', supportKey: 'sup247' },
  },
];

const comparisonFeatures: { catKey: string; vals: Cell[] }[] = [
  { catKey: 'compMaxProducts', vals: [{ v: '5,000' }, { v: '20,000' }, { v: '50,000' }, { v: '100,000' }] },
  { catKey: 'compMaxUsers', vals: [{ v: '15,000' }, { v: '40,000' }, { v: '80,000' }, { v: '150,000' }] },
  { catKey: 'compRealtime', vals: [{ v: '✓' }, { v: '✓' }, { v: '✓' }, { v: '✓' }] },
  { catKey: 'compAnalytics', vals: [{ k: 'valBasic' }, { k: 'valAdvancedAB' }, { k: 'valRealtimeInsights' }, { k: 'valMlInsights' }] },
  { catKey: 'compSupport', vals: [{ k: 'supEmail' }, { k: 'supChatEmail' }, { k: 'supPriority' }, { k: 'sup247' }] },
  { catKey: 'compCustomInt', vals: [{ k: 'valNo' }, { k: 'valLimited' }, { k: 'valYes' }, { k: 'valFull' }] },
  { catKey: 'compWebhooks', vals: [{ k: 'valNo' }, { k: 'valYes' }, { k: 'valYes' }, { k: 'valYes' }] },
  { catKey: 'compApiLimit', vals: [{ k: 'valStandard' }, { k: 'valHigh' }, { k: 'valVeryHigh' }, { k: 'valCustom' }] },
  { catKey: 'compWhiteLabel', vals: [{ k: 'valNo' }, { k: 'valNo' }, { k: 'valLimited' }, { k: 'valYes' }] },
  { catKey: 'compMultiInstance', vals: [{ k: 'valLimited' }, { k: 'valYes' }, { k: 'valYes' }, { k: 'valUnlimited' }] },
];

const benefits = [
  { icon: Zap, titleKey: 'benInstantTitle', descKey: 'benInstantDesc' },
  { icon: BarChart3, titleKey: 'benAnalyticsTitle', descKey: 'benAnalyticsDesc' },
  { icon: Globe, titleKey: 'benAccurateTitle', descKey: 'benAccurateDesc' },
  { icon: Shield, titleKey: 'benSecureTitle', descKey: 'benSecureDesc' },
  { icon: Lightbulb, titleKey: 'benSelfTitle', descKey: 'benSelfDesc' },
  { icon: Globe, titleKey: 'benLocalTitle', descKey: 'benLocalDesc' },
];

export default function PricingPage() {
  const { t } = useLanguage();

  return (
    <main className="pricing-main">
      <div className="pricing-header">
        <h1>{t('pricingTitle')}</h1>
        <p>{t('pricingDesc')}</p>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-grid">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`pricing-card glass ${plan.highlighted ? 'featured' : ''}`}
          >
            {plan.badgeKey && <div className="pricing-badge">{t(plan.badgeKey)}</div>}

            <div>
              <h3 className="pricing-title">{plan.name}</h3>
              <p className="pricing-desc">{t(plan.descKey)}</p>
            </div>

            <div>
              <div className="pricing-price">
                {plan.price}
                <span className="currency">{plan.currency}</span>
              </div>
              <div className="pricing-period">{t('pricingPerMonth')}</div>
              <div className="pricing-yearly">{plan.yearly} {plan.currency}{t('pricingPerYear')} ({t('pricingYearlySave')})</div>
            </div>

            <div className="pricing-specs">
              <div className="spec-item">
                <span className="spec-label">{t('specProducts')}</span>
                <span className="spec-value">{plan.specs.products}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">{t('specUsers')}</span>
                <span className="spec-value">{plan.specs.users}{t('specPerMonth')}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">{t('specSupport')}</span>
                <span className="spec-value">{t(plan.specs.supportKey)}</span>
              </div>
            </div>

            <div className="pricing-features">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <Check size={18} />
                  <span>{feature.n ? t(feature.k).replace('{n}', feature.n) : t(feature.k)}</span>
                </div>
              ))}
            </div>

            <Link href="/dashboard/instances/new" className="button-primary w-100">
              {t(plan.ctaKey)}
            </Link>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <section className="pricing-benefits">
        <h2>{t('benefitsTitle')}</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div key={idx} className="benefit-card glass">
                <Icon size={32} className="benefit-icon" />
                <h4>{t(benefit.titleKey)}</h4>
                <p>{t(benefit.descKey)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pricing-comparison">
        <h2>{t('compTitle')}</h2>
        <div className="comparison-table glass">
          <div className="table-row header-row">
            <div className="table-cell feature-col">{t('compFeature')}</div>
            <div className="table-cell">Bronze</div>
            <div className="table-cell">Argent</div>
            <div className="table-cell">Or</div>
            <div className="table-cell">Platine</div>
          </div>
          {comparisonFeatures.map((feature, idx) => (
            <div key={idx} className="table-row">
              <div className="table-cell feature-col">{t(feature.catKey)}</div>
              {feature.vals.map((cell, i) => (
                <div key={i} className={`table-cell ${i === 1 ? 'highlight' : ''}`}>
                  {cell.k ? t(cell.k) : cell.v}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pricing-cta glass">
        <h2>{t('pricingCtaTitle')}</h2>
        <p>{t('pricingCtaDesc')}</p>
        <div className="cta-buttons">
          <Link href="/signup" className="button-primary">{t('pricingCtaPrimary')}</Link>
          <a href="mailto:sales@kliki.io" className="button-secondary">{t('contactSales')}</a>
        </div>
      </section>
    </main>
  );
}
