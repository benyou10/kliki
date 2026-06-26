'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, Globe, ChevronDown, LogOut } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import './navbar.css';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isLoggedIn, client, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showLang, setShowLang] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-container container">
        <Link href="/" className="navbar-logo">
          <div className="logo-mask-container nav-logo-size">
            {/* The SVG is applied via mask-image in CSS to allow dynamic coloring */}
          </div>
          <span className="logo-text">Kliki</span>
        </Link>
        
        <div className="navbar-links">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/pricing" className="nav-link">{t('pricing')}</Link>
          <Link href="/docs" className="nav-link">{t('docs')}</Link>
          <Link href="/contact" className="nav-link">{t('contact')}</Link>
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
              <Link href="/login" className="nav-link">{t('login')}</Link>
              <Link href="/signup" className="button-primary nav-button">{t('signup')}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
