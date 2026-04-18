'use client';

import Link from "next/link";
import { Search, ShieldAlert, MessageCircle, Car, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    { icon: <ShieldAlert />, title: "Prevent Towing", desc: "Get notified instantly by other drivers if your car is about to be towed.", color: 'var(--primary)' },
    { icon: <MessageCircle />, title: "Anonymous & Secure", desc: "Communicate with vehicle owners without sharing your private phone number.", color: 'var(--accent)' },
    { icon: <Car />, title: "Global Fleet Ready", desc: "Register any license plate from any country and start receiving messages.", color: '#9333ea' },
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
            Your License Plate is Now a <span style={{ color: 'var(--primary)' }}>Communication Hub</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            The global network that turns vehicle license plates into anonymous, secure communication channels.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-actions"
          >
            <Link href="/search" className="btn-primary-large">
              Search Vehicle
              <Search size={20} />
            </Link>
            <Link href="/dashboard/register-plate" className="btn-secondary">
              Claim Your Plate
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
            <h2>© 2026 NomerTop. Driving Digital Identity.</h2>
          </div>
        </div>
      </section>
    </div>
  );
}
