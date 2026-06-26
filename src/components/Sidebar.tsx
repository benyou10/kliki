'use client';

import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  BarChart3, 
  Terminal, 
  Play, 
  CreditCard, 
  FileCode, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './sidebar.css';

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Overview', icon: <Activity size={20} />, path: '/dashboard' },
    { name: 'Instances', icon: <Cpu size={20} />, path: '/dashboard/engines' },
    { name: 'Data', icon: <Database size={20} />, path: '/dashboard/data' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/dashboard/analytics' },
    { name: 'API', icon: <Terminal size={20} />, path: '/dashboard/api' },
    { name: 'Playground', icon: <Play size={20} />, path: '/dashboard/playground' },
    { name: 'Billing', icon: <CreditCard size={20} />, path: '/dashboard/billing' },
    { name: 'Logs', icon: <FileCode size={20} />, path: '/dashboard/logs' },
    { name: 'Team', icon: <Users size={20} />, path: '/dashboard/team' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  return (
    <>
      <button
        type="button"
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen((current) => !current)}
        aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={mobileOpen}
        aria-controls="dashboard-sidebar"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div
        className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <aside id="dashboard-sidebar" className={`dashboard-sidebar ${mobileOpen ? 'open' : ''}`}>
        <Link href="/" className="sidebar-header">
          <div className="logo-mask-container sidebar-logo-size"></div>
          <span className="logo-text">Kliki</span>
        </Link>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`nav-item ${pathname === item.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link href="/" className="nav-item logout" onClick={() => setMobileOpen(false)}>
            <LogOut size={20} />
            Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}
