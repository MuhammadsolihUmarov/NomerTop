'use client';

import Link from 'next/link';
import { useTranslation } from './LanguageProvider';
import { Globe, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { locale, setLocale, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showLangs, setShowLangs] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'uz', label: 'O‘zbekcha', flag: '🇺🇿' },
  ];

  const currentLang = languages.find(l => l.code === locale);

  return (
    <nav className="glass sticky-nav">
      <div className="container nav-content">
        <Link href="/" className="logo-text font-heading">
          NOMER<span>TOP</span>
        </Link>

        {/* Desktop Nav */}
        <div className="desktop-links">
          <Link href="/search">{t.nav.search}</Link>
          <Link href="/dashboard">{t.nav.dashboard}</Link>
          
          <div className="lang-rel">
            <button className="lang-btn" onClick={() => setShowLangs(!showLangs)}>
              <span>{currentLang?.flag}</span>
              <Globe size={18} />
            </button>
            <AnimatePresence>
              {showLangs && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="lang-dropdown glass"
                >
                  {languages.map(lang => (
                    <button 
                      key={lang.code}
                      onClick={() => { setLocale(lang.code as any); setShowLangs(false); }}
                      className={locale === lang.code ? 'active' : ''}
                    >
                      {lang.flag} {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/login" className="btn-login">
            <User size={18} />
            <span>{t.nav.login}</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu glass"
          >
            <Link href="/search" onClick={() => setIsOpen(false)}>{t.nav.search}</Link>
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>{t.nav.dashboard}</Link>
            <div className="mobile-langs">
              {languages.map(lang => (
                <button 
                  key={lang.code}
                  onClick={() => { setLocale(lang.code as any); setIsOpen(false); }}
                  className={locale === lang.code ? 'active' : ''}
                >
                  {lang.flag}
                </button>
              ))}
            </div>
            <Link href="/login" className="btn-primary" onClick={() => setIsOpen(false)}>
              {t.nav.login}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .sticky-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid var(--border);
          height: 80px;
          display: flex;
          align-items: center;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo-text {
          font-size: 1.5rem;
          color: white;
          letter-spacing: -0.05em;
        }
        .logo-text span {
          color: var(--primary);
        }
        .desktop-links {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }
        .desktop-links a {
          font-weight: 600;
          color: var(--muted);
          font-size: 0.95rem;
        }
        .desktop-links a:hover {
          color: white;
        }
        .lang-rel {
          position: relative;
        }
        .lang-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--muted);
          padding: 0.5rem;
          border-radius: 8px;
        }
        .lang-btn:hover {
          background: var(--surface);
          color: white;
        }
        .lang-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 160px;
          padding: 0.5rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .lang-dropdown button {
          text-align: left;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          color: var(--muted);
          font-size: 0.85rem;
          font-weight: 600;
        }
        .lang-dropdown button:hover, .lang-dropdown button.active {
          background: var(--surface-hover);
          color: white;
        }
        .btn-login {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--surface);
          padding: 0.6rem 1.25rem;
          border-radius: 10px;
          font-weight: 700;
          color: white;
          border: 1px solid var(--border);
        }
        .btn-login:hover {
          background: var(--surface-hover);
          transform: translateY(-1px);
        }
        .mobile-toggle {
          display: none;
          color: white;
        }
        @media (max-width: 768px) {
          .desktop-links { display: none; }
          .mobile-toggle { display: block; }
          .mobile-menu {
            position: absolute;
            top: 80px;
            left: 0;
            right: 0;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            border-bottom: 1px solid var(--border);
          }
          .mobile-langs {
            display: flex;
            gap: 1rem;
          }
          .mobile-langs button {
            font-size: 1.5rem;
            opacity: 0.5;
          }
          .mobile-langs button.active {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </nav>
  );
}
