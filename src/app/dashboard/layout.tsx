import React from 'react';
import Sidebar from '@/components/Sidebar';
import './dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-content-area">
        {children}
      </div>
    </div>
  );
}
