'use client';

import Link from 'next/link';
import { useTranslation } from './LanguageProvider';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="ft">
      <div className="container ft-inner">
        <div className="ft-brand">
          <Link href="/" className="ft-logo">
            <span>NOMER</span><span className="ft-accent">TOP</span>
          </Link>
          <p>{t.footer.tagline}</p>
        </div>

        <div className="ft-cols">
          <div className="ft-col">
            <h4>{t.footer.navigation}</h4>
            <Link href="/search">{t.nav.search}</Link>
            <Link href="/dashboard">{t.nav.dashboard}</Link>
          </div>
          <div className="ft-col">
            <h4>{t.footer.support}</h4>
            <Link href="/agreement">{t.footer.agreement}</Link>
            <Link href="/privacy">{t.footer.privacy}</Link>
          </div>
        </div>
      </div>

      <div className="ft-bottom">
        <div className="container">
          <span>© 2026 NomerTop. {t.footer.rights}</span>
        </div>
      </div>

      <style jsx>{`
        .ft {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          margin-top: 2rem;
        }
        .ft-inner {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 2rem;
          padding-top: 2.5rem;
          padding-bottom: 2.5rem;
        }
        .ft-brand { max-width: 260px; }
        .ft-logo {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: 1.3rem;
          letter-spacing: -0.04em;
          display: inline-flex;
          gap: 0;
          color: #0f172a;
          margin-bottom: 0.6rem;
        }
        .ft-accent { color: #6366f1; }
        .ft-brand p {
          font-size: 0.84rem;
          color: #94a3b8;
          line-height: 1.5;
        }

        .ft-cols { display: flex; gap: 3rem; flex-wrap: wrap; }
        .ft-col { display: flex; flex-direction: column; gap: 0.6rem; }
        .ft-col h4 {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #0f172a;
          margin-bottom: 0.25rem;
          font-family: 'Outfit', sans-serif;
        }
        .ft-col a {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
          transition: color 0.15s;
        }
        .ft-col a:hover { color: #6366f1; }

        .ft-bottom {
          border-top: 1px solid #e2e8f0;
          padding: 1rem 0;
        }
        .ft-bottom span {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 500;
        }

        @media (max-width: 600px) {
          .ft-inner { flex-direction: column; }
        }
      `}</style>
    </footer>
  );
}
