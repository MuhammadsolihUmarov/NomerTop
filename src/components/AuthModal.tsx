'use client';

import { useState, useEffect, createContext, useContext, useCallback, useRef, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { registerUser, sendOtp } from '@/lib/actions';
import { useTranslation } from '@/components/LanguageProvider';
import { X, Lock, User, Mail, AlertCircle, ShieldCheck, Sparkles, Car, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

// ─── Context ──────────────────────────────────────────────────────────────────

interface AuthModalContextType {
  openAuth: (options?: { onSuccess?: () => void; hint?: string }) => void;
  closeAuth: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider');
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hint, setHint] = useState<string | undefined>();
  const onSuccessRef = useRef<(() => void) | undefined>(undefined);

  const openAuth = useCallback((options?: { onSuccess?: () => void; hint?: string }) => {
    onSuccessRef.current = options?.onSuccess;
    setHint(options?.hint);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
    setHint(undefined);
  }, []);

  const handleSuccess = useCallback(() => {
    setIsOpen(false);
    setHint(undefined);
    onSuccessRef.current?.();
    onSuccessRef.current = undefined;
  }, []);

  return (
    <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <AuthModalInner hint={hint} onClose={closeAuth} onSuccess={handleSuccess} />
        )}
      </AnimatePresence>
    </AuthModalContext.Provider>
  );
}

// ─── Inline styles ────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(2, 6, 20, 0.92)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    zIndex: 9000,
  },
  centerer: {
    position: 'fixed',
    inset: 0,
    zIndex: 9001,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    pointerEvents: 'none',
  },
  shell: {
    position: 'relative',
    width: '100%',
    maxWidth: 460,
    maxHeight: 'calc(100vh - 2rem)',
    overflowY: 'auto',
    background: 'rgba(10, 10, 15, 0.8)',
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '2rem',
    padding: '3rem 2.5rem',
    boxShadow: '0 50px 100px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)',
    pointerEvents: 'auto',
    overflow: 'hidden',
  },
  scanline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.6), transparent)',
    animation: 'auth-scanline 4s linear infinite',
    pointerEvents: 'none',
  },
  closeBtn: {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    width: 32,
    height: 32,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'all 0.2s',
  },
  header: { textAlign: 'center', marginBottom: '2rem' },
  iconWrap: {
    width: 60,
    height: 60,
    background: 'rgba(99,102,241,0.1)',
    borderRadius: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#818cf8',
    margin: '0 auto 1rem',
    border: '1px solid rgba(99,102,241,0.2)',
    boxShadow: '0 0 30px rgba(99,102,241,0.2)',
  },
  hint: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(251,191,36,0.08)',
    border: '1px solid rgba(251,191,36,0.15)',
    color: '#fbbf24',
    fontSize: '0.75rem',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.12rem',
    padding: '0.35rem 1rem',
    borderRadius: 999,
    marginBottom: '1rem',
  } as CSSProperties,
  title: {
    fontSize: '2rem',
    fontWeight: 900,
    letterSpacing: '-0.02em',
    color: 'white',
    margin: 0,
    fontFamily: 'Outfit, sans-serif',
    marginBottom: '0.5rem',
  },
  subtitle: { fontSize: '0.95rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, margin: 0 },
  tabBar: {
    display: 'flex',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '1rem',
    padding: '0.3rem',
    gap: '0.3rem',
    marginBottom: '1.5rem',
  },
  tab: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '0.8rem',
    fontSize: '0.85rem',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.3)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  } as CSSProperties,
  tabActive: {
    background: 'rgba(99,102,241,0.15)',
    color: 'white',
    boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.3)',
  } as CSSProperties,
  
  modeSwitcher: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  modeBtn: {
    fontSize: '0.7rem',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.3)',
    background: 'none',
    border: 'none',
    padding: '0.2rem 0',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.3s',
  } as CSSProperties,
  modeBtnActive: {
    color: 'var(--primary)',
    borderBottomColor: 'var(--primary)',
  },

  form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' } as CSSProperties,
  fieldLabel: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'rgba(255,255,255,0.25)',
    marginBottom: '0.6rem',
    paddingLeft: '0.2rem',
    fontFamily: 'inherit',
  } as CSSProperties,
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resendBtn: {
    background: 'none',
    border: 'none',
    padding: 0,
    fontSize: '0.7rem',
    fontWeight: 900,
    color: '#6366f1',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  } as CSSProperties,

  inputWrap: { position: 'relative' },
  inputIcon: {
    position: 'absolute',
    left: '1.1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255,255,255,0.2)',
    pointerEvents: 'none',
    zIndex: 2,
  },
  input: {
    width: '100%',
    padding: '1.1rem 1.1rem 1.1rem 3rem',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '1rem',
    color: 'white',
    fontSize: '1rem',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s',
  } as CSSProperties,
  errorPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(239,68,68,0.05)',
    border: '1px solid rgba(239,68,68,0.15)',
    color: '#f87171',
    fontSize: '0.85rem',
    fontWeight: 700,
    padding: '1rem 1.25rem',
    borderRadius: '1rem',
  },
  submitBtn: {
    width: '100%',
    padding: '1.1rem',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    fontWeight: 900,
    fontSize: '1rem',
    borderRadius: '1rem',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 15px 30px rgba(99,102,241,0.3)',
    marginTop: '0.5rem',
    letterSpacing: '0.1rem',
    fontFamily: 'inherit',
    transition: 'all 0.3s',
  } as CSSProperties,
  successState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '3rem 0',
  } as CSSProperties,
  successIcon: {
    width: 80,
    height: 80,
    background: 'rgba(16,185,129,0.1)',
    borderRadius: '1.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#34d399',
    border: '1px solid rgba(16,185,129,0.2)',
    boxShadow: '0 0 40px rgba(16,185,129,0.2)',
  },
  successText: { color: 'white', fontWeight: 900, fontSize: '1.25rem', margin: 0 },

};

// ─── Modal Inner ──────────────────────────────────────────────────────────────

interface AuthModalInnerProps {
  hint?: string;
  onClose: () => void;
  onSuccess: () => void;
}

function AuthModalInner({ hint, onClose, onSuccess }: AuthModalInnerProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSendOtp = async () => {
    if (!loginIdentifier) {
      setError("Enter phone number first");
      return;
    }
    setIsLoading(true);
    setError('');
    const result = await sendOtp(loginIdentifier);
    setIsLoading(false);
    if (result.success) {
      setIsOtpSent(true);
      setTimer(60);
      toast.success("OTP sent!");
      if (result.debug_code) setLoginOtp(result.debug_code);
    } else {
      setError(result.error || "Failed to send OTP");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const loginParams = loginMode === 'password'
      ? { identifier: loginIdentifier, password: loginPassword }
      : { identifier: loginIdentifier, otp: loginOtp };

    const result = await signIn('credentials', { ...loginParams, redirect: false });
    if (result?.error) {
      setError(t.auth.invalid);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setTimeout(onSuccess, 800);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const data = new FormData();
    data.append('name', regName);
    if (regEmail) data.append('email', regEmail);
    if (regPhone) data.append('phone', regPhone);
    data.append('password', regPassword);
    
    if (!regEmail && !regPhone) {
      setError("Email or Phone is required");
      setIsLoading(false);
      return;
    }

    const result = await registerUser(data);
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }
    const loginResult = await signIn('credentials', { 
      identifier: regEmail || regPhone, 
      password: regPassword, 
      redirect: false 
    });
    if (loginResult?.error) {
      setError(t.auth.invalid);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setTimeout(onSuccess, 800);
    }
  };

  return (
    <>
      <motion.div
        key="auth-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={s.backdrop}
        onClick={onClose}
      />

      <div style={s.centerer}>
        <motion.div
          key="auth-modal"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          style={s.shell}
          role="dialog"
          aria-modal="true"
          onClick={e => e.stopPropagation()}
        >
          <div style={s.scanline} />
          
          <button onClick={onClose} style={s.closeBtn} aria-label="Close">
            <X size={16} />
          </button>

          <div style={s.header}>
            <div style={s.iconWrap}>{loginMode === 'password' ? <Car size={22} /> : <Smartphone size={22} />}</div>
            {hint && (
              <div style={s.hint}>
                <Sparkles size={12} />
                <span>{hint}</span>
              </div>
            )}
            <h2 style={s.title}>{tab === 'login' ? (loginMode === 'password' ? t.auth.systemAccess : t.auth.secureEntry) : t.registration.title}</h2>
            <p style={s.subtitle}>{tab === 'login' ? (loginMode === 'password' ? t.auth.passAuthDesc : t.auth.otpAuthDesc) : t.registration.subtitle}</p>
          </div>

          <div style={s.tabBar}>
            <button
              style={{ ...s.tab, ...(tab === 'login' ? s.tabActive : {}) }}
              onClick={() => { setTab('login'); setError(''); }}
            >
              {t.auth.loginBtn}
            </button>
            <button
              style={{ ...s.tab, ...(tab === 'register' ? s.tabActive : {}) }}
              onClick={() => { setTab('register'); setError(''); }}
            >
              {t.auth.createAccount}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={s.successState}
              >
                <div style={s.successIcon}><ShieldCheck size={34} /></div>
                <p style={s.successText}>{t.plateDetail.sent}</p>
              </motion.div>
            ) : (
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === 'login' ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === 'login' ? 16 : -16 }}
                transition={{ duration: 0.18 }}
              >
                {tab === 'login' ? (
                  <>
                    <div style={s.modeSwitcher}>
                      <button 
                        style={{ ...s.modeBtn, ...(loginMode === 'password' ? s.modeBtnActive : {}) }}
                        onClick={() => { setLoginMode('password'); setError(''); }}
                      >{t.auth.loginModePass}</button>
                      <button 
                        style={{ ...s.modeBtn, ...(loginMode === 'otp' ? s.modeBtnActive : {}) }}
                        onClick={() => { setLoginMode('otp'); setError(''); }}
                      >{t.auth.loginModeOtp}</button>
                    </div>

                    <form onSubmit={handleLogin} style={s.form}>
                      <div>
                        <label style={s.fieldLabel}>{loginMode === 'password' ? (t.auth.email + ' / ' + t.auth.phone) : t.auth.phoneLabel}</label>
                        <div style={s.inputWrap}>
                          <span style={s.inputIcon}>{loginMode === 'password' ? <User size={15} /> : <Smartphone size={15} />}</span>
                          <input
                            type="text" placeholder={loginMode === 'otp' ? "+998 90 123 45 67" : "Email or Phone"}
                            value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)}
                            required autoFocus style={s.input}
                          />
                        </div>
                      </div>

                      {loginMode === 'password' ? (
                        <div>
                          <label style={s.fieldLabel}>{t.auth.password}</label>
                          <div style={s.inputWrap}>
                            <span style={s.inputIcon}><Lock size={15} /></span>
                            <input
                              type="password" placeholder="••••••••"
                              value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                              required style={s.input}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={s.labelRow}>
                            <label style={s.fieldLabel}>{t.auth.otp}</label>
                            <button type="button" style={s.resendBtn} onClick={handleSendOtp} disabled={isLoading || timer > 0}>
                              {timer > 0 ? `${timer}s` : (isOtpSent ? t.auth.resendCode : t.auth.requestCode)}
                            </button>
                          </div>
                          <div style={s.inputWrap}>
                            <span style={s.inputIcon}><ShieldCheck size={15} /></span>
                            <input
                              type="text" placeholder="••••••" maxLength={6}
                              value={loginOtp} onChange={e => setLoginOtp(e.target.value)}
                              required={isOtpSent} disabled={!isOtpSent} style={s.input}
                            />
                          </div>
                        </div>
                      )}

                      {error && (
                        <div style={s.errorPill}><AlertCircle size={14} /><span>{error}</span></div>
                      )}
                      <button type="submit" style={s.submitBtn} disabled={isLoading || (loginMode === 'otp' && !isOtpSent)}>
                        {isLoading ? <Spinner /> : (loginMode === 'password' ? t.auth.loginBtn : t.auth.establishLink)}
                      </button>
                    </form>
                  </>
                ) : (
                  <form onSubmit={handleRegister} style={s.form}>
                    <div>
                      <label style={s.fieldLabel}>{t.registration.fullName}</label>
                      <div style={s.inputWrap}>
                        <span style={s.inputIcon}><User size={15} /></span>
                        <input
                          type="text" placeholder="Muhammad"
                          value={regName} onChange={e => setRegName(e.target.value)}
                          required autoFocus style={s.input}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={s.fieldLabel}>{t.registration.commEmail}</label>
                      <div style={s.inputWrap}>
                        <span style={s.inputIcon}><Mail size={15} /></span>
                        <input
                          type="email" placeholder="name@example.com"
                          value={regEmail} onChange={e => setRegEmail(e.target.value)}
                          style={s.input}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={s.fieldLabel}>{t.registration.phone}</label>
                      <div style={s.inputWrap}>
                        <span style={s.inputIcon}><Smartphone size={15} /></span>
                        <input
                          type="tel" placeholder="+998 90 123 45 67"
                          value={regPhone} onChange={e => setRegPhone(e.target.value)}
                          style={s.input}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={s.fieldLabel}>{t.registration.securityKey}</label>
                      <div style={s.inputWrap}>
                        <span style={s.inputIcon}><Lock size={15} /></span>
                        <input
                          type="password" placeholder="••••••••" minLength={6}
                          value={regPassword} onChange={e => setRegPassword(e.target.value)}
                          required style={s.input}
                        />
                      </div>
                    </div>
                    {error && (
                      <div style={s.errorPill}><AlertCircle size={14} /><span>{error}</span></div>
                    )}
                    <button type="submit" style={s.submitBtn} disabled={isLoading}>
                      {isLoading ? <Spinner /> : t.registration.enlistNow}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

function Spinner() {
  return (
    <span style={{
      width: 18, height: 18,
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: 'white',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'auth-spin 0.7s linear infinite',
    }}>
      <style>{`@keyframes auth-spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}
