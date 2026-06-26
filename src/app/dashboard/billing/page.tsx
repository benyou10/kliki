import { prisma } from '@/lib/prisma';
import { CreditCard, CheckCircle2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import '../dashboard.css';

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
  const totalCustomers = await prisma.client.count();
  const totalInstances = await prisma.workspace.count();

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>Usage & Billing</h1>
          <p className="subtitle">Track workspace usage and manage the plan that supports your instance load.</p>
        </div>
      </header>

      <div className="dashboard-content-grid">
        <section className="dashboard-section glass flex-2">
          <h2>Current Plan</h2>
          <div className="billing-stats-grid mt-6">
            <div className="billing-stat-card glass p-4">
              <p className="text-muted text-sm">Connected workspaces</p>
              <h3 className="text-2xl font-bold mt-1">{totalCustomers}</h3>
            </div>
            <div className="billing-stat-card glass p-4">
              <p className="text-muted text-sm">Active instances</p>
              <h3 className="text-2xl font-bold mt-1">{totalInstances}</h3>
            </div>
          </div>
          <Link href="/pricing" className="button-primary mt-6 inline-flex">Review Plan</Link>
        </section>

        <section className="dashboard-section glass">
          <h2>Payment Method</h2>
          <div className="payment-card glass p-4 mt-4 flex-align gap-4">
            <div className="card-icon glass"><CreditCard size={24} /></div>
            <div>
              <p className="font-bold">No payment method configured</p>
              <p className="text-xs text-muted">Add a card or invoice profile to enable billing.</p>
            </div>
          </div>
          <Link href="/contact" className="text-button mt-4 inline-flex">Manage Method</Link>
        </section>
      </div>

      <section className="dashboard-section glass mt-4">
        <h2>Billing History</h2>
        <div className="empty-state py-16 text-center">
          <p>Billing history will appear once a workspace has an active plan and recorded usage.</p>
        </div>
      </section>
    </main>
  );
}
