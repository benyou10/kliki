import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Activity, Database, ListChecks, Target } from 'lucide-react';
import './dashboard.css';

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const client = await prisma.client.findFirst();
  const totalInstances = await prisma.workspace.count();
  const activeInstances = await prisma.workspace.count({
    where: { status: 'active' }
  });
  const recentInstances = await prisma.workspace.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const bronzeCount = await prisma.workspace.count({ where: { subscriptionTier: 'Bronze' } });
  const argentCount = await prisma.workspace.count({ where: { subscriptionTier: 'Argent' } });
  const orCount = await prisma.workspace.count({ where: { subscriptionTier: 'Or' } });
  const platineCount = await prisma.workspace.count({ where: { subscriptionTier: 'Platine' } });

  const activeTracking = totalInstances > 0;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://138.68.90.21:8080';
  const latestEndpoint = recentInstances[0]
    ? `${apiUrl}/api/v1/instances/${recentInstances[0].springBootInstanceId}/inject`
    : '';

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Manage recommendation workspaces, keys, and live deployment status.</p>
        </div>
        <div className="status-badge glass flex-align gap-2">
          <span className="pulse-dot"></span>
          {activeInstances > 0 ? `${activeInstances} instances running` : 'No active instances'}
        </div>
      </header>

      <div className="dashboard-hero glass">
        <div>
          <p className="eyebrow">Workspace account</p>
          <h1>{client?.companyName || 'Your company'}</h1>
          <p className="subtitle">Manage multiple recommendation instances with different subscription tiers. Scale each workspace independently based on your needs.</p>
        </div>

        <div className="dashboard-status-card">
          <p className="text-muted">Account owner</p>
          <h3>{client?.fullName || 'Not signed up yet'}</h3>
          <p className="text-muted mt-3">Total instances</p>
          <h4>{totalInstances}</h4>
          <span className={`status-badge ${activeTracking ? 'active' : 'inactive'}`}>
            {activeTracking ? 'Active deployments' : 'No deployments'}
          </span>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="dashboard-section glass kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper" style={{ color: 'var(--primary)', background: 'rgba(107, 33, 168, 0.15)' }}>
              <Database size={24} />
            </div>
          </div>
          <div className="kpi-body">
            <h3 className="kpi-value">{totalInstances}</h3>
            <p className="kpi-name">Total instances</p>
          </div>
        </div>

        <div className="dashboard-section glass kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.15)' }}>
              <ListChecks size={24} />
            </div>
          </div>
          <div className="kpi-body">
            <h3 className="kpi-value">{activeInstances}</h3>
            <p className="kpi-name">Active now</p>
          </div>
        </div>

        <div className="dashboard-section glass kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)' }}>
              <Activity size={24} />
            </div>
          </div>
          <div className="kpi-body">
            <h3 className="kpi-value">{client ? 'Connected' : 'Pending'}</h3>
            <p className="kpi-name">Workspace status</p>
          </div>
        </div>

        <div className="dashboard-section glass kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper" style={{ color: '#7c3aed', background: 'rgba(124, 58, 237, 0.15)' }}>
              <Target size={24} />
            </div>
          </div>
          <div className="kpi-body">
            <h3 className="kpi-value">{bronzeCount}</h3>
            <p className="kpi-name">Bronze tier</p>
          </div>
        </div>

        <div className="dashboard-section glass kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon-wrapper" style={{ color: '#c0a080', background: 'rgba(192, 160, 128, 0.15)' }}>
              <Target size={24} />
            </div>
          </div>
          <div className="kpi-body">
            <h3 className="kpi-value">{argentCount}</h3>
            <p className="kpi-name">Argent tier</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <section className="dashboard-section glass flex-2">
          <div className="section-title-row">
            <h2 className="flex-align gap-2"><ListChecks size={20} /> Your instances</h2>
            <Link href="/docs#instances" className="button-secondary">Workspace setup</Link>
          </div>

          {recentInstances.length > 0 ? (
            <div className="health-table mt-4">
              <div className="table-header">
                <span>Instance Name</span>
                <span>Subscription</span>
                <span>Status</span>
                <span>Created</span>
              </div>
              {recentInstances.map((instance) => (
                <div key={instance.id} className="table-row">
                  <span>
                    <strong>{instance.name}</strong>
                    <br />
                    <small className="text-muted">{instance.instanceType || 'ecommerce'}</small>
                  </span>
                  <span>
                    <span 
                      className="status-badge" 
                      style={{
                        background: instance.subscriptionTier === 'Bronze' ? 'rgba(192, 160, 128, 0.15)' : 
                                   instance.subscriptionTier === 'Argent' ? 'rgba(192, 192, 192, 0.15)' :
                                   instance.subscriptionTier === 'Or' ? 'rgba(255, 215, 0, 0.15)' :
                                   'rgba(230, 230, 250, 0.15)',
                        color: instance.subscriptionTier === 'Bronze' ? '#8b6914' : 
                               instance.subscriptionTier === 'Argent' ? '#708090' : 
                               instance.subscriptionTier === 'Or' ? '#daa520' : '#6a5acd',
                        border: instance.subscriptionTier === 'Bronze' ? '1px solid rgba(192, 160, 128, 0.3)' :
                               instance.subscriptionTier === 'Argent' ? '1px solid rgba(192, 192, 192, 0.3)' :
                               instance.subscriptionTier === 'Or' ? '1px solid rgba(255, 215, 0, 0.3)' :
                               '1px solid rgba(230, 230, 250, 0.3)',
                      }}
                    >
                      {instance.subscriptionTier || 'Bronze'}
                    </span>
                  </span>
                  <span><span className={`status-indicator ${instance.status === 'active' ? 'online' : 'idle'}`}>{instance.status === 'active' ? 'Active' : 'Paused'}</span></span>
                  <span>{new Date(instance.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state py-16 text-center">
              <p>No recommendation instances yet. Deploy your first instance to get started.</p>
              <Link href="/docs#instances" className="button-primary mt-4 inline-block">Read workspace setup</Link>
            </div>
          )}
        </section>

        <section className="dashboard-section glass">
          <div className="section-title-row">
            <h2 className="flex-align gap-2"><Database size={20} /> Plan breakdown</h2>
          </div>

          <div className="metric-grid mt-4">
            <div className="metric-card">
              <span className="metric-label">Bronze Tier</span>
              <h3>{bronzeCount}</h3>
              <p className="text-muted">8,000 DA/month</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Argent Tier</span>
              <h3>{argentCount}</h3>
              <p className="text-muted">20,000 DA/month</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Or Tier</span>
              <h3>{orCount}</h3>
              <p className="text-muted">55,000 DA/month</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Platine Tier</span>
              <h3>{platineCount}</h3>
              <p className="text-muted">125,000 DA/month</p>
            </div>
          </div>

          <div className="dashboard-section glass mt-4" style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '20px' }}>
            <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
              Each workspace operates independently with its own subscription tier, API key, and analytics. You can run multiple instances with different tiers simultaneously. All pricing is in Algerian Dinar (DA).
            </p>
          </div>
        </section>
      </div>

      <section className="dashboard-section glass mt-4">
        <div className="section-title-row">
          <h2 className="flex-align gap-2"><Activity size={20} /> API endpoints</h2>
        </div>

        <div className="api-reference mt-4">
          <div className="api-card glass">
            <div className="api-card-title">Deploy Instance</div>
            <div className="api-path">POST /api/v1/instances</div>
            <div className="api-description">Create a new recommendation engine instance with specified subscription tier.</div>
          </div>
          <div className="api-card glass">
            <div className="api-card-title">List Instances</div>
            <div className="api-path">GET /api/v1/instances</div>
            <div className="api-description">Fetch all recommendation instances for your account.</div>
          </div>
          <div className="api-card glass">
            <div className="api-card-title">Inject Events</div>
            <div className="api-path">POST /api/v1/instances/{'{instanceId}'}/inject</div>
            <div className="api-description">Send user events to train the recommendation engine.</div>
          </div>
          <div className="api-card glass">
            <div className="api-card-title">Get Recommendations</div>
            <div className="api-path">GET /api/v1/instances/{'{instanceId}'}/recommend</div>
            <div className="api-description">Retrieve personalized recommendations from any instance.</div>
          </div>
        </div>
      </section>
    </main>
  );
}
