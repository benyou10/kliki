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
        <div className="navbar-top-row">
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
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="navbar-mobile-panel"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="navbar-desktop-content">
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
                      type="button"
                      className="lang-toggle"
                      onClick={() => setShowLang(!showLang)}
                    >
                      <Globe size={18} />
                      <span>{language}</span>
                      <ChevronDown size={14} className={showLang ? 'rotate' : ''} />
                    </button>

                    {showLang && (
                      <div className="lang-dropdown glass">
                        <button type="button" onClick={() => { setLanguage('EN'); setShowLang(false); }}>English</button>
                        <button type="button" onClick={() => { setLanguage('FR'); setShowLang(false); }}>Français</button>
                        <button type="button" onClick={() => { setLanguage('AR'); setShowLang(false); }}>العربية</button>
                      </div>
                    )}
                  </div>
                )}

                {mounted && (
                  <button
                    type="button"
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
                    <Link href="/dashboard" className="nav-link button-secondary nav-action-link">
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="nav-link button-danger nav-action-icon"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="nav-link nav-action-link">{t('login')}</Link>
                    <Link href="/signup" className="button-primary nav-button nav-action-link">{t('signup')}</Link>
                  </>
                )}
              </div>
          </div>
        </div>

        <div
          className={`navbar-backdrop ${mobileMenuOpen ? 'open' : ''}`}
          aria-hidden="true"
          style={{
            display: mobileMenuOpen ? 'block' : 'none',
            opacity: mobileMenuOpen ? 1 : 0,
            pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          }}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div id="navbar-mobile-panel" className={`navbar-mobile-panel ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="navbar-mobile-panel-header">
            <span>Menu</span>
            <button type="button" className="navbar-mobile-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu">
              <X size={18} />
            </button>
          </div>

          <div className="navbar-mobile-links">
            <Link href="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/pricing" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('pricing')}</Link>
            <Link href="/docs" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('docs')}</Link>
            <Link href="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('contact')}</Link>
          </div>

          <div className="navbar-mobile-actions">
            {mounted && (
              <div className="lang-selector-container mobile-lang-selector">
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
                <div className="mobile-user-card">
                  <span className="nav-user-info mobile-user-company" title={client.email}>
                    {client.companyName}
                  </span>
                  <span className="mobile-user-email">{client.email}</span>
                </div>
                <Link href="/dashboard" className="nav-link button-secondary" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="nav-link button-danger"
                  title="Logout"
                  type="button"
                >
                  <LogOut size={18} />
                  Logout
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
      </div>
    </nav>
  );
};

export default Navbar;
