'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { registerUser } from '@/lib/actions';
import { useTranslation } from '@/components/LanguageProvider';
import { toast } from 'sonner';

const phoneExistsMsg: Record<string, string> = {
  uz: "Bu raqam ro'yxatdan o'tgan.",
  ru: 'Этот номер уже зарегистрирован.',
  en: 'This number is already registered.',
};

export default function RegisterPage() {
  const { t, locale } = useTranslation();
  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [phoneExists, setPhoneExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setPhoneExists(false);
    const data = new FormData();
    data.append('name', form.name);
    data.append('phone', form.phone);
    data.append('password', form.password);
    const res = await registerUser(data);
    if (res?.error) {
      if (res.error === 'PHONE_EXISTS') {
        setPhoneExists(true);
      } else {
        setError(res.error);
      }
      setLoading(false);
    } else {
      toast.success('Akkount yaratildi!');
      router.push('/login?registered=true');
    }
  };

  return (
    <div className="pg">
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
      >
        <div className="hd">
          <div className="hd-icon">👤</div>
          <h1>{t.auth.signupTitle}</h1>
          <p>{t.auth.signupSub}</p>
        </div>

        <form onSubmit={handleSubmit} className="fm">
          <div className="field">
            <label>{t.registration.fullName}</label>
            <input type="text" placeholder="Muhammad" value={form.name} onChange={set('name')} required />
          </div>

          <div className="field">
            <label>{t.registration.phone}</label>
            <input type="tel" placeholder="+998 90 123 45 67" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/[^\d+\s]/g, '') }))} inputMode="numeric" required />
          </div>

          <div className="field">
            <label>{t.registration.securityKey}</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          </div>

          {phoneExists && (
            <div className="exists-box">
              <p>{phoneExistsMsg[locale] ?? phoneExistsMsg.uz}</p>
              <Link href="/login" className="login-link">{t.registration.verifyIdentity} →</Link>
            </div>
          )}
          {error && <p className="err">{error}</p>}

          <button type="submit" className="submit" disabled={loading}>
            {loading
              ? <span className="spinner" />
              : <><span>{t.registration.enlistNow}</span><ArrowRight size={15} /></>
            }
          </button>
        </form>

        <p className="foot">
          {t.registration.alreadyEnlisted}{' '}
          <Link href="/login" className="foot-link">{t.registration.verifyIdentity}</Link>
        </p>
      </motion.div>

      <style jsx>{`
        .pg {
          min-height: 88vh;
          display: flex; align-items: center; justify-content: center;
          padding: 2rem 1.5rem;
          background: #f8fafc;
        }
        .card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 2.5rem 2rem;
          width: 100%; max-width: 380px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
        }

        .hd { text-align: center; margin-bottom: 2rem; }
        .hd-icon { font-size: 2rem; margin-bottom: 0.75rem; }
        .hd h1 { font-size: 1.75rem; font-weight: 900; color: #0f172a; margin-bottom: 0.3rem; }
        .hd p { font-size: 0.84rem; color: #94a3b8; }

        .fm { display: flex; flex-direction: column; gap: 1rem; }

        .field { display: flex; flex-direction: column; gap: 0.4rem; }
        .field label {
          font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;
        }
        .field input {
          width: 100%; padding: 0.78rem 1rem;
          font-size: 0.95rem; font-weight: 500;
          background: #f8fafc; border: 1.5px solid #e2e8f0;
          border-radius: 10px; color: #0f172a;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
          background: white; outline: none;
        }
        .field input:-webkit-autofill,
        .field input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 60px #f8fafc inset !important;
          -webkit-text-fill-color: #0f172a !important;
        }

        .err {
          font-size: 0.8rem; color: #ef4444; font-weight: 600;
          background: #fef2f2; border: 1px solid #fecaca;
          padding: 0.6rem 0.9rem; border-radius: 8px; text-align: center;
        }

        .submit {
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          width: 100%; padding: 0.88rem;
          background: #10b981; color: white; border: none;
          border-radius: 10px; font-size: 0.88rem; font-weight: 700;
          letter-spacing: 0.04em; cursor: pointer; margin-top: 0.25rem;
          transition: background 0.15s, transform 0.15s;
          box-shadow: 0 4px 14px rgba(16,185,129,0.3);
        }
        .submit:hover:not(:disabled) { background: #059669; transform: translateY(-1px); }
        .submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        .exists-box {
          background: #fffbeb; border: 1px solid #fde68a;
          border-radius: 10px; padding: 0.75rem 1rem;
          display: flex; flex-direction: column; gap: 0.4rem;
        }
        .exists-box p { font-size: 0.84rem; color: #92400e; font-weight: 600; margin: 0; }
        .login-link { font-size: 0.84rem; color: #10b981; font-weight: 700; }
        .login-link:hover { text-decoration: underline; }

        .foot {
          text-align: center; margin-top: 1.5rem;
          font-size: 0.84rem; color: #94a3b8; font-weight: 500;
        }
        .foot-link { color: #10b981; font-weight: 700; }
        .foot-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
