'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Car, Globe, Shield, Bell, ChevronDown } from 'lucide-react';
import { searchPlate } from '@/lib/actions';
import { useTranslation } from '@/components/LanguageProvider';

const COUNTRIES = [
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', placeholder: '01 A 777 AA' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', placeholder: 'A 123 AA 77' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', placeholder: '123 ABC 01' },
];

export default function SearchPage() {
  const { t } = useTranslation();
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);

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
            <h1 className="font-heading">{t.hero.ctaSearch}</h1>
            <p>{t.hero.subtitle}</p>
          </div>

          <form 
            action={async (formData) => {
              setIsSearching(true);
              formData.append('country', selectedCountry.code);
              await searchPlate(formData);
              setIsSearching(false);
            }} 
            className="search-form"
          >
            <div className="input-group">
              <div className="country-pick">
                <button 
                  type="button" 
                  onClick={() => setIsCountryOpen(!isCountryOpen)}
                >
                  <span>{selectedCountry.flag}</span>
                  <ChevronDown size={14} />
                </button>
                
                <AnimatePresence>
                  {isCountryOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="country-list glass"
                    >
                      {COUNTRIES.map((c) => (
                        <button 
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsCountryOpen(false);
                          }}
                        >
                          <span>{c.flag}</span>
                          {c.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <input 
                name="query"
                type="text" 
                placeholder={selectedCountry.placeholder}
                className="plate-input"
                autoFocus
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary-focal"
              disabled={isSearching}
            >
              {isSearching ? <div className="spinner"></div> : (
                <>
                  <span>{t.hero.ctaSearch}</span>
                  <Car size={20} />
                </>
              )}
            </button>
          </form>

          <div className="search-badges">
            <div className="badge"><Shield size={14} /> <span>{t.features.privacy.title}</span></div>
            <div className="badge"><Globe size={14} /> <span>{t.features.global.title}</span></div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .search-page-midnight { padding: 4rem 0 8rem; min-height: 80vh; display: flex; align-items: center; }
        .search-container { padding: 5rem 4rem; border-radius: 40px; text-align: center; max-width: 650px; margin: 0 auto; }
        
        .scan-icon-wrap { width: 80px; height: 80px; background: var(--surface); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: var(--primary); margin: 0 auto 2.5rem; position: relative; overflow: hidden; box-shadow: 0 0 30px var(--primary-glow); }
        .scan-line { position: absolute; width: 100%; height: 2px; background: var(--primary); top: 0; animation: scan 2s linear infinite; }
        @keyframes scan { 0% { top: 0 } 50% { top: 100% } 100% { top: 0 } }

        h1 { fontSize: 2.5rem; margin-bottom: 1rem; }
        p { color: var(--muted); margin-bottom: 3.5rem; font-size: 1.1rem; }

        .search-form { display: flex; flex-direction: column; gap: 2rem; }
        .input-group { display: flex; gap: 0.75rem; }
        
        .country-pick { position: relative; }
        .country-pick > button { height: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 0 1.25rem; display: flex; align-items: center; gap: 0.5rem; color: white; font-size: 1.25rem; }
        
        .country-list { position: absolute; top: calc(100% + 10px); left: 0; width: 200px; padding: 0.5rem; border-radius: 16px; z-index: 10; }
        .country-list button { text-align: left; padding: 0.75rem; border-radius: 10px; color: var(--muted); font-weight: 600; width: 100%; display: flex; gap: 0.75rem; }
        .country-list button:hover { background: var(--surface-hover); color: white; }

        .plate-input { flex: 1; background: #000; border: 2px solid var(--border); border-radius: 16px; padding: 1.25rem; font-size: 1.75rem; font-family: 'Courier New', monospace; font-weight: 900; text-align: center; color: white; letter-spacing: 4px; text-transform: uppercase; }
        .plate-input:focus { outline: none; border-color: var(--primary); }

        .btn-primary-focal { background: var(--primary); color: white; padding: 1.25rem; border-radius: 16px; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 1rem; box-shadow: 0 8px 30px var(--primary-glow); }
        .btn-primary-focal:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }
        .btn-primary-focal:disabled { opacity: 0.5; }

        .search-badges { margin-top: 3.5rem; display: flex; justify-content: center; gap: 2rem; }
        .badge { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--muted); font-weight: 700; text-transform: uppercase; }

        .spinner { width: 22px; height: 22px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .search-container { padding: 3rem 1.5rem; }
          .input-group { flex-direction: column; }
          .plate-input { font-size: 1.5rem; }
          h1 { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
}
