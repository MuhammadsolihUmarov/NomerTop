'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Smartphone, Lock, ArrowRight, User } from 'lucide-react';
import { registerUser } from '@/lib/actions';
import { useTranslation } from '@/components/LanguageProvider';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = new FormData();
    data.append('name', form.name);
    data.append('phone', form.phone);
    data.append('password', form.password);
    const res = await registerUser(data);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      toast.success('Akkount yaratildi!');
      router.push('/login?registered=true');
    }
  };

  return (
    <div className="rp">
      <motion.div
        className="rp-wrap"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="rp-head">
          <div className="rp-ic"><User size={20} /></div>
          <h1>{t.auth.signupTitle}</h1>
          <p>{t.auth.signupSub}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rp-form">

          <div className="rp-field">
            <label>{t.registration.fullName}</label>
            <div className="rp-row">
              <User size={15} className="rp-fic" />
              <input
                type="text"
                placeholder="Muhammad"
                value={form.name}
                onChange={set('name')}
                required
              />
            </div>
          </div>

          <div className="rp-field">
            <label>{t.registration.phone}</label>
            <div className="rp-row">
              <Smartphone size={15} className="rp-fic" />
              <input
                type="tel"
                placeholder="+998 90 123 45 67"
                value={form.phone}
                onChange={set('phone')}
                required
              />
            </div>
          </div>

          <div className="rp-field">
            <label>{t.registration.securityKey}</label>
            <div className="rp-row">
              <Lock size={15} className="rp-fic" />
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                required
              />
            </div>
          </div>

          {error && <p className="rp-err">{error}</p>}

          <button type="submit" className="rp-submit" disabled={loading}>
            {loading
              ? <span className="spin" />
              : <><span>{t.registration.enlistNow}</span><ArrowRight size={15} /></>
            }
          </button>
        </form>

        <p className="rp-foot">
          {t.registration.alreadyEnlisted}{' '}
          <Link href="/login" className="rp-link">{t.registration.verifyIdentity}</Link>
        </p>
      </motion.div>

      <style jsx>{`
        .rp {
          min-height: 88vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
        }
        .rp-wrap { width: 100%; max-width: 380px; }

        /* Head */
        .rp-head { text-align: center; margin-bottom: 2rem; }
        .rp-ic {
          width: 46px; height: 46px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.18);
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          color: #34d399;
          margin: 0 auto 1.1rem;
        }
        .rp-head h1 { font-size: 1.8rem; font-weight: 900; color: #fff; margin-bottom: 0.3rem; }
        .rp-head p { font-size: 0.83rem; color: rgba(255,255,255,0.35); }

        /* Form */
        .rp-form { display: flex; flex-direction: column; gap: 1rem; }
        .rp-field label {
          display: block;
          font-size: 0.65rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.25);
          margin-bottom: 0.45rem;
        }
        .rp-row {
          position: relative; display: flex; align-items: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 0.8rem;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .rp-row:focus-within {
          border-color: rgba(16,185,129,0.35);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.07);
        }
        .rp-fic {
          position: absolute; left: 0.9rem;
          color: rgba(255,255,255,0.18); pointer-events: none;
        }
        .rp-row input {
          width: 100%;
          background: transparent !important; border: none !important;
          border-radius: 0.8rem !important;
          padding: 0.85rem 0.9rem 0.85rem 2.6rem !important;
          font-size: 0.93rem !important; color: #fff !important;
          font-weight: 600; box-shadow: none !important;
        }
        .rp-row input:-webkit-autofill,
        .rp-row input:-webkit-autofill:hover,
        .rp-row input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 60px #0d0d14 inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff;
        }

        .rp-err {
          font-size: 0.78rem; color: #f87171; font-weight: 700;
          background: rgba(248,113,113,0.07);
          border: 1px solid rgba(248,113,113,0.14);
          padding: 0.55rem 0.9rem; border-radius: 0.65rem; text-align: center;
        }

        .rp-submit {
          display: flex; align-items: center; justify-content: center; gap: 0.45rem;
          width: 100%; padding: 0.92rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff; border: none; border-radius: 0.8rem;
          font-size: 0.85rem; font-weight: 800; letter-spacing: 0.06em;
          cursor: pointer; margin-top: 0.2rem;
          transition: filter 0.18s, transform 0.18s;
          box-shadow: 0 5px 18px rgba(16,185,129,0.22);
        }
        .rp-submit:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .rp-submit:disabled { opacity: 0.42; cursor: not-allowed; }

        .spin {
          width: 17px; height: 17px;
          border: 2px solid rgba(255,255,255,0.22);
          border-top-color: #fff; border-radius: 50%;
          animation: sp 0.7s linear infinite; display: inline-block;
        }
        @keyframes sp { to { transform: rotate(360deg); } }

        .rp-foot {
          text-align: center; margin-top: 1.6rem;
          font-size: 0.82rem; color: rgba(255,255,255,0.26); font-weight: 600;
        }
        .rp-link { color: #34d399; font-weight: 800; }
        .rp-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
