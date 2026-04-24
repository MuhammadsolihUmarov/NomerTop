'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/components/LanguageProvider';
import { sendOtp } from '@/lib/actions';
import { toast } from 'sonner';

export default function LoginPage() {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [useOtp, setUseOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(v => v - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleSendOtp = async () => {
    if (!phone) { setError("Telefon nomerni kiriting"); return; }
    setLoading(true); setError('');
    const res = await sendOtp(phone);

    if (!res.success) {
      setLoading(false);
      setError(res.error || 'Xato yuz berdi');
      return;
    }

    setOtpSent(true); setTimer(60);

    if (res.debug_code) {
      // Backend offline — local OTP generated. Auto-login immediately.
      const code = res.debug_code;
      setOtp(code);
      toast.info('Kirish kodi tayyor. Kiring...');

      const loginRes = await signIn('credentials', {
        identifier: phone,
        otp: code,
        redirect: false,
      });
      setLoading(false);

      if (loginRes?.error) {
        setError(t.auth.invalid);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } else {
      setLoading(false);
      toast.success('SMS yuborildi!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const params = useOtp ? { identifier: phone, otp } : { identifier: phone, password };
    const res = await signIn('credentials', { ...params, redirect: false });
    if (res?.error) {
      setError(t.auth.invalid);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const switchMode = () => {
    setUseOtp(v => !v);
    setError('');
    setOtp('');
    setOtpSent(false);
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
          <div className="hd-icon">🔐</div>
          <h1>{t.auth.title}</h1>
          <p>{useOtp ? t.auth.otpAuthDesc : t.auth.passAuthDesc}</p>
        </div>

        <form onSubmit={handleSubmit} className="fm">
          {/* Phone */}
          <div className="field">
            <label>{t.auth.phoneLabel}</label>
            <input
              type="tel"
              placeholder="+998 90 123 45 67"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Password or OTP */}
          <AnimatePresence mode="wait">
            {!useOtp ? (
              <motion.div key="pw" className="field"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <label>{t.auth.passLabel}</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </motion.div>
            ) : (
              <motion.div key="otp" className="field"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="label-row">
                  <label>{t.auth.otp}</label>
                  <button type="button" className="send-btn" disabled={loading || timer > 0} onClick={handleSendOtp}>
                    {timer > 0 ? `${timer}s` : otpSent ? t.auth.resendCode : t.auth.requestCode}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  maxLength={6}
                  onChange={e => setOtp(e.target.value)}
                  disabled={!otpSent}
                  style={{ letterSpacing: '0.25em', fontSize: '1.2rem', textAlign: 'center' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="err">{error}</p>}

          <button type="submit" className="submit" disabled={loading || (useOtp && !otpSent)}>
            {loading ? <span className="spinner" /> : <><span>{t.auth.loginBtn}</span><ArrowRight size={15} /></>}
          </button>
        </form>

        <button className="mode-switch" onClick={switchMode}>
          {useOtp ? `← ${t.auth.loginModePass} bilan kirish` : t.auth.loginModeOtp + ' bilan kirish →'}
        </button>

        <p className="foot">
          {t.auth.newUser}{' '}
          <Link href="/register" className="foot-link">{t.auth.createAccount}</Link>
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
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          background: white; outline: none;
        }
        .field input:-webkit-autofill,
        .field input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 60px #f8fafc inset !important;
          -webkit-text-fill-color: #0f172a !important;
        }
        .field input:disabled { opacity: 0.45; cursor: not-allowed; }

        .label-row { display: flex; justify-content: space-between; align-items: center; }
        .label-row label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; }
        .send-btn { font-size: 0.75rem; font-weight: 700; color: #6366f1; transition: color 0.15s; }
        .send-btn:hover { color: #4f46e5; }
        .send-btn:disabled { color: #94a3b8; cursor: not-allowed; }

        .err {
          font-size: 0.8rem; color: #ef4444; font-weight: 600;
          background: #fef2f2; border: 1px solid #fecaca;
          padding: 0.6rem 0.9rem; border-radius: 8px; text-align: center;
        }

        .submit {
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          width: 100%; padding: 0.88rem;
          background: #6366f1; color: white; border: none;
          border-radius: 10px; font-size: 0.88rem; font-weight: 700;
          letter-spacing: 0.04em; cursor: pointer; margin-top: 0.25rem;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.3);
        }
        .submit:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); }
        .submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        .mode-switch {
          display: block; width: 100%; margin-top: 1rem;
          text-align: center; font-size: 0.8rem;
          color: #6366f1; font-weight: 600;
          padding: 0.5rem; border-radius: 8px;
          transition: background 0.15s;
        }
        .mode-switch:hover { background: #eef2ff; }

        .foot {
          text-align: center; margin-top: 1.25rem;
          font-size: 0.84rem; color: #94a3b8; font-weight: 500;
        }
        .foot-link { color: #6366f1; font-weight: 700; }
        .foot-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
