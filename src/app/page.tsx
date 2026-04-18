'use client';

import Link from "next/link";
import { Search, ShieldAlert, MessageCircle, Car } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/components/LanguageProvider";

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
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading"
          >
            {t.hero.title}
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
              className="feature-card"
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
    </div>
  );
}
