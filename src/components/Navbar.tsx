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

    </nav>
  );
}
