'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from './LanguageProvider';
import { User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { locale, setLocale, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Pill switcher: only RU and UZ
  const mainLanguages = [
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
    { code: 'uz', label: 'UZ', flag: '🇺🇿' },
  ];

  // Mobile menu: all three
  const allLanguages = [
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
  ];

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
          .lang-pill-switcher { display: flex; background: rgba(255,255,255,0.04); padding: 0.2rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); gap: 0.1rem; }
          .lang-pill { display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.8rem; border-radius: 7px; font-size: 0.75rem; font-weight: 800; color: rgba(255,255,255,0.4); transition: 0.2s; letter-spacing: 0.03em; }
          .lang-pill:hover { color: rgba(255,255,255,0.75); }
          .lang-pill-active { background: rgba(255,255,255,0.1); color: white; }
        `}</style>

        {/* Desktop Nav */}
        <div className="desktop-links">
          <Link href="/search" className="no-underline">{t.nav.search}</Link>
          <Link href="/dashboard" className="no-underline">{t.nav.dashboard}</Link>

          {/* Language Switcher - RU / UZ pill */}
          <div className="lang-pill-switcher">
            {mainLanguages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code as any)}
                className={`lang-pill ${locale === lang.code ? 'lang-pill-active' : ''}`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>

          <Link href="/login" className="btn-login no-underline">
            <User size={18} />
            <span>{t.nav.login}</span>
          </Link>
        </div>

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
                {allLanguages.map(lang => (
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
