'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, AlertCircle, ArrowRight, ShieldCheck, Smartphone } from 'lucide-react';
import { useTranslation } from '@/components/LanguageProvider';
import { sendOtp } from '@/lib/actions';
import { toast } from 'sonner';

export default function LoginPage() {
  const { t } = useTranslation();
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    if (!identifier) {
      setError("Please enter your phone number first.");
      return;
    }
    
    setIsLoading(true);
    setError('');
    const result = await sendOtp(identifier);
    setIsLoading(false);

    if (result.success) {
      setIsOtpSent(true);
      setTimer(60);
      toast.success("OTP sent to your device!");
      if (result.debug_code) {
        console.log("DEBUG OTP:", result.debug_code);
        setOtp(result.debug_code); // Auto-fill in dev
      }
    } else {
      setError(result.error || "Failed to send OTP.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const loginParams = loginMode === 'password' 
      ? { identifier, password }
      : { identifier, otp };

    const result = await signIn('credentials', {
      ...loginParams,
      redirect: false,
    });

    if (result?.error) {
      setError(t.auth.invalid);
      setIsLoading(false);
    } else {
      toast.success("Identity verified. Welcome back.");
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="login-focal-page">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="auth-card-premium glass-card-premium"
        >
          <div className="auth-header">
            <div className="auth-icon-wrap">
              {loginMode === 'password' ? <Lock size={28} /> : <ShieldCheck size={28} />}
            </div>
            <h1>{loginMode === 'password' ? t.auth.systemAccess : t.auth.secureEntry}</h1>
            <p>{loginMode === 'password' ? t.auth.passAuthDesc : t.auth.otpAuthDesc}</p>
          </div>

          <div className="login-mode-switcher">
            <button 
              className={loginMode === 'password' ? 'active' : ''} 
              onClick={() => { setLoginMode('password'); setError(''); }}
            >
              {t.auth.loginModePass}
            </button>
            <button 
              className={loginMode === 'otp' ? 'active' : ''} 
              onClick={() => { setLoginMode('otp'); setError(''); }}
            >
              {t.auth.loginModeOtp}
            </button>
          </div>

          <form onSubmit={handleLogin} className="auth-focal-form">
            <div className="focal-group">
              <label>{loginMode === 'password' ? t.auth.email + ' / ' + t.auth.phone : t.auth.phoneLabel}</label>
              <div className="focal-input-wrap">
                {loginMode === 'password' ? <User size={18} className="focal-icon" /> : <Smartphone size={18} className="focal-icon" />}
                <input 
                  id="identifier"
                  type="text" 
                  placeholder={loginMode === 'otp' ? "+998 90 123 45 67" : "name@example.com"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loginMode === 'password' ? (
                <motion.div 
                  key="pass"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="focal-group"
                >
                  <label>{t.auth.passLabel}</label>
                  <div className="focal-input-wrap">
                    <Lock size={18} className="focal-icon" />
                    <input 
                      id="password"
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="otp"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="focal-group"
                >
                  <div className="label-row">
                    <label>{t.auth.otp}</label>
                    <button 
                      type="button" 
                      className="resend-link" 
                      disabled={isLoading || timer > 0} 
                      onClick={handleSendOtp}
                    >
                      {timer > 0 ? `${t.auth.resendCode} ${timer}s` : (isOtpSent ? t.auth.resendCode : t.auth.requestCode)}
                    </button>
                  </div>
                  <div className="focal-input-wrap">
                    <ShieldCheck size={18} className="focal-icon" />
                    <input 
                      id="otp-code"
                      type="text" 
                      placeholder="000 000" 
                      value={otp}
                      maxLength={6}
                      onChange={(e) => setOtp(e.target.value)}
                      required={isOtpSent}
                      disabled={!isOtpSent}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-error-premium"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            <button 
              type="submit" 
              className="btn-auth-premium" 
              disabled={isLoading || (loginMode === 'otp' && !isOtpSent)}
            >
              {isLoading ? <div className="spinner"></div> : (
                <>
                  <span>{loginMode === 'password' ? t.auth.initializeSession : t.auth.establishLink}</span>
                  <ArrowRight size={18} className="btn-icon-move" />
                </>
              )}
            </button>
          </form>

          <footer className="auth-footer-premium">
            <p>{t.auth.newUser} <a href="/register" className="link-glitch">{t.auth.createAccount}</a></p>
          </footer>
        </motion.div>
      </div>

      <style jsx>{`
        .login-focal-page { 
          padding: 4rem 0; 
          min-height: 90vh; 
          display: flex; 
          align-items: center; 
          position: relative;
        }
        .container { max-width: 460px; margin: 0 auto; width: 100%; padding: 0 1.5rem; }
        
        .auth-card-premium { 
          padding: 3rem 2.5rem; border-radius: 2rem; text-align: center; 
          position: relative;
          overflow: hidden;
        }

        .auth-card-premium::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.4), transparent);
          animation: scanline 4s linear infinite;
        }

        @keyframes scanline {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(500px); opacity: 0; }
        }
        
        .auth-icon-wrap { 
          width: 56px; height: 56px; background: rgba(99, 102, 241, 0.1); border-radius: 1.25rem; 
          display: flex; align-items: center; justify-content: center; color: var(--primary); 
          margin: 0 auto 1.5rem; border: 1px solid rgba(99, 102, 241, 0.15);
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.15); 
        }
        
        h1 { font-size: 2.2rem; font-weight: 950; margin-bottom: 0.5rem; letter-spacing: -0.03em; color: white; }
        p { color: rgba(255,255,255,0.35); margin-bottom: 2rem; font-size: 0.9rem; font-weight: 600; }

        .login-mode-switcher {
          display: flex; background: rgba(0,0,0,0.4); padding: 0.25rem; border-radius: 1rem;
          border: 1px solid rgba(255,255,255,0.06); gap: 0.25rem; margin-bottom: 2rem;
        }
        .login-mode-switcher button {
          flex: 1; padding: 0.7rem; border-radius: 0.8rem; font-size: 0.8rem; font-weight: 900;
          color: rgba(255,255,255,0.3); transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.1em;
        }
        .login-mode-switcher button.active {
          background: rgba(255,255,255,0.05); color: white; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
        }

        .auth-focal-form { display: flex; flex-direction: column; gap: 1.5rem; text-align: left; }
        .focal-group label { 
          display: block; font-weight: 900; font-size: 0.72rem; 
          text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.25); 
          margin-bottom: 0.75rem; padding-left: 0.25rem;
        }
        
        .label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .label-row label { margin-bottom: 0; }
        .resend-link { font-size: 0.7rem; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em; }
        .resend-link:disabled { color: rgba(255,255,255,0.15); }

        .focal-input-wrap { position: relative; display: flex; align-items: center; }
        .focal-icon { position: absolute; left: 1.25rem; color: rgba(255,255,255,0.15); transition: color 0.3s; z-index: 2; pointer-events: none; }
        
        .focal-input-wrap input { 
          width: 100%; padding: 1.1rem 1.25rem 1.1rem 3.25rem; border-radius: 1.1rem; 
          border: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.4); 
          color: white; font-size: 0.95rem; transition: all 0.3s;
          font-family: inherit; font-weight: 600;
        }
        .focal-input-wrap input:focus { border-color: rgba(99, 102, 241, 0.4); background: rgba(0,0,0,0.6); }
        .focal-input-wrap input:focus ~ .focal-icon { color: var(--primary); }

        .auth-error-premium { 
          display: flex; align-items: center; gap: 0.75rem; color: #ef4444; 
          font-size: 0.82rem; padding: 1rem; border-radius: 1rem; 
          background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.1); 
          font-weight: 700;
        }
        
        .btn-auth-premium { 
          background: var(--gradient-main); color: white; padding: 1.2rem; 
          border-radius: 1.1rem; font-weight: 950; font-size: 0.95rem;
          letter-spacing: 0.1em; box-shadow: 0 10px 25px var(--primary-glow); 
          width: 100%; transition: all 0.3s; border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .btn-auth-premium:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 15px 35px var(--primary-glow); }
        .btn-auth-premium:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .btn-icon-move { transition: transform 0.3s; }
        .btn-auth-premium:hover .btn-icon-move { transform: translateX(3px); }

        .auth-footer-premium { margin-top: 2.5rem; font-size: 0.88rem; color: rgba(255,255,255,0.25); font-weight: 600; }
        .auth-footer-premium a { color: var(--primary); font-weight: 850; text-decoration: none; }
        .auth-footer-premium a:hover { text-decoration: underline; }

        .spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.2); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
