'use client';

import Link from "next/link";
import { Search, ShieldAlert, MessageCircle, Car, ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/components/LanguageProvider";
import { motion } from "framer-motion";

export default function Home() {
  const { t } = useTranslation();

  const features = [
    { icon: <ShieldAlert />, title: t.features.towing.title, desc: t.features.towing.desc, color: 'var(--primary)' },
    { icon: <MessageCircle />, title: t.features.privacy.title, desc: t.features.privacy.desc, color: 'var(--accent)' },
    { icon: <Car />, title: t.features.global.title, desc: t.features.global.desc, color: '#9333ea' },
  ];

  return (
    <div className="landing-page">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="status-chip glass"
          >
            <ShieldCheck size={16} />
            <span>GLOBAL PROTOCOL ACTIVE</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading"
          >
            {t.hero.title.split(' ').map((word: string, i: number) => (
              <span key={i} style={{ color: word.toLowerCase() === 'communication' ? 'var(--primary)' : 'inherit' }}>
                {word}{' '}
              </span>
            ))}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-actions"
          >
            <Link href="/search" className="btn-primary-large">
              {t.hero.ctaSearch}
              <Search size={20} />
            </Link>
            <Link href="/dashboard/register-plate" className="btn-secondary">
              {t.hero.ctaClaim}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="features-grid">
        <div className="container grid-wrap">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="feature-card glass hover-glow"
            >
              <div className="feature-icon" style={{ backgroundColor: `${f.color}15`, color: f.color }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Quote */}
      <section className="quote-section">
        <div className="container">
          <div className="glass quote-card">
            <h2>{t.footer.copy}</h2>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page { padding-bottom: 8rem; }
        .hero { padding: 8rem 0; text-align: center; }
        .hero-content { max-width: 900px; }
        
        .status-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          border-radius: 99rem;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--accent);
          margin-bottom: 2rem;
        }

        h1 { font-size: 4.5rem; line-height: 1.1; margin-bottom: 2rem; }
        p { font-size: 1.25rem; color: var(--muted); margin-bottom: 4rem; max-width: 700px; margin-left: auto; margin-right: auto; line-height: 1.7; }

        .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        
        .btn-primary-large {
          background: var(--primary);
          color: white;
          padding: 1.25rem 2.5rem;
          border-radius: 16px;
          font-weight: 800;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 10px 40px var(--primary-glow);
          transition: 0.3s;
        }
        .btn-primary-large:hover { transform: translateY(-3px); filter: brightness(1.1); }

        .btn-secondary {
          background: var(--surface);
          border: 1px solid var(--border);
          color: white;
          padding: 1.25rem 2.50rem;
          border-radius: 16px;
          font-weight: 800;
          font-size: 1.1rem;
          transition: 0.3s;
        }
        .btn-secondary:hover { background: var(--surface-hover); }

        .grid-wrap { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem; }
        .feature-card { padding: 3rem; border-radius: 32px; transition: 0.3s; }
        .feature-card:hover { transform: translateY(-5px); border-color: var(--primary); }
        .feature-icon { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; }
        .feature-icon :global(svg) { width: 28px; height: 28px; }
        h3 { font-size: 1.5rem; margin-bottom: 1rem; }
        .feature-card p { font-size: 1rem; color: var(--muted); margin: 0; text-align: left; }

        .quote-section { padding: 4rem 0; }
        .quote-card { padding: 4rem; border-radius: 40px; text-align: center; }
        .quote-card h2 { font-size: 1.5rem; color: var(--muted); font-weight: 600; }

        @media (max-width: 768px) {
          h1 { font-size: 2.75rem; }
          .hero { padding: 4rem 0; }
        }
      `}</style>
    </div>
  );
}
