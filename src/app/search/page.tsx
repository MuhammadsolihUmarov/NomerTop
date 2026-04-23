'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Car, Globe, Shield, AlertCircle } from 'lucide-react';
import { searchPlate } from '@/lib/actions';
import { useTranslation } from '@/components/LanguageProvider';

const detectCountry = (plate: string) => {
  const clean = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (!clean) return null;
  if (/^\d{2}[A-Z]/.test(clean) || /^\d{2}\d{3}[A-Z]{3}/.test(clean)) return { code: 'UZ', flag: '🇺🇿', name: 'Uzbekistan' };
  if (/^[ABEKMHOPCTX]\d{3}[ABEKMHOPCTX]{2}/.test(clean)) return { code: 'RU', flag: '🇷🇺', name: 'Russia' };
  if (/^\d{3}[A-Z]{2,3}\d{2}/.test(clean)) return { code: 'KZ', flag: '🇰🇿', name: 'Kazakhstan' };
  return null;
};

function SearchPageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isSearching, setIsSearching] = useState(false);

  const detected = useMemo(() => detectCountry(query), [query]);

  return (
    <div className="sp">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="sc glass"
        >
          <div className="sc-head">
            <div className="sc-icon">
              {isSearching ? <div className="scan-line" /> : <Search size={28} />}
            </div>
            <h1>{t.search.title}</h1>
            <p>{t.search.subtitle}</p>
          </div>

          <form
            action={async (formData) => {
              setIsSearching(true);
              const countryCode = detected?.code || 'OTH';
              formData.set('query', query.replace(/\s+/g, '').toUpperCase());
              formData.append('country', countryCode);
              await searchPlate(formData);
              setIsSearching(false);
            }}
            className="sc-form"
          >
            <div className="sc-input-wrap">
              <input
                name="query"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="sc-plate"
                autoFocus
                required
              />
              <AnimatePresence>
                {detected && (
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    className="sc-country"
                  >
                    <span>{detected.flag}</span>
                    <span className="sc-cn">{detected.name}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              className="btn-primary-large"
              disabled={isSearching || !query}
              style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
            >
              {isSearching ? <div className="spinner" /> : (
                <><span>{t.search.button}</span><Car size={18} /></>
              )}
            </button>

            {!detected && query.length > 3 && (
              <div className="sc-hint">
                <AlertCircle size={13} />
                <span>{t.search.hint}</span>
              </div>
            )}
          </form>

          <div className="sc-badges">
            <div className="sc-badge"><Shield size={13} /><span>{t.search.badgeAnon}</span></div>
            <div className="sc-badge"><Globe size={13} /><span>{t.search.badgeGlobal}</span></div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .sp { padding: 4rem 0; min-height: 80vh; display: flex; align-items: center; }
        .sc {
          padding: 3rem 2.5rem; border-radius: 2rem; text-align: center;
          max-width: 560px; margin: 0 auto;
          box-shadow: 0 30px 80px -16px rgba(0,0,0,0.7);
        }
        .sc-head { margin-bottom: 2.5rem; }
        .sc-icon {
          width: 72px; height: 72px; background: rgba(99,102,241,0.1);
          border-radius: 1.5rem; display: flex; align-items: center;
          justify-content: center; color: var(--primary);
          margin: 0 auto 1.5rem; position: relative; overflow: hidden;
          box-shadow: 0 0 24px var(--primary-glow);
        }
        .scan-line { position: absolute; width: 100%; height: 2px; background: var(--primary); top: 0; animation: scan 1.6s linear infinite; box-shadow: 0 0 10px var(--primary); }
        @keyframes scan { 0% { top: 0 } 100% { top: 100% } }
        h1 { font-size: 2.2rem; font-weight: 900; margin-bottom: 0.5rem; color: #fff; }
        p { color: var(--muted-foreground); font-size: 1rem; }

        .sc-form { position: relative; }
        .sc-input-wrap { position: relative; }
        .sc-plate {
          width: 100%; background: rgba(0,0,0,0.4); border: 2px solid var(--border);
          border-radius: 1.1rem; padding: 1.5rem; font-size: 2.2rem;
          font-family: 'Outfit', 'Courier New', monospace; font-weight: 900;
          text-align: center; color: white; letter-spacing: 5px; text-transform: uppercase;
          transition: 0.25s;
        }
        .sc-plate:focus { outline: none; border-color: var(--primary); background: rgba(0,0,0,0.6); box-shadow: 0 0 30px var(--primary-glow); }

        .sc-country {
          position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
          display: flex; align-items: center; gap: 0.5rem;
          background: var(--surface); padding: 0.4rem 0.8rem;
          border-radius: 10px; border: 1px solid var(--border);
        }
        .sc-cn { font-size: 0.75rem; font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 0.04em; }

        .sc-hint { margin-top: 1.25rem; color: var(--muted-foreground); font-size: 0.82rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-weight: 700; opacity: 0.6; }

        .sc-badges { margin-top: 3rem; display: flex; justify-content: center; gap: 2.5rem; }
        .sc-badge { display: flex; align-items: center; gap: 0.5rem; font-size: 0.77rem; color: var(--muted-foreground); font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }
        .sc-badge span { color: var(--foreground); }

        .spinner { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.75s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 560px) {
          .sc { padding: 2.5rem 1.25rem; border-radius: 1.5rem; }
          .sc-plate { font-size: 1.6rem; padding: 1.1rem; }
          .sc-country { display: none; }
          h1 { font-size: 1.75rem; }
        }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageContent />
    </Suspense>
  );
}
