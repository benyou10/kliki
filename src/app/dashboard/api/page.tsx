import { prisma } from '@/lib/prisma';
import { Key, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import '../dashboard.css';

function maskKey(key: string) {
  return key.replace(/.(?=.{4})/g, '*');
}

export default async function APIPage() {
  const workspaces = await prisma.workspace.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>API & Integration</h1>
          <p className="subtitle">Manage workspace keys and review the instance endpoints used by your recommendation workloads.</p>
        </div>
        <Link href="/dashboard/instances/new" className="button-primary">Deploy instance</Link>
      </header>

      <section className="dashboard-section glass">
        <div className="section-title-row">
          <h2 className="flex-align gap-2"><Key size={20} /> Workspace Keys</h2>
        </div>

        {workspaces.length > 0 ? (
          <div className="health-table mt-4">
            <div className="table-header">
              <span>Name</span>
              <span>Key</span>
              <span>Status</span>
              <span>Created</span>
              <span>Actions</span>
            </div>
            {workspaces.map((workspace) => (
              <div key={workspace.id} className="table-row">
                <span>{workspace.name}</span>
                <code className="glass-code">{maskKey(workspace.apiKey)}</code>
                <span><span className="status-indicator online">Active</span></span>
                <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
                <Link href={`/dashboard/instances/${workspace.id}`} className="icon-btn" title="Open workspace details">
                  <ExternalLink size={16} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state py-12 text-center">
            <p>No workspace keys are available yet. Deploy an instance to generate your first key.</p>
          </div>
        )}
      </section>

      <div className="dashboard-content-grid mt-4">
        <section className="dashboard-section glass flex-2">
          <div className="section-title-row">
            <h2 className="flex-align gap-2"><Terminal size={20} /> Endpoints</h2>
          </div>
          <div className="endpoint-list mt-4">
            <div className="endpoint-item glass p-4 mb-4">
              <div className="flex-align justify-between mb-2">
                <span className="method post">POST</span>
                <code className="text-primary">/api/v1/instances</code>
              </div>
              <p className="text-sm opacity-70">Create a workspace instance and assign its API key.</p>
            </div>
            <div className="endpoint-item glass p-4 mb-4">
              <div className="flex-align justify-between mb-2">
                <span className="method get">GET</span>
                <code className="text-primary">/api/v1/instances/:instanceId/recommend</code>
              </div>
              <p className="text-sm opacity-70">Fetch personalized recommendations for a user or session.</p>
            </div>
            <div className="endpoint-item glass p-4 mb-4">
              <div className="flex-align justify-between mb-2">
                <span className="method post">POST</span>
                <code className="text-primary">/api/v1/instances/:instanceId/inject</code>
              </div>
              <p className="text-sm opacity-70">Send views, clicks, and purchase events into an instance.</p>
            </div>
          </div>
        </section>

        <section className="dashboard-section glass">
          <h2 className="flex-align gap-2"><ShieldCheck size={20} /> Security</h2>
          <p className="text-muted mt-4">All requests must use HTTPS and include the workspace API key in the X-API-Key header.</p>
          <p className="text-muted mt-4">Keys are workspace-scoped. Rotate them if ownership or deployment boundaries change.</p>
          <Link href="/docs#rest-api" className="button-secondary mt-6 w-100 flex-align justify-center gap-2">
            Read API docs <ExternalLink size={16} />
          </Link>
        </section>
      </div>
    </main>
  );
}
