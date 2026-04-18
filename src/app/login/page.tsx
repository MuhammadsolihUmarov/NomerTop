'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Lock, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/components/LanguageProvider';

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(t.auth.invalid);
      setIsLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="login-focal-page">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="auth-card-premium glass"
        >
          <div className="auth-header">
            <div className="auth-icon-wrap"><Lock size={32} /></div>
            <h1>{t.auth.title}</h1>
            <p>{t.auth.subtitle}</p>
          </div>

          <form onSubmit={handleLogin} className="auth-focal-form">
            <div className="focal-group">
              <label>{t.auth.email}</label>
              <div className="focal-input-wrap">
                <User size={18} className="focal-icon" />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="focal-group">
              <label>{t.auth.password}</label>
              <div className="focal-input-wrap">
                <Lock size={18} className="focal-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="auth-error glass">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-primary-focal" disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : t.auth.loginBtn}
            </button>
          </form>

          <footer className="auth-footer">
            <p>{t.auth.newUser} <a href="/register">{t.auth.createAccount}</a></p>
          </footer>
        </motion.div>
      </div>

      <style jsx>{`
        .login-focal-page { padding: 4rem 0; min-height: 90vh; display: flex; align-items: center; }
        .container { max-width: 480px; margin: 0 auto; width: 100%; padding: 0 1.5rem; }
        
        .auth-card-premium { padding: 4rem; border-radius: 3rem; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
        
        .auth-icon-wrap { width: 70px; height: 70px; background: rgba(99, 102, 241, 0.1); border-radius: 1.5rem; display: flex; align-items: center; justify-content: center; color: var(--secondary); margin: 0 auto 2rem; box-shadow: 0 0 30px var(--secondary-glow); }
        
        h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
        p { color: var(--muted-foreground); margin-bottom: 3rem; font-size: 0.95rem; }

        .auth-focal-form { display: flex; flex-direction: column; gap: 2rem; text-align: left; }
        .focal-group label { display: block; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground); margin-bottom: 0.75rem; }
        
        .focal-input-wrap { position: relative; display: flex; align-items: center; }
        .focal-icon { position: absolute; left: 1.25rem; color: var(--muted-foreground); transition: color 0.3s; }
        
        .focal-input-wrap input { width: 100%; padding: 1.25rem 1.25rem 1.25rem 3.5rem; border-radius: 1.25rem; border: 1px solid var(--border); background: rgba(0,0,0,0.3); color: white; font-size: 1rem; transition: all 0.3s; }
        .focal-input-wrap input:focus { outline: none; border-color: var(--secondary); background: rgba(0,0,0,0.5); }
        .focal-input-wrap input:focus + .focal-icon { color: var(--secondary); }

        .auth-error { display: flex; align-items: center; gap: 0.75rem; color: #ef4444; font-size: 0.85rem; padding: 1rem; border-radius: 1rem; border-color: rgba(239, 68, 68, 0.2); }
        
        .btn-primary-focal { background: var(--secondary); color: white; padding: 1.25rem; border-radius: 1.25rem; font-weight: 800; letter-spacing: 0.1em; box-shadow: 0 10px 20px var(--secondary-glow); width: 100%; }
        .btn-primary-focal:hover { transform: translateY(-3px); filter: brightness(1.1); }

        .auth-footer { margin-top: 3rem; font-size: 0.9rem; color: var(--muted-foreground); }
        .auth-footer a { color: var(--secondary); font-weight: 800; }

        .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
