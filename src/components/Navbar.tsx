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
          .logo-text { font-family: 'Outfit', sans-serif; font-weight: 950; font-size: 1.5rem; letter-spacing: -0.05em; display: flex; align-items: center; }
          .logo-main { color: white; }
          .logo-accent { background: var(--gradient-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 10px var(--primary-glow)); }
          .lang-pill-switcher { display: flex; background: rgba(0,0,0,0.4); padding: 0.2rem; border-radius: 0.8rem; border: 1px solid rgba(255,255,255,0.06); gap: 0.15rem; }
          .lang-pill { display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.75rem; border-radius: 0.6rem; font-size: 0.7rem; font-weight: 950; color: rgba(255,255,255,0.25); transition: all 0.2s; letter-spacing: 0.05em; }
          .lang-pill:hover { color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.03); }
          .lang-pill-active { background: rgba(255,255,255,0.06); color: white !important; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1); }
          .mobile-toggle { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); }
          @media (min-width: 769px) { .mobile-toggle { display: none; } }
          
          .mobile-container {
            position: absolute; top: 100%; left: 0; right: 0; 
            padding: 2rem 1.5rem; background: rgba(5,5,8,0.95);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            backdrop-filter: blur(20px);
          }
          .mobile-links { display: flex; flex-direction: column; gap: 1.5rem; }
          .mobile-links a { font-size: 1.1rem; font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 0.1em; }
          
          .mobile-lang-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
          .mobile-lang-grid button { 
             padding: 0.8rem; background: rgba(255,255,255,0.03); 
             border: 1px solid rgba(255,255,255,0.06); border-radius: 10px;
             display: flex; align-items: center; justify-content: center; gap: 0.5rem;
             color: rgba(255,255,255,0.3); font-size: 0.8rem; font-weight: 900;
          }
          .mobile-lang-grid button.active { 
             background: rgba(255,255,255,0.06); color: white; border-color: rgba(255,255,255,0.1);
          }
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
