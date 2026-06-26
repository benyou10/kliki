'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, Globe, ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import './navbar.css';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isLoggedIn, client, logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowLang(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-container container">
        <Link href="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-mask-container nav-logo-size">
            {/* The SVG is applied via mask-image in CSS to allow dynamic coloring */}
          </div>
          <span className="logo-text">Kliki</span>
        </Link>
        
        <button
          type="button"
          className="navbar-menu-toggle"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link href="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/pricing" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('pricing')}</Link>
          <Link href="/docs" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('docs')}</Link>
          <Link href="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('contact')}</Link>
        </div>

        <div className="navbar-actions">
          {mounted && (
            <div className="lang-selector-container">
              <button 
                className="lang-toggle"
                onClick={() => setShowLang(!showLang)}
              >
                <Globe size={18} />
                <span>{language}</span>
                <ChevronDown size={14} className={showLang ? 'rotate' : ''} />
              </button>
              
              {showLang && (
                <div className="lang-dropdown glass">
                  <button onClick={() => { setLanguage('EN'); setShowLang(false); }}>English</button>
                  <button onClick={() => { setLanguage('FR'); setShowLang(false); }}>Français</button>
                  <button onClick={() => { setLanguage('AR'); setShowLang(false); }}>العربية</button>
                </div>
              )}
            </div>
          )}

          {mounted && (
            <button 
              className="theme-toggle" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          {mounted && isLoggedIn && client ? (
            <>
              <span className="nav-user-info" title={client.email}>
                {client.companyName}
              </span>
              <Link href="/dashboard" className="nav-link button-secondary">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="nav-link button-danger"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('login')}</Link>
              <Link href="/signup" className="button-primary nav-button" onClick={() => setMobileMenuOpen(false)}>{t('signup')}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
