'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from './LanguageProvider';
import { User, Menu, X, Globe } from 'lucide-react';

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
    <nav className="sticky-nav">
      <div className="container nav-content">
        <Link href="/" className="logo-text no-underline">
          <span className="logo-main">NOMER</span><span className="logo-accent">TOP</span>
        </Link>

        <style jsx>{`
          .logo-text { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 1.5rem; letter-spacing: -0.02em; }
          .logo-main { color: white; }
          .logo-accent { background: var(--gradient-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        `}</style>

        {/* Desktop Nav */}
        <div className="desktop-links">
          <Link href="/search" className="no-underline">{t.nav.search}</Link>
          <Link href="/dashboard" className="no-underline">{t.nav.dashboard}</Link>
          
          {/* Language Switcher - Direct Toggle */}
          <div className="lang-toggle-group">
            {languages.filter(l => l.code !== locale).map(lang => (
              <button 
                key={lang.code}
                onClick={() => setLocale(lang.code as any)}
                className="lang-btn-quick"
              >
                <span className="lang-flag-mini">{lang.flag}</span>
                <span className="lang-text-mini">{lang.code.toUpperCase()}</span>
              </button>
            ))}
          </div>

          <Link href="/login" className="btn-login no-underline">
            <User size={18} />
            <span>{t.nav.login}</span>
          </Link>
        </div>

        <style jsx>{`
          .lang-toggle-group { display: flex; gap: 0.5rem; background: rgba(255,255,255,0.03); padding: 0.25rem; border-radius: 12px; border: 1px solid var(--border); }
          .lang-btn-quick { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.75rem; border-radius: 8px; font-size: 0.7rem; font-weight: 850; color: var(--muted-foreground); transition: 0.2s; }
          .lang-btn-quick:hover { background: rgba(255,255,255,0.08); color: white; }
          .lang-text-mini { opacity: 0.6; }
        `}</style>

        {/* Mobile Toggle */}
        <button className="mobile-toggle text-white" onClick={() => setIsOpen(!isOpen)}>
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
            className="mobile-container glass"
          >
            <div className="mobile-links">
              <Link href="/search" onClick={() => setIsOpen(false)}>{t.nav.search}</Link>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>{t.nav.dashboard}</Link>
              
              <div className="mobile-lang-grid">
                {languages.map(lang => (
                  <button 
                    key={lang.code}
                    onClick={() => { setLocale(lang.code as any); setIsOpen(false); }}
                    className={locale === lang.code ? 'active' : ''}
                  >
                    <span className="mobile-flag">{lang.flag}</span>
                    <span className="mobile-lang-label">{lang.label}</span>
                  </button>
                ))}
              </div>

              <Link href="/login" className="btn-primary-large" onClick={() => setIsOpen(false)}>
                {t.nav.login}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
