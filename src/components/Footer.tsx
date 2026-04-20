'use client';

import Link from 'next/link';
import { useTranslation } from './LanguageProvider';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Shield, FileText, Headphones } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer-premium">
      <div className="mesh-bg-footer"></div>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="logo-text no-underline">
              <span className="logo-main">NOMER</span><span className="logo-accent">TOP</span>
            </Link>
            <p className="footer-tagline">
              {t.footer.tagline}
            </p>
          </div>

          <div className="footer-grid">
            <div className="footer-column">
              <h4>{t.footer.navigation}</h4>
              <ul className="footer-links">
                <li><Link href="/search">{t.nav.search}</Link></li>
                <li><Link href="/dashboard">{t.dashboard.myFleet}</Link></li>
                <li><Link href="/pricing">{t.footer.tagline !== 'Tagline' ? 'Тарифы' : 'Pricing'}</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>{t.footer.support}</h4>
              <ul className="footer-links">
                <li><Link href="/contacts" className="link-with-icon"><Headphones size={14} /> {t.footer.contacts}</Link></li>
                <li><Link href="/agreement" className="link-with-icon"><FileText size={14} /> {t.footer.agreement}</Link></li>
                <li><Link href="/privacy" className="link-with-icon"><Shield size={14} /> {t.footer.privacy}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            © 2026 NomerTop. {t.footer.rights}
          </div>
          <div className="footer-social">
            {/* Social icons could go here */}
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-premium {
          position: relative;
          padding: 6rem 0 3rem;
          background: #050508;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          margin-top: 4rem;
        }

        .mesh-bg-footer {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.08) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 3rem;
          margin-bottom: 4rem;
        }

        .footer-brand {
          max-width: 320px;
        }

        .logo-text { 
          font-family: 'Outfit', sans-serif; 
          font-weight: 950; 
          font-size: 1.8rem; 
          letter-spacing: -0.04em; 
          display: block;
          margin-bottom: 1.5rem;
        }
        .logo-main { color: white; }
        .logo-accent { 
          background: var(--gradient-main); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          filter: drop-shadow(0 0 10px var(--primary-glow)); 
        }

        .footer-tagline {
          color: rgba(255, 255, 255, 0.4);
          font-size: 1rem;
          line-height: 1.6;
          font-weight: 500;
        }

        .footer-grid {
          display: flex;
          gap: 4rem;
          flex-wrap: wrap;
        }

        .footer-column h4 {
          color: white;
          font-size: 0.9rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 1.8rem;
          font-family: 'Outfit', sans-serif;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s;
          display: block;
        }

        .footer-links a:hover {
          color: var(--primary);
          transform: translateX(4px);
        }

        .link-with-icon {
          display: flex !important;
          align-items: center;
          gap: 0.75rem;
        }

        .footer-bottom {
          padding-top: 2.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .copyright {
          color: rgba(255, 255, 255, 0.25);
          font-size: 0.85rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .footer-top {
            flex-direction: column;
            gap: 4rem;
          }
          .footer-grid {
            gap: 3rem;
          }
          .footer-bottom {
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
