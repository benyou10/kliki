'use client';

import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard,
  Boxes,
  Link2,
  Settings,
  LifeBuoy,
  Plus,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import './sidebar.css';

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { name: t('navDashboard'), icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: t('navInstances'), icon: <Boxes size={20} />, path: '/dashboard/instances' },
    { name: t('navIntegration'), icon: <Link2 size={20} />, path: '/dashboard/integration' },
    { name: t('navSettings'), icon: <Settings size={20} />, path: '/dashboard/settings' },
    { name: t('navSupport'), icon: <LifeBuoy size={20} />, path: '/dashboard/support' },
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
          <Link href="/dashboard/instances/new" className="sidebar-cta" onClick={() => setMobileOpen(false)}>
            <Plus size={18} /> {t('sidebarCreate')}
          </Link>
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
            {t('backToSite')}
          </Link>
        </div>
      </aside>
    </>
  );
}
