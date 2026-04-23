'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Smartphone, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/components/LanguageProvider';
import { sendOtp } from '@/lib/actions';
import { toast } from 'sonner';

export default function LoginPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'password' | 'otp'>('password');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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
    if (!phone) { setError(t.auth.phoneLabel); return; }
    setLoading(true);
    setError('');
    const res = await sendOtp(phone);
    setLoading(false);
    if (res.success) {
      setOtpSent(true);
      setTimer(60);
      toast.success('SMS yuborildi!');
      if (res.debug_code) setOtp(res.debug_code);
    } else {
      setError(res.error || 'Xato yuz berdi');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const params = mode === 'password'
      ? { identifier: phone, password }
      : { identifier: phone, otp };
    const res = await signIn('credentials', { ...params, redirect: false });
    if (res?.error) {
      setError(t.auth.invalid);
      setLoading(false);
    } else {
      toast.success('Xush kelibsiz!');
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="lp">
      <motion.div
        className="lp-wrap"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="lp-head">
          <div className="lp-ic">
            {mode === 'password' ? <Lock size={20} /> : <ShieldCheck size={20} />}
          </div>
          <h1>{t.auth.title}</h1>
          <p>{mode === 'password' ? t.auth.passAuthDesc : t.auth.otpAuthDesc}</p>
        </div>

        {/* Mode switch */}
        <div className="lp-tabs">
          <button
            className={mode === 'password' ? 'active' : ''}
            onClick={() => { setMode('password'); setError(''); }}
          >
            {t.auth.loginModePass}
          </button>
          <button
            className={mode === 'otp' ? 'active' : ''}
            onClick={() => { setMode('otp'); setError(''); }}
          >
            {t.auth.loginModeOtp}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="lp-form">

          {/* Phone */}
          <div className="lp-field">
            <label>{t.auth.phoneLabel}</label>
            <div className="lp-row">
              <Smartphone size={15} className="lp-fic" />
              <input
                type="tel"
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password or OTP */}
          <AnimatePresence mode="wait">
            {mode === 'password' ? (
              <motion.div
                key="pw"
                className="lp-field"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.18 }}
              >
                <label>{t.auth.passLabel}</label>
                <div className="lp-row">
                  <Lock size={15} className="lp-fic" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                className="lp-field"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
              >
                <div className="lp-label-row">
                  <label>{t.auth.otp}</label>
                  <button
                    type="button"
                    className="lp-send-btn"
                    disabled={loading || timer > 0}
                    onClick={handleSendOtp}
                  >
                    {timer > 0 ? `${timer}s` : otpSent ? t.auth.resendCode : t.auth.requestCode}
                  </button>
                </div>
                <div className="lp-row">
                  <ShieldCheck size={15} className="lp-fic" />
                  <input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    maxLength={6}
                    onChange={e => setOtp(e.target.value)}
                    disabled={!otpSent}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="lp-err">{error}</p>}

          <button
            type="submit"
            className="lp-submit"
            disabled={loading || (mode === 'otp' && !otpSent)}
          >
            {loading
              ? <span className="spin" />
              : <><span>{t.auth.loginBtn}</span><ArrowRight size={15} /></>
            }
          </button>
        </form>

        <p className="lp-foot">
          {t.auth.newUser}{' '}
          <Link href="/register" className="lp-link">{t.auth.createAccount}</Link>
        </p>
      </motion.div>

      <style jsx>{`
        .lp {
          min-height: 88vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
        }
        .lp-wrap { width: 100%; max-width: 380px; }

        /* Head */
        .lp-head { text-align: center; margin-bottom: 2rem; }
        .lp-ic {
          width: 46px; height: 46px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.18);
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          color: #818cf8;
          margin: 0 auto 1.1rem;
        }
        .lp-head h1 { font-size: 1.8rem; font-weight: 900; color: #fff; margin-bottom: 0.3rem; }
        .lp-head p { font-size: 0.83rem; color: rgba(255,255,255,0.35); }

        /* Tabs */
        .lp-tabs {
          display: flex;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 0.8rem;
          padding: 0.2rem;
          gap: 0.2rem;
          margin-bottom: 1.6rem;
        }
        .lp-tabs button {
          flex: 1; padding: 0.6rem;
          border-radius: 0.62rem;
          font-size: 0.75rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: rgba(255,255,255,0.25);
          transition: all 0.18s;
        }
        .lp-tabs button.active {
          background: rgba(99,102,241,0.14);
          color: #a5b4fc;
          box-shadow: inset 0 0 0 1px rgba(99,102,241,0.22);
        }

        /* Fields */
        .lp-form { display: flex; flex-direction: column; gap: 1rem; }
        .lp-field label {
          display: block;
          font-size: 0.65rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.25);
          margin-bottom: 0.45rem;
        }
        .lp-label-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 0.45rem;
        }
        .lp-label-row label { margin-bottom: 0; }
        .lp-send-btn {
          font-size: 0.65rem; font-weight: 800;
          color: #818cf8; text-transform: uppercase; letter-spacing: 0.06em;
        }
        .lp-send-btn:disabled { color: rgba(255,255,255,0.18); }

        .lp-row {
          position: relative; display: flex; align-items: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 0.8rem;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .lp-row:focus-within {
          border-color: rgba(99,102,241,0.38);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .lp-fic {
          position: absolute; left: 0.9rem;
          color: rgba(255,255,255,0.18); pointer-events: none;
        }
        .lp-row input {
          width: 100%;
          background: transparent !important; border: none !important;
          border-radius: 0.8rem !important;
          padding: 0.85rem 0.9rem 0.85rem 2.6rem !important;
          font-size: 0.93rem !important; color: #fff !important;
          font-weight: 600; box-shadow: none !important;
        }
        .lp-row input:-webkit-autofill,
        .lp-row input:-webkit-autofill:hover,
        .lp-row input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 60px #0d0d14 inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff;
        }

        .lp-err {
          font-size: 0.78rem; color: #f87171; font-weight: 700;
          background: rgba(248,113,113,0.07);
          border: 1px solid rgba(248,113,113,0.14);
          padding: 0.55rem 0.9rem; border-radius: 0.65rem; text-align: center;
        }

        .lp-submit {
          display: flex; align-items: center; justify-content: center; gap: 0.45rem;
          width: 100%; padding: 0.92rem;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff; border: none; border-radius: 0.8rem;
          font-size: 0.85rem; font-weight: 800; letter-spacing: 0.06em;
          cursor: pointer; margin-top: 0.2rem;
          transition: filter 0.18s, transform 0.18s;
          box-shadow: 0 5px 18px rgba(99,102,241,0.24);
        }
        .lp-submit:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .lp-submit:disabled { opacity: 0.42; cursor: not-allowed; }

        .spin {
          width: 17px; height: 17px;
          border: 2px solid rgba(255,255,255,0.22);
          border-top-color: #fff; border-radius: 50%;
          animation: sp 0.7s linear infinite; display: inline-block;
        }
        @keyframes sp { to { transform: rotate(360deg); } }

        .lp-foot {
          text-align: center; margin-top: 1.6rem;
          font-size: 0.82rem; color: rgba(255,255,255,0.26); font-weight: 600;
        }
        .lp-link { color: #818cf8; font-weight: 800; }
        .lp-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
