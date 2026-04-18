'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Car, Globe, Shield, Bell, ChevronDown } from 'lucide-react';
import { searchPlate } from '@/lib/actions';

const COUNTRIES = [
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', placeholder: '01 A 777 AA' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', placeholder: 'A 123 AA 77' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', placeholder: '123 ABC 01' },
];

export default function SearchPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  return (
    <div className="search-focal-container">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="search-card-premium glass"
        >
          <div className="search-header">
            <div className="icon-glow">
              {isSearching ? <div className="scanning-line" /> : <Search size={32} />}
            </div>
            <h1>Global Plate Search</h1>
            <p>Connect with vehicle owners worldwide. Your private handle for the road.</p>
          </div>

          <form 
            action={async (formData) => {
              setIsSearching(true);
              // Send country along with query
              formData.append('country', selectedCountry.code);
              await searchPlate(formData);
              setIsSearching(false);
            }} 
            className="focal-form"
          >
            <div className="input-universe">
              <div className="country-selector">
                <button 
                  type="button" 
                  className="country-btn"
                  onClick={() => setIsCountryOpen(!isCountryOpen)}
                >
                  <span className="flag">{selectedCountry.flag}</span>
                  <ChevronDown size={14} />
                </button>
                
                <AnimatePresence>
                  {isCountryOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="country-dropdown glass"
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

              <div className="focal-input-group">
                <input 
                  name="query"
                  type="text" 
                  placeholder={selectedCountry.placeholder}
                  className="focal-input"
                  autoFocus
                  required
                />
                <div className="input-glow"></div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary-large"
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="spinner-container">
                  <div className="spinner"></div>
                  <span>Scanning Database...</span>
                </div>
              ) : (
                <>
                  <span>Locate Vehicle</span>
                  <Car size={20} />
                </>
              )}
            </button>
          </form>

          <footer className="search-footer">
            <div className="badge-item"><Shield size={14} /> <span>Anonymous Identity</span></div>
            <div className="badge-item"><Globe size={14} /> <span>Cross-Border Ready</span></div>
            <div className="badge-item"><Bell size={14} /> <span>Smart Pushes</span></div>
          </footer>
        </motion.div>
      </div>

      <style jsx>{`
        .search-focal-container { padding: 4rem 0 8rem; min-height: 80vh; display: flex; align-items: center; justify-content: center; }
        .container { max-width: 700px; width: 100%; padding: 0 1.5rem; }
        
        .search-card-premium { padding: 5rem 4rem; border-radius: 4rem; text-align: center; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; position: relative; }
        
        .icon-glow { width: 90px; height: 90px; background: rgba(16, 185, 129, 0.1); border-radius: 2.5rem; display: flex; align-items: center; justify-content: center; color: var(--primary); margin: 0 auto 2.5rem; box-shadow: 0 0 40px var(--primary-glow); position: relative; overflow: hidden; }
        
        .scanning-line { position: absolute; width: 100%; height: 2px; background: var(--primary); top: 0; left: 0; animation: scan 2s linear infinite; box-shadow: 0 0 15px var(--primary); }
        @keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }

        h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.02em; }
        p { color: var(--muted-foreground); margin-bottom: 4rem; font-size: 1.2rem; line-height: 1.6; }

        .focal-form { display: flex; flex-direction: column; gap: 2.5rem; }
        
        .input-universe { display: flex; gap: 1rem; align-items: stretch; }
        
        .country-selector { position: relative; }
        .country-btn { height: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 1.5rem; padding: 0 1.5rem; display: flex; align-items: center; gap: 0.5rem; color: white; font-size: 1.5rem; }
        
        .country-dropdown { position: absolute; top: calc(100% + 0.5rem); left: 0; width: 220px; z-index: 50; border-radius: 1.5rem; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.25rem; }
        .country-dropdown button { text-align: left; padding: 0.75rem 1rem; border-radius: 0.75rem; color: var(--muted-foreground); font-weight: 600; display: flex; align-items: center; gap: 0.75rem; }
        .country-dropdown button:hover { background: rgba(255,255,255,0.1); color: white; }
        .country-dropdown button span { font-size: 1.2rem; }

        .focal-input-group { position: relative; flex: 1; }
        .focal-input { width: 100%; background: rgba(0,0,0,0.3); border: 2px solid var(--border); border-radius: 1.5rem; padding: 1.5rem 2rem; font-size: 2.5rem; font-family: 'Courier New', monospace; font-weight: 900; text-align: center; color: white; transition: all 0.3s; letter-spacing: 4px; text-transform: uppercase; }
        .focal-input:focus { outline: none; border-color: var(--primary); background: rgba(0,0,0,0.5); }
        
        .btn-primary-large { background: var(--primary); color: white; padding: 1.5rem; border-radius: 1.5rem; font-weight: 800; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; gap: 1rem; box-shadow: 0 15px 35px var(--primary-glow); }
        .btn-primary-large:hover:not(:disabled) { transform: translateY(-3px); filter: brightness(1.1); }
        .btn-primary-large:disabled { opacity: 0.7; cursor: wait; }

        .spinner-container { display: flex; align-items: center; gap: 1rem; }
        .spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .search-footer { margin-top: 4rem; display: flex; justify-content: center; gap: 3rem; }
        .badge-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--muted-foreground); font-weight: 600; }

        @media (max-width: 800px) {
          .search-card-premium { padding: 3rem 1.5rem; border-radius: 2.5rem; }
          .input-universe { flex-direction: column; }
          .country-btn { width: 100%; padding: 1rem; justify-content: center; }
          .focal-input { font-size: 1.75rem; padding: 1.25rem; }
          h1 { font-size: 2.5rem; }
          .search-footer { flex-direction: column; gap: 1rem; align-items: center; }
        }
      `}</style>
    </div>
  );
}
