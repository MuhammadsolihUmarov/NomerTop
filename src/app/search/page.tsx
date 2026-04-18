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
            <h1 className="font-heading">Smart Vehicle Search</h1>
            <p>Enter any license plate. We'll handle the rest.</p>
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
                placeholder="e.g. 01 A 777 AA"
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
                  <span>Locate Owner</span>
                  <Car size={20} />
                </>
              )}
            </button>
            
            {!detected && query.length > 3 && (
              <div className="hint-text">
                <AlertCircle size={14} />
                <span>Detection engine: Universal Mode</span>
              </div>
            )}
          </form>

          <div className="search-badges">
            <div className="badge"><Shield size={14} /> <span>Anonymous Identity</span></div>
            <div className="badge"><Globe size={14} /> <span>Global Coverage</span></div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .search-page-midnight { padding: 4rem 0 8rem; min-height: 80vh; display: flex; align-items: center; }
        .search-container { padding: 5rem 4rem; border-radius: 40px; text-align: center; max-width: 600px; margin: 0 auto; }
        
        .scan-icon-wrap { width: 80px; height: 80px; background: var(--surface); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: var(--primary); margin: 0 auto 2.5rem; position: relative; overflow: hidden; }
        .scan-line { position: absolute; width: 100%; height: 2px; background: var(--primary); top: 0; animation: scan 2s linear infinite; }
        @keyframes scan { 0% { top: 0 } 50% { top: 100% } 100% { top: 0 } }

        h1 { fontSize: 2.25rem; margin-bottom: 0.5rem; }
        p { color: var(--muted); margin-bottom: 3.5rem; font-size: 1rem; }

        .search-form { position: relative; }
        .input-wrapper { position: relative; margin-bottom: 1.5rem; }
        
        .plate-input-focal { 
          width: 100%;
          background: #000; 
          border: 2px solid var(--border); 
          border-radius: 16px; 
          padding: 1.5rem 2rem; 
          font-size: 2rem; 
          font-family: 'Courier New', monospace; 
          font-weight: 900; 
          text-align: center; 
          color: white; 
          letter-spacing: 4px; 
          text-transform: uppercase;
        }
        .plate-input-focal:focus { outline: none; border-color: var(--primary); }

        .country-indicator {
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--surface);
          padding: 0.4rem 0.8rem;
          border-radius: 10px;
          border: 1px solid var(--border);
        }
        .indicator-flag { font-size: 1.25rem; }
        .indicator-name { font-size: 0.75rem; font-weight: 800; color: white; text-transform: uppercase; }

        .hint-text { margin-top: 1rem; color: var(--muted); font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 600; }

        .search-badges { margin-top: 3.5rem; display: flex; justify-content: center; gap: 2rem; }
        .badge { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--muted); font-weight: 700; text-transform: uppercase; }

        .spinner { width: 22px; height: 22px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .search-container { padding: 3rem 1.5rem; }
          .plate-input-focal { font-size: 1.5rem; padding: 1rem; }
          .country-indicator { display: none; }
        }
      `}</style>
    </div>
  );
}
