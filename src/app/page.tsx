'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, EyeOff, Globe } from 'lucide-react';
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
    { icon: <Bell size={22} />, title: t.features.towing.title, desc: t.features.towing.desc },
    { icon: <EyeOff size={22} />, title: t.features.privacy.title, desc: t.features.privacy.desc },
    { icon: <Globe size={22} />, title: t.features.global.title, desc: t.features.global.desc },
  ];

  return (
    <div className="pg">

      {/* ── Hero ── */}
      <section className="hero">
        <motion.div
          className="hero-in"
          initial={{ opacity: 0, y: 22 }}
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
              <Search size={17} />
              <span>{t.search.button}</span>
            </button>
          </form>

          <div className="steps">
            {t.hero.steps.map((s, i) => (
              <span key={i} className="step-group">
                <span className="step"><b>{i + 1}</b>{s}</span>
                {i < 2 && <span className="arr">→</span>}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="feats">
        <div className="container">
          <div className="feat-grid">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="feat"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
              >
                <div className="feat-ic">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-wrap">
        <motion.div
          className="cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>{t.footer.copy}</h2>
          <Link href="/dashboard/register-plate" className="cta-btn">{t.hero.ctaClaim}</Link>
        </motion.div>
      </section>

      <style jsx>{`
        .pg { display: flex; flex-direction: column; }

        /* ── Hero ── */
        .hero {
          min-height: 82vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          text-align: center;
        }
        .hero-in { max-width: 600px; width: 100%; }

        .badge {
          display: inline-block;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          color: #a5b4fc;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 0.32rem 0.85rem;
          border-radius: 99rem;
          margin-bottom: 1.6rem;
        }

        h1 {
          font-size: clamp(1.9rem, 5.2vw, 3.2rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.12;
          color: #fff;
          margin-bottom: 0.9rem;
        }

        .sub {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.37);
          line-height: 1.7;
          max-width: 460px;
          margin: 0 auto 2rem;
        }

        /* ── Search box ── */
        .sbox {
          display: flex;
          align-items: stretch;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1rem;
          padding: 0.28rem;
          gap: 0.28rem;
          max-width: 480px;
          margin: 0 auto 1.6rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .sbox:focus-within {
          border-color: rgba(99,102,241,0.42);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .plate {
          flex: 1;
          background: transparent !important;
          border: none !important;
          border-radius: 0.75rem !important;
          padding: 0.78rem 0.9rem !important;
          font-size: 1.5rem !important;
          font-family: 'Courier New', monospace !important;
          font-weight: 900 !important;
          letter-spacing: 0.08em;
          color: #fff !important;
          text-transform: uppercase;
          min-width: 0;
        }
        .plate:focus { box-shadow: none !important; }
        .plate::placeholder { color: rgba(255,255,255,0.14) !important; font-weight: 400 !important; }

        .go {
          display: flex;
          align-items: center;
          gap: 0.42rem;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          border: none;
          border-radius: 0.75rem;
          padding: 0.78rem 1.3rem;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: filter 0.18s, transform 0.18s;
        }
        .go:hover { filter: brightness(1.12); transform: translateY(-1px); }

        /* ── Steps ── */
        .steps {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.3rem;
        }
        .step-group { display: flex; align-items: center; gap: 0.3rem; }
        .step {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          font-weight: 600;
        }
        .step b {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.28);
          color: #a5b4fc;
          font-size: 0.58rem;
          font-weight: 900;
          flex-shrink: 0;
        }
        .arr { color: rgba(255,255,255,0.1); font-size: 0.68rem; }

        /* ── Features ── */
        .feats { padding: 0 0 2.5rem; }
        .feat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.9rem;
        }
        .feat {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 1rem;
          padding: 1.5rem;
          transition: border-color 0.2s, background 0.2s;
        }
        .feat:hover {
          background: rgba(99,102,241,0.03);
          border-color: rgba(99,102,241,0.15);
        }
        .feat-ic { color: #818cf8; margin-bottom: 0.9rem; }
        .feat h3 {
          font-size: 0.9rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.35rem;
        }
        .feat p {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.34);
          line-height: 1.6;
          margin: 0;
        }

        /* ── CTA ── */
        .cta-wrap { padding: 0 1.5rem 3.5rem; }
        .cta {
          max-width: 520px;
          margin: 0 auto;
          background: rgba(99,102,241,0.05);
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 1.3rem;
          padding: 2.5rem 2rem;
          text-align: center;
        }
        .cta h2 {
          font-size: clamp(1.15rem, 2.8vw, 1.6rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.3;
          margin-bottom: 1.6rem;
        }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          padding: 0.78rem 1.8rem;
          border-radius: 0.8rem;
          font-weight: 800;
          font-size: 0.87rem;
          letter-spacing: 0.03em;
          transition: filter 0.18s, transform 0.18s;
          box-shadow: 0 5px 18px rgba(99,102,241,0.22);
        }
        .cta-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }

        @media (max-width: 480px) {
          .go span { display: none; }
          .go { padding: 0.78rem 0.9rem; }
          h1 { font-size: 1.75rem; }
        }
      `}</style>
    </div>
  );
}
