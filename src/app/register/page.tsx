'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Smartphone, Mail, Lock, AlertCircle, ArrowRight, UserPlus } from 'lucide-react';
import { registerUser } from '@/lib/actions';
import { useTranslation } from '@/components/LanguageProvider';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('password', formData.password);

    const result = await registerUser(data);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/login?registered=true');
    }
  };

  return (
    <div className="register-focal-page">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="auth-card-premium glass-card-premium"
        >
          <div className="auth-header">
            <div className="auth-icon-wrap"><UserPlus size={28} /></div>
            <h1>{t.registration.title}</h1>
            <p>{t.registration.subtitle}</p>
          </div>

      <form onSubmit={handleRegister} className="auth-focal-form">
            <div className="focal-group">
              <label>{t.registration.fullName}</label>
              <div className="focal-input-wrap">
                <User size={18} className="focal-icon" />
                <input 
                  type="text" 
                  placeholder="Muhammad" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="focal-group-row">
              <div className="focal-group">
                <label>{t.registration.commEmail}</label>
                <div className="focal-input-wrap">
                  <Mail size={18} className="focal-icon" />
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="focal-group">
                <label>{t.registration.phone}</label>
                <div className="focal-input-wrap">
                  <Smartphone size={18} className="focal-icon" />
                  <input 
                    type="tel" 
                    placeholder="+998 90 123 45 67" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="focal-group">
              <label>{t.registration.securityKey}</label>
              <div className="focal-input-wrap">
                <Lock size={18} className="focal-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

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

            <button type="submit" className="btn-auth-premium" disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : (
                <>
                  <span>{t.registration.enlistNow}</span>
                  <ArrowRight size={18} className="btn-icon-move" />
                </>
              )}
            </button>
          </form>

          <footer className="auth-footer-premium">
            <p>{t.registration.alreadyEnlisted} <a href="/login" className="link-glitch">{t.registration.verifyIdentity}</a></p>
          </footer>
        </motion.div>
      </div>

      <style jsx>{`
        .register-focal-page { 
          padding: 4rem 0; 
          min-height: 90vh; 
          display: flex; 
          align-items: center; 
          position: relative;
        }
        .container { max-width: 540px; margin: 0 auto; width: 100%; padding: 0 1.5rem; }
        
        .auth-card-premium { 
          padding: 3rem 2.5rem; border-radius: 2rem; text-align: center; 
          position: relative;
          overflow: hidden;
        }

        .auth-card-premium::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.4), transparent);
          animation: scanline 4s linear infinite;
        }

        @keyframes scanline {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(600px); opacity: 0; }
        }
        
        .auth-icon-wrap { 
          width: 56px; height: 56px; background: rgba(16, 185, 129, 0.1); border-radius: 1.25rem; 
          display: flex; align-items: center; justify-content: center; color: var(--secondary); 
          margin: 0 auto 1.5rem; border: 1px solid rgba(16, 185, 129, 0.15);
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.15); 
        }
        
        h1 { font-size: 2.2rem; font-weight: 950; margin-bottom: 0.5rem; letter-spacing: -0.03em; color: white; }
        p { color: rgba(255,255,255,0.35); margin-bottom: 2rem; font-size: 0.9rem; font-weight: 600; }

        .auth-focal-form { display: flex; flex-direction: column; gap: 1.5rem; text-align: left; }
        .focal-group-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        
        .focal-group label { 
          display: block; font-weight: 900; font-size: 0.72rem; 
          text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.25); 
          margin-bottom: 0.75rem; padding-left: 0.25rem;
        }
        
        .focal-input-wrap { position: relative; display: flex; align-items: center; }
        .focal-icon { position: absolute; left: 1.25rem; color: rgba(255,255,255,0.15); transition: color 0.3s; z-index: 2; pointer-events: none; }
        
        .focal-input-wrap input { 
          width: 100%; padding: 1.1rem 1.25rem 1.1rem 3.25rem; border-radius: 1.1rem; 
          border: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.4); 
          color: white; font-size: 0.95rem; transition: all 0.3s;
          font-family: inherit; font-weight: 600;
        }
        .focal-input-wrap input:focus { border-color: rgba(16, 185, 129, 0.4); background: rgba(0,0,0,0.6); }
        .focal-input-wrap input:focus ~ .focal-icon { color: var(--secondary); }

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
        .auth-footer-premium a { color: var(--secondary); font-weight: 850; text-decoration: none; }
        .auth-footer-premium a:hover { text-decoration: underline; }

        .spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.2); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .focal-group-row { grid-template-columns: 1fr; gap: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
