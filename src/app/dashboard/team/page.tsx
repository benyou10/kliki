import { prisma } from '@/lib/prisma';
import { Users, UserPlus, Shield, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import '../dashboard.css';

export default async function TeamPage() {
  const members = await prisma.client.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>Team Access</h1>
          <p className="subtitle">Review the people who can access this recommendation workspace.</p>
        </div>
        <a href="mailto:sales@kliki.io?subject=Request%20team%20access" className="button-primary flex-align gap-2">
          <UserPlus size={20} /> Invite Member
        </a>
      </header>

      <section className="dashboard-section glass">
        {members.length > 0 ? (
          <div className="health-table">
            <div className="table-header">
              <span>Member</span>
              <span>Role</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {members.map((member, index) => (
              <div key={member.email} className="table-row">
                <div className="flex-align gap-3">
                  <div className="avatar-placeholder glass">{member.fullName?.charAt(0) ?? member.email.charAt(0)}</div>
                  <div>
                    <div className="font-bold">{member.fullName || member.email}</div>
                    <div className="text-xs text-muted">{member.email}</div>
                  </div>
                </div>
                <div className="flex-align gap-2">
                  <Shield size={16} className="text-primary" />
                  {index === 0 ? 'Owner' : 'Member'}
                </div>
                <span><span className={`status-indicator ${member.id ? 'online' : 'idle'}`}>Active</span></span>
                <a className="icon-btn" href={`mailto:${member.email}`} title={`Email ${member.email}`}>
                  <MoreVertical size={16} />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state py-16 text-center">
            <p>No team members have been added yet.</p>
          </div>
        )}
      </section>
    </main>
  );
}
