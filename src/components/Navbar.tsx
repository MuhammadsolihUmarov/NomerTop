'use client';

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
        <Link href="/" className="logo-text font-heading text-white no-underline">
          NOMER<span className="text-blue-500">TOP</span>
        </Link>

        {/* Desktop Nav */}
        <div className="desktop-links">
          <Link href="/search" className="no-underline">{t.nav.search}</Link>
          <Link href="/dashboard" className="no-underline">{t.nav.dashboard}</Link>
          
          {/* Language Switcher */}
          <div className="lang-relative">
            <button className="lang-toggle" onClick={() => setShowLangs(!showLangs)}>
              <span>{currentLang?.flag}</span>
              <Globe size={16} />
            </button>
            <AnimatePresence>
              {showLangs && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="lang-popover glass"
                >
                  {languages.map(lang => (
                    <button 
                      key={lang.code}
                      onClick={() => { setLocale(lang.code as any); setShowLangs(false); }}
                      className={locale === lang.code ? 'active' : ''}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
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
                {languages.map(lang => (
                  <button 
                    key={lang.code}
                    onClick={() => { setLocale(lang.code as any); setIsOpen(false); }}
                    className={locale === lang.code ? 'active' : ''}
                  >
                    {lang.flag} {lang.label}
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
