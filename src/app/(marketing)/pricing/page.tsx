'use client';

import Link from 'next/link';
import { Check, Zap, Globe, Shield, BarChart3, Lightbulb } from 'lucide-react';
import '../pricing/pricing.css';

const pricingPlans = [
  {
    name: 'Bronze',
    description: 'Perfect for small boutiques and growing online stores',
    price: '8,000',
    currency: 'DA',
    period: '/month',
    yearlyPrice: '80,000 DA/year (Save 16.67%)',
    badge: null,
    features: [
      'Up to 5,000 products',
      'Up to 15,000 active users/month',
      'Real-time recommendations',
      'Basic analytics dashboard',
      'Email support',
      'API access',
      'Instant deployment',
    ],
    cta: 'Get Started',
    highlighted: false,
    specs: {
      products: '5,000',
      users: '15,000/mo',
      support: 'Email',
    },
  },
  {
    name: 'Argent',
    description: 'For growing e-commerce platforms with multiple product lines',
    price: '20,000',
    currency: 'DA',
    period: '/month',
    yearlyPrice: '200,000 DA/year (Save 16.67%)',
    badge: 'POPULAR',
    features: [
      'Up to 20,000 products',
      'Up to 40,000 active users/month',
      'Advanced real-time recommendations',
      'Advanced analytics & A/B testing',
      'Priority email & chat support',
      'Webhooks & custom events',
      'Advanced API access',
      'Custom engine tuning',
    ],
    cta: 'Get Started',
    highlighted: true,
    specs: {
      products: '20,000',
      users: '40,000/mo',
      support: 'Chat + Email',
    },
  },
  {
    name: 'Or',
    description: 'For established e-commerce platforms and marketplaces',
    price: '55,000',
    currency: 'DA',
    period: '/month',
    yearlyPrice: '550,000 DA/year (Save 16.67%)',
    badge: null,
    features: [
      'Up to 50,000 products',
      'Up to 80,000 active users/month',
      'Multi-engine recommendations',
      'Real-time analytics & insights',
      'Priority support',
      'Dedicated dashboard',
      'Full API access + webhooks',
      'Custom algorithmic matching',
      'Multiple instance management',
    ],
    cta: 'Get Started',
    highlighted: false,
    specs: {
      products: '50,000',
      users: '80,000/mo',
      support: 'Priority',
    },
  },
  {
    name: 'Platine',
    description: 'For large-scale operations and enterprise requirements',
    price: '125,000',
    currency: 'DA',
    period: '/month',
    yearlyPrice: '1,250,000 DA/year (Save 16.67%)',
    badge: 'ENTERPRISE',
    features: [
      'Up to 100,000 products',
      'Up to 150,000 active users/month',
      'Unlimited recommendation engines',
      'Real-time analytics & ML insights',
      'Dedicated support team',
      'Custom integrations',
      'Full API access + GraphQL',
      'White-label options',
      'SLA guarantee',
      'Custom ML models',
      'Infrastructure consultation',
    ],
    cta: 'Contact Sales',
    highlighted: false,
    specs: {
      products: '100,000',
      users: '150,000/mo',
      support: '24/7 Dedicated',
    },
  },
];

const comparisonFeatures = [
  { category: 'Max Products', bronze: '5,000', argent: '20,000', or: '50,000', platine: '100,000' },
  { category: 'Max Active Users/Month', bronze: '15,000', argent: '40,000', or: '80,000', platine: '150,000' },
  { category: 'Real-time Recommendations', bronze: '✓', argent: '✓', or: '✓', platine: '✓' },
  { category: 'Analytics', bronze: 'Basic', argent: 'Advanced + A/B Testing', or: 'Real-time + Insights', platine: 'ML Insights' },
  { category: 'Support', bronze: 'Email', argent: 'Chat + Email', or: 'Priority', platine: '24/7 Dedicated' },
  { category: 'Custom Integration', bronze: 'No', argent: 'Limited', or: 'Yes', platine: 'Full' },
  { category: 'Webhooks', bronze: 'No', argent: 'Yes', or: 'Yes', platine: 'Yes' },
  { category: 'API Rate Limit', bronze: 'Standard', argent: 'High', or: 'Very High', platine: 'Custom' },
  { category: 'White Label', bronze: 'No', argent: 'No', or: 'Limited', platine: 'Yes' },
  { category: 'Multi-Instance Management', bronze: 'Limited', argent: 'Yes', or: 'Yes', platine: 'Unlimited' },
];

const benefits = [
  {
    icon: Zap,
    title: 'Instant Deployment',
    description: 'No training phase required. Get recommendations running immediately.',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Understand recommendation impact on conversion and revenue in real-time.',
  },
  {
    icon: Globe,
    title: 'Hypergraph-Based',
    description: 'Advanced mathematical framework for superior recommendation accuracy.',
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description: 'Enterprise-grade security with data protection and privacy compliance.',
  },
  {
    icon: Lightbulb,
    title: 'Self-Optimizing',
    description: 'Adapts to changing customer preferences in real-time.',
  },
  {
    icon: Globe,
    title: 'Localized Pricing',
    description: 'Native Algerian Dinar billing for local businesses.',
  },
];

export default function PricingPage() {
  return (
    <main className="pricing-main">
      <div className="pricing-header">
        <h1>Simple, Transparent Pricing in Algerian Dinar</h1>
        <p>Choose the plan that fits your recommendation engine needs. Each instance is independently priced with no hidden fees.</p>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-grid">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`pricing-card glass ${plan.highlighted ? 'featured' : ''}`}
          >
            {plan.badge && <div className="pricing-badge">{plan.badge}</div>}
            
            <div>
              <h3 className="pricing-title">{plan.name}</h3>
              <p className="pricing-desc">{plan.description}</p>
            </div>

            <div>
              <div className="pricing-price">
                {plan.price}
                <span className="currency">{plan.currency}</span>
              </div>
              <div className="pricing-period">{plan.period}</div>
              <div className="pricing-yearly">{plan.yearlyPrice}</div>
            </div>

            <div className="pricing-specs">
              <div className="spec-item">
                <span className="spec-label">Max Products</span>
                <span className="spec-value">{plan.specs.products}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Active Users</span>
                <span className="spec-value">{plan.specs.users}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Support</span>
                <span className="spec-value">{plan.specs.support}</span>
              </div>
            </div>

            <div className="pricing-features">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <Check size={18} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Link href="/dashboard/instances/new" className="button-primary w-100">
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <section className="pricing-benefits">
        <h2>Why Choose Kliki?</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div key={idx} className="benefit-card glass">
                <Icon size={32} className="benefit-icon" />
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pricing-comparison">
        <h2>Detailed Feature Comparison</h2>
        <div className="comparison-table glass">
          <div className="table-row header-row">
            <div className="table-cell feature-col">Feature</div>
            <div className="table-cell">Bronze</div>
            <div className="table-cell">Argent</div>
            <div className="table-cell">Or</div>
            <div className="table-cell">Platine</div>
          </div>
          {comparisonFeatures.map((feature, idx) => (
            <div key={idx} className="table-row">
              <div className="table-cell feature-col">{feature.category}</div>
              <div className="table-cell">{feature.bronze}</div>
              <div className="table-cell highlight">{feature.argent}</div>
              <div className="table-cell">{feature.or}</div>
              <div className="table-cell">{feature.platine}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pricing-cta glass">
        <h2>Ready to Deploy Your Recommendation Engine?</h2>
        <p>Each instance is independently managed and priced. Start with Bronze and scale as you grow.</p>
        <div className="cta-buttons">
          <Link href="/signup" className="button-primary">Start Your First Instance</Link>
          <a href="mailto:sales@kliki.io" className="button-secondary">Contact Sales</a>
        </div>
      </section>
    </main>
  );
}
