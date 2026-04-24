'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from './LanguageProvider';
import { User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { locale, setLocale, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const langs = [
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
    { code: 'uz', label: 'UZ', flag: '🇺🇿' },
  ];

  return (
    <nav className="sticky-nav">
      <div className="container nav-content">

        <Link href="/" className="logo no-underline">
          <span className="logo-n">NOMER</span><span className="logo-t">TOP</span>
        </Link>

        {/* Desktop */}
        <div className="desktop-links">
          <Link href="/search">{t.nav.search}</Link>
          <Link href="/dashboard">{t.nav.dashboard}</Link>

          <div className="lang-switch">
            {langs.map(l => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code as any)}
                className={locale === l.code ? 'active' : ''}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>

          <Link href="/login" className="btn-login">
            <User size={16} />
            <span>{t.nav.login}</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="mob-toggle" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mob-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Link href="/search" onClick={() => setOpen(false)}>{t.nav.search}</Link>
            <Link href="/dashboard" onClick={() => setOpen(false)}>{t.nav.dashboard}</Link>
            <div className="mobile-lang-grid">
              {[
                { code: 'ru', label: 'Русский', flag: '🇷🇺' },
                { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
              ].map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLocale(l.code as any); setOpen(false); }}
                  className={locale === l.code ? 'active' : ''}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
            <Link href="/login" className="btn-primary-large" onClick={() => setOpen(false)} style={{ justifyContent: 'center' }}>
              {t.nav.login}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .logo {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: 1.4rem;
          letter-spacing: -0.04em;
          display: flex;
          align-items: center;
        }
        .logo-n { color: #0f172a; }
        .logo-t { color: #6366f1; }

        .lang-switch {
          display: flex;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.18rem;
          gap: 0.15rem;
        }
        .lang-switch button {
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.04em;
          transition: all 0.15s;
        }
        .lang-switch button.active {
          background: white;
          color: #0f172a;
          box-shadow: 0 1px 2px rgba(0,0,0,0.08);
        }
        .lang-switch button:hover:not(.active) { color: #64748b; }

        .mob-toggle {
          display: none;
          width: 36px; height: 36px;
          align-items: center; justify-content: center;
          background: #f1f5f9; border: 1px solid #e2e8f0;
          border-radius: 8px; color: #0f172a;
        }

        .mob-menu {
          border-bottom: 1px solid #e2e8f0;
          padding: 1.25rem 1.5rem;
          display: flex; flex-direction: column; gap: 1.25rem;
          background: white;
          overflow: hidden;
        }
        .mob-menu a {
          font-size: 1rem; font-weight: 700;
          color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em;
        }

        @media (max-width: 768px) {
          .desktop-links { display: none; }
          .mob-toggle { display: flex; }
        }
      `}</style>
    </nav>
  );
}
