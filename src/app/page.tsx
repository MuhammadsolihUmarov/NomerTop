'use client';

import Link from "next/link";
import { Search, ShieldAlert, MessageCircle, Car } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/components/LanguageProvider";

export default function Home() {
  const { t } = useTranslation();

  const features = [
    { icon: <ShieldAlert size={28} />, title: t.features.towing.title, desc: t.features.towing.desc, color: 'var(--primary)' },
    { icon: <MessageCircle size={28} />, title: t.features.privacy.title, desc: t.features.privacy.desc, color: 'var(--secondary)' },
    { icon: <Car size={28} />, title: t.features.global.title, desc: t.features.global.desc, color: '#a855f7' },
  ];

  return (
    <div className="landing-page">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hero-badge"
          >
             <span className="badge-pulse"></span>
             Global Vehicle Identity Network
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-title"
          >
            {t.hero.title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-subtitle"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-actions"
          >
            <Link href="/search" className="btn-primary-large">
              <span>{t.hero.ctaSearch}</span>
              <Search size={22} />
            </Link>
            <Link href="/dashboard/register-plate" className="btn-glass-large">
              {t.hero.ctaClaim}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid-wrap">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="premium-feature-card glass"
              >
                <div className="feature-icon-wrap" style={{ 
                  boxShadow: `0 0 30px ${f.color}30`,
                  color: f.color,
                  borderColor: `${f.color}20`
                }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="card-shine"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="footer-callout">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="quote-card-premium glass"
          >
            <h2>{t.footer.copy}</h2>
            <div className="accent-line"></div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .landing-page { padding: 4rem 0 10rem; position: relative; overflow: hidden; }
        
        .hero { padding: 8rem 0; position: relative; z-index: 10; text-align: center; }
        .hero-badge { 
          display: inline-flex; align-items: center; gap: 0.75rem; 
          background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2);
          color: var(--primary); padding: 0.6rem 1.25rem; border-radius: 99rem;
          font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 3rem; position: relative;
        }
        .badge-pulse { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; display: inline-block; position: relative; }
        .badge-pulse::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--primary); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        @keyframes ping { 75%, 100% { transform: scale(3.5); opacity: 0; } }

        .hero-title { font-size: 5rem; line-height: 1.1; margin-bottom: 2rem; background: linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.6) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; }
        .hero-subtitle { font-size: 1.4rem; color: var(--muted-foreground); max-width: 700px; margin: 0 auto 3.5rem; line-height: 1.6; }

        .btn-glass-large { 
          background: rgba(255,255,255,0.03); border: 1px solid var(--border);
          color: white; padding: 1.25rem 2.5rem; border-radius: 1.25rem;
          font-weight: 800; font-size: 1.1rem; transition: 0.3s;
        }
        .btn-glass-large:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); transform: translateY(-3px); }

        .features-section { padding: 6rem 0; }
        .features-grid-wrap { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; }
        
        .premium-feature-card { 
          padding: 4rem 3rem; border-radius: 2.5rem; position: relative; overflow: hidden;
          transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .premium-feature-card:hover { transform: translateY(-12px); border-color: rgba(255,255,255,0.15); }
        .premium-feature-card h3 { font-size: 1.75rem; margin-bottom: 1.25rem; font-weight: 800; }
        .premium-feature-card p { color: var(--muted-foreground); font-size: 1.1rem; line-height: 1.7; }
        
        .feature-icon-wrap { 
          width: 70px; height: 70px; border-radius: 1.5rem; border: 1px solid;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.03); margin-bottom: 2.5rem;
        }
        
        .card-shine { 
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .footer-callout { padding: 8rem 0; }
        .quote-card-premium { 
          padding: 8rem 4rem; text-align: center; border-radius: 4rem; position: relative; overflow: hidden;
        }
        .quote-card-premium h2 { font-size: 2.5rem; font-weight: 900; max-width: 800px; margin: 0 auto; line-height: 1.2; }
        .accent-line { width: 80px; height: 4px; background: var(--gradient-main); margin: 3rem auto 0; border-radius: 2px; }

        @media (max-width: 800px) {
          .hero-title { font-size: 3rem; }
          .hero-subtitle { font-size: 1.1rem; }
          .premium-feature-card { padding: 3rem 2rem; }
        }
      `}</style>
    </div>
  );
}
