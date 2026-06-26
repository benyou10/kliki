import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus, Search, MoreVertical, Play, Settings2 } from 'lucide-react';
import '../dashboard.css';

export const dynamic = 'force-dynamic';

export default async function EnginesPage() {
  const instances = await prisma.workspace.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>Instances</h1>
          <p className="subtitle">Provision and monitor your hypergraph recommendation clusters.</p>
        </div>
        <Link href="/dashboard/instances/new" className="button-primary flex-align gap-2">
          <Plus size={20} /> Create New Instance
        </Link>
      </header>

      <section className="dashboard-section glass">
        <div className="section-title-row">
          <div className="search-box glass flex-1">
            <Search size={18} />
            <input type="text" placeholder="Search instances..." />
          </div>
        </div>

        {instances.length > 0 ? (
          <div className="health-table mt-4">
            <div className="table-header">
              <span>Instance ID</span>
              <span>Name</span>
              <span>Status</span>
              <span>Region</span>
              <span>Created</span>
              <span>Actions</span>
            </div>
            {instances.map((instance) => (
              <div key={instance.id} className="table-row">
                <span>{instance.springBootInstanceId}</span>
                <span>
                  <strong>{instance.name}</strong>
                  <br />
                  <small className="text-muted">{instance.subscriptionTier || 'Starter'}</small>
                </span>
                <span><span className="status-indicator online">Live</span></span>
                <span>{instance.platformType ? instance.platformType : 'Global'}</span>
                <span>{new Date(instance.createdAt).toLocaleDateString()}</span>
                <span className="flex-align gap-2">
                  <button className="icon-btn" type="button"><Play size={16} /></button>
                  <Link href={`/dashboard/instances/${instance.id}`} className="icon-btn"><Settings2 size={16} /></Link>
                  <button className="icon-btn" type="button"><MoreVertical size={16} /></button>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state py-16 text-center">
            <p>No instances have been created yet.</p>
            <Link href="/dashboard/instances/new" className="button-primary mt-4 inline-block">Create your first instance</Link>
          </div>
        )}
      </section>
    </main>
  );
}
