'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, EyeOff, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/components/LanguageProvider';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const [plate, setPlate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = plate.trim().replace(/\s+/g, '').toUpperCase();
    router.push(q ? `/search?q=${q}` : '/search');
  };

  const features = [
    { icon: <Bell size={20} />, color: '#6366f1', bg: '#eef2ff', title: t.features.towing.title, desc: t.features.towing.desc },
    { icon: <EyeOff size={20} />, color: '#10b981', bg: '#ecfdf5', title: t.features.privacy.title, desc: t.features.privacy.desc },
    { icon: <Globe size={20} />, color: '#f59e0b', bg: '#fffbeb', title: t.features.global.title, desc: t.features.global.desc },
  ];

  return (
    <div>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <motion.div
            className="hero-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge">{t.hero.badge}</span>
            <h1>{t.hero.title}</h1>
            <p className="sub">{t.hero.subtitle}</p>

            <form className="sbox" onSubmit={handleSearch}>
              <input
                className="plate"
                type="text"
                value={plate}
                onChange={e => setPlate(e.target.value.toUpperCase())}
                placeholder="01 A 777 AA"
                maxLength={12}
                autoComplete="off"
                spellCheck={false}
              />
              <button type="submit" className="go">
                <Search size={16} />
                <span>{t.search.button}</span>
              </button>
            </form>

            <div className="steps">
              {t.hero.steps.map((s, i) => (
                <span key={i} className="sg">
                  <span className="step"><b>{i + 1}</b>{s}</span>
                  {i < 2 && <span className="arr">→</span>}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="feats">
        <div className="container">
          <div className="feat-grid">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="feat"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.35 }}
              >
                <div className="feat-ic" style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta">
        <div className="container">
          <motion.div
            className="cta-in"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>{t.footer.copy}</h2>
            <Link href="/dashboard/register-plate" className="cta-btn">
              {t.hero.ctaClaim} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        /* ── Hero ── */
        .hero {
          padding: 5rem 0 4rem;
          background: linear-gradient(180deg, #f8faff 0%, #ffffff 100%);
          border-bottom: 1px solid #e2e8f0;
          text-align: center;
        }
        .hero-in { max-width: 600px; margin: 0 auto; }

        .badge {
          display: inline-block;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          color: #6366f1;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.3rem 0.85rem;
          border-radius: 99rem;
          margin-bottom: 1.5rem;
        }

        h1 {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 0.9rem;
          letter-spacing: -0.03em;
          line-height: 1.12;
        }

        .sub {
          font-size: 1rem;
          color: #64748b;
          max-width: 480px;
          margin: 0 auto 2rem;
          line-height: 1.65;
        }

        /* Search */
        .sbox {
          display: flex;
          align-items: stretch;
          background: white;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.3rem;
          gap: 0.3rem;
          max-width: 480px;
          margin: 0 auto 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .sbox:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .plate {
          flex: 1;
          background: transparent !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 0.75rem 0.9rem !important;
          font-size: 1.4rem !important;
          font-family: 'Courier New', monospace !important;
          font-weight: 900 !important;
          letter-spacing: 0.07em;
          color: #0f172a !important;
          text-transform: uppercase;
          min-width: 0;
          box-shadow: none !important;
        }
        .plate::placeholder { color: #cbd5e1 !important; font-weight: 400 !important; }

        .go {
          display: flex; align-items: center; gap: 0.4rem;
          background: #6366f1; color: white; border: none;
          border-radius: 8px; padding: 0.75rem 1.25rem;
          font-size: 0.82rem; font-weight: 700; letter-spacing: 0.03em;
          cursor: pointer; white-space: nowrap; flex-shrink: 0;
          transition: background 0.15s, transform 0.15s;
        }
        .go:hover { background: #4f46e5; transform: translateY(-1px); }

        /* Steps */
        .steps {
          display: flex; align-items: center;
          justify-content: center; flex-wrap: wrap; gap: 0.35rem;
        }
        .sg { display: flex; align-items: center; gap: 0.35rem; }
        .step {
          display: flex; align-items: center; gap: 0.35rem;
          font-size: 0.78rem; color: #94a3b8; font-weight: 600;
        }
        .step b {
          display: inline-flex; align-items: center; justify-content: center;
          width: 17px; height: 17px; border-radius: 50%;
          background: #eef2ff; border: 1px solid #c7d2fe;
          color: #6366f1; font-size: 0.6rem; font-weight: 900; flex-shrink: 0;
        }
        .arr { color: #cbd5e1; font-size: 0.7rem; }

        /* Features */
        .feats { padding: 4rem 0; background: #f8fafc; }
        .feat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
        }
        .feat {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 1.75rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .feat:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .feat-ic {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1rem;
        }
        .feat h3 { font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 0.4rem; }
        .feat p { font-size: 0.84rem; color: #64748b; line-height: 1.6; margin: 0; }

        /* CTA */
        .cta { padding: 4rem 0; }
        .cta-in {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 20px;
          padding: 3rem 2.5rem;
          text-align: center;
          color: white;
        }
        .cta-in h2 {
          font-size: clamp(1.3rem, 3vw, 1.9rem);
          font-weight: 900;
          color: white;
          margin-bottom: 1.75rem;
          line-height: 1.25;
        }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: white; color: #6366f1;
          padding: 0.8rem 1.75rem; border-radius: 10px;
          font-weight: 800; font-size: 0.9rem;
          transition: all 0.15s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.18); }

        @media (max-width: 480px) {
          .go span { display: none; }
          .go { padding: 0.75rem 1rem; }
          .hero { padding: 3rem 0 2.5rem; }
        }
      `}</style>
    </div>
  );
}
