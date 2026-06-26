import { prisma } from '@/lib/prisma';
import { Info } from 'lucide-react';
import '../dashboard.css';

function formatLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export default async function AnalyticsPage() {
  const totalCustomers = await prisma.client.count();
  const totalInstances = await prisma.workspace.count();
  const recentWorkspaces = await prisma.workspace.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>Analytics</h1>
          <p className="subtitle">View performance metrics for the recommendation instances in your workspace.</p>
        </div>
      </header>

      <div className="dashboard-content-grid">
        <section className="dashboard-section glass flex-2">
          <h2>Live metrics</h2>
          <div className="metric-grid mt-4">
            <div className="metric-card">
              <span className="metric-label">Clients registered</span>
              <h3>{formatLabel(totalCustomers, 'client', 'clients')}</h3>
            </div>
            <div className="metric-card">
              <span className="metric-label">Instances provisioned</span>
              <h3>{formatLabel(totalInstances, 'instance', 'instances')}</h3>
            </div>
            <div className="metric-card">
              <span className="metric-label">Recent instances</span>
              <h3>{recentWorkspaces.length}</h3>
            </div>
            <div className="metric-card">
              <span className="metric-label">Recommendation traffic</span>
              <h3>{totalInstances > 0 ? 'Awaiting events' : 'No traffic yet'}</h3>
            </div>
          </div>

          <div className="dashboard-section glass mt-4">
            <div className="section-title-row">
              <h2>Conversion insights</h2>
              <span className="text-muted">Live trend data appears after user interactions are injected.</span>
            </div>
            <div className="metric-card mt-4">
              <p className="text-muted">This area will surface conversion lift and recommendation impact once your instance starts receiving events from your storefront.</p>
            </div>
          </div>
        </section>

        <section className="dashboard-section glass">
          <h2>Top clusters</h2>
          <div className="metric-grid mt-4">
            {recentWorkspaces.length > 0 ? (
              recentWorkspaces.map((workspace) => (
                <div key={workspace.id} className="metric-card">
                  <span className="metric-label">{workspace.name}</span>
                  <h3>{workspace.subscriptionTier || 'Starter'}</h3>
                  <p className="text-muted">Instance ID: {workspace.springBootInstanceId}</p>
                </div>
              ))
            ) : (
              <div className="metric-card">
                <span className="metric-label">No clusters yet</span>
                <p className="text-muted">Create a recommendation instance to see top-performing deployments and their health.</p>
              </div>
            )}
          </div>

          <div className="dashboard-section glass mt-4">
            <div className="section-title-row">
              <h2 className="flex-align gap-2"><Info size={20} /> Insight</h2>
            </div>
            <p className="text-muted mt-4">Analytics will update once events flow through the recommendation API and the engine begins learning from interactions.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
