import { prisma } from '@/lib/prisma';
import '../dashboard.css';

export default async function DataPage() {
  const totalInstances = await prisma.workspace.count();
  const sources = await prisma.workspace.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>Data</h1>
          <p className="subtitle">Monitor the data layer that feeds your recommendation instances.</p>
        </div>
      </header>

      <div className="dashboard-content-grid">
        <section className="dashboard-section glass flex-2">
          <h2>Catalog overview</h2>
          <div className="metric-grid mt-4">
            <div className="metric-card">
              <span className="metric-label">Connected instances</span>
              <h3>{totalInstances}</h3>
              <p className="text-muted">Recommendation instances attached to your account.</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Data health</span>
              <h3>{totalInstances > 0 ? 'Ready' : 'Pending'}</h3>
              <p className="text-muted">Sync checks run after the first event batch arrives.</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Sync issues</span>
              <h3>{totalInstances > 0 ? '0' : 'N/A'}</h3>
              <p className="text-muted">Reported malformed events and product mapping errors.</p>
            </div>
          </div>

          <div className="dashboard-section glass mt-4">
            <div className="section-title-row">
              <h2>Item directory</h2>
              <form action="/dashboard/data">
                <button className="button-secondary" type="submit">Refresh</button>
              </form>
            </div>
            <div className="health-table mt-4">
              <div className="table-header">
                <span>Item</span>
                <span>Category</span>
                <span>Status</span>
                <span>Last synced</span>
              </div>
              <div className="table-row">
                <span>Inventory sync not configured</span>
                <span>-</span>
                <span className="status-indicator idle">Pending</span>
                <span>-</span>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-section glass">
          <div className="section-title-row">
            <h2>Live activity</h2>
          </div>
          <div className="graph-panel mt-4">
            <p className="text-muted">Interaction telemetry will populate this view once your recommendation endpoint receives injected events.</p>
          </div>

          <div className="dashboard-section glass mt-4">
            <h2>Data health</h2>
            <div className="metric-grid mt-4">
              <div className="metric-card">
                <span className="metric-label">Unmapped product IDs</span>
                <h3>{totalInstances > 0 ? '0' : 'N/A'}</h3>
              </div>
              <div className="metric-card">
                <span className="metric-label">Invalid event formats</span>
                <h3>{totalInstances > 0 ? '0' : 'N/A'}</h3>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
