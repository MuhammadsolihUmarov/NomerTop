'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Car, Globe, Shield, AlertCircle } from 'lucide-react';
import { searchPlate } from '@/lib/actions';
import { useTranslation } from '@/components/LanguageProvider';

const detectCountry = (plate: string) => {
  const clean = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (!clean) return null;

  // UZ: Often starts with 2 digits (region)
  if (/^\d{2}[A-Z]/.test(clean) || /^\d{2}\d{3}[A-Z]{3}/.test(clean)) return { code: 'UZ', flag: '🇺🇿', name: 'Uzbekistan' };
  
  // RU: Often A123AA or similar
  if (/^[ABEKMHOPCTX]\d{3}[ABEKMHOPCTX]{2}/.test(clean)) return { code: 'RU', flag: '🇷🇺', name: 'Russia' };

  // KZ: Often 123ABC01
  if (/^\d{3}[A-Z]{2,3}\d{2}/.test(clean)) return { code: 'KZ', flag: '🇰🇿', name: 'Kazakhstan' };

  return null;
};

export default function SearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const detected = useMemo(() => detectCountry(query), [query]);

  return (
    <div className="search-page-midnight">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="search-container glass"
        >
          <div className="search-header">
            <div className="scan-icon-wrap">
              {isSearching ? <div className="scan-line" /> : <Search size={32} />}
            </div>
            <h1 className="font-heading">{t.search.title}</h1>
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
            className="search-form"
          >
            <div className="input-wrapper">
              <input 
                name="query"
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="plate-input-focal"
                autoFocus
                required
              />
              
              <AnimatePresence>
                {detected && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="country-indicator"
                  >
                    <span className="indicator-flag">{detected.flag}</span>
                    <span className="indicator-name">{detected.name}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary-large"
              disabled={isSearching || !query}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isSearching ? <div className="spinner"></div> : (
                <>
                  <span>{t.search.button}</span>
                  <Car size={20} />
                </>
              )}
            </button>
            
            {!detected && query.length > 3 && (
              <div className="hint-text">
                <AlertCircle size={14} />
                <span>{t.search.hint}</span>
              </div>
            )}
          </form>

          <div className="search-badges">
            <div className="badge"><Shield size={14} /> <span>{t.search.badgeAnon}</span></div>
            <div className="badge"><Globe size={14} /> <span>{t.search.badgeGlobal}</span></div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .search-page-midnight { padding: 8rem 0; min-height: 90vh; display: flex; align-items: center; position: relative; }
        .search-container { 
          padding: 6rem 4rem; border-radius: 4rem; text-align: center; max-width: 650px; margin: 0 auto;
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8);
        }
        
        .scan-icon-wrap { 
          width: 90px; height: 90px; background: rgba(99, 102, 241, 0.1); border-radius: 2rem; 
          display: flex; align-items: center; justify-content: center; color: var(--primary); 
          margin: 0 auto 3rem; position: relative; overflow: hidden;
          box-shadow: 0 0 30px var(--primary-glow);
        }
        .scan-line { position: absolute; width: 100%; height: 2px; background: var(--primary); top: 0; animation: scan 2s linear infinite; box-shadow: 0 0 15px var(--primary); }
        @keyframes scan { 0% { top: 0 } 100% { top: 100% } }

        h1 { font-size: 3rem; font-weight: 900; margin-bottom: 0.75rem; background: linear-gradient(to bottom, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { color: var(--muted-foreground); margin-bottom: 4rem; font-size: 1.1rem; }

        .search-form { position: relative; }
        .input-wrapper { position: relative; margin-bottom: 2rem; }
        
        .plate-input-focal { 
          width: 100%;
          background: rgba(0,0,0,0.4); 
          border: 2px solid var(--border); 
          border-radius: 1.5rem; 
          padding: 2rem; 
          font-size: 2.5rem; 
          font-family: 'Outfit', 'Courier New', monospace; 
          font-weight: 900; 
          text-align: center; 
          color: white; 
          letter-spacing: 6px; 
          text-transform: uppercase;
          transition: 0.3s;
        }
        .plate-input-focal:focus { outline: none; border-color: var(--primary); background: rgba(0,0,0,0.6); box-shadow: 0 0 40px var(--primary-glow); }

        .country-indicator {
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--surface);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          backdrop-filter: blur(10px);
        }
        .indicator-flag { font-size: 1.5rem; }
        .indicator-name { font-size: 0.8rem; font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 0.05em; }

        .hint-text { margin-top: 1.5rem; color: var(--muted-foreground); font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 700; opacity: 0.6; }

        .search-badges { margin-top: 5rem; display: flex; justify-content: center; gap: 3rem; }
        .badge { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; color: var(--muted-foreground); font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
        .badge span { color: var(--foreground); }

        .spinner { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .search-container { padding: 4rem 1.5rem; }
          .plate-input-focal { font-size: 1.75rem; padding: 1.5rem; }
          .country-indicator { display: none; }
          h1 { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
}
