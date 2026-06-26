'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export function DashboardAccountCard() {
  const { client, isLoggedIn } = useAuth();

  return (
    <div className="dashboard-status-card mt-4" style={{ maxWidth: '420px' }}>
      <p className="text-muted">Account owner</p>
      <h3>{isLoggedIn && client ? client.fullName || client.companyName || client.email : 'Not signed in yet'}</h3>
      <p className="text-muted mt-2">{isLoggedIn && client ? client.companyName || client.email : 'Sign in to view your workspace details.'}</p>
    </div>
  );
}