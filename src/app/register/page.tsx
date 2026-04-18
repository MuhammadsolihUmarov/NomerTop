'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Lock, AlertCircle, ArrowRight, UserPlus } from 'lucide-react';
import { registerUser } from '@/lib/actions';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="auth-card-premium glass"
        >
          <div className="auth-header">
            <div className="auth-icon-wrap"><UserPlus size={32} /></div>
            <h1>Create Identity</h1>
            <p>Join the elite fleet management network. Privacy is absolute.</p>
          </div>

          <form onSubmit={handleRegister} className="auth-focal-form">
            <div className="focal-group">
              <label>Full Operative Name</label>
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

            <div className="focal-group">
              <label>Communication Email</label>
              <div className="focal-input-wrap">
                <Mail size={18} className="focal-icon" />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="focal-group">
              <label>Security Key</label>
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
              <div className="auth-error glass">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-primary-focal" disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : (
                <>
                  <span>ENLIST NOW</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <footer className="auth-footer">
            <p>Already enlisted? <a href="/login">Verify Identity</a></p>
          </footer>
        </motion.div>
      </div>

      <style jsx>{`
        .register-focal-page { padding: 4rem 0; min-height: 95vh; display: flex; align-items: center; }
        .container { max-width: 500px; margin: 0 auto; width: 100%; padding: 0 1.5rem; }
        
        .auth-card-premium { padding: 4rem; border-radius: 3.5rem; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
        
        .auth-icon-wrap { width: 70px; height: 70px; background: rgba(16, 185, 129, 0.1); border-radius: 1.5rem; display: flex; align-items: center; justify-content: center; color: var(--primary); margin: 0 auto 2rem; box-shadow: 0 0 30px var(--primary-glow); }
        
        h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
        p { color: var(--muted-foreground); margin-bottom: 3rem; font-size: 0.95rem; }

        .auth-focal-form { display: flex; flex-direction: column; gap: 1.5rem; text-align: left; }
        .focal-group label { display: block; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground); margin-bottom: 0.6rem; }
        
        .focal-input-wrap { position: relative; display: flex; align-items: center; }
        .focal-icon { position: absolute; left: 1.25rem; color: var(--muted-foreground); transition: color 0.3s; }
        
        .focal-input-wrap input { width: 100%; padding: 1.1rem 1.1rem 1.1rem 3.5rem; border-radius: 1.25rem; border: 1px solid var(--border); background: rgba(0,0,0,0.3); color: white; font-size: 1rem; transition: all 0.3s; }
        .focal-input-wrap input:focus { outline: none; border-color: var(--primary); background: rgba(0,0,0,0.5); }
        .focal-input-wrap input:focus + .focal-icon { color: var(--primary); }

        .auth-error { display: flex; align-items: center; gap: 0.75rem; color: #ef4444; font-size: 0.85rem; padding: 1rem; border-radius: 1rem; border-color: rgba(239, 68, 68, 0.2); }
        
        .btn-primary-focal { background: var(--primary); color: white; padding: 1.25rem; border-radius: 1.25rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.75rem; box-shadow: 0 10px 20px var(--primary-glow); width: 100%; margin-top: 1rem; }
        .btn-primary-focal:hover { transform: translateY(-3px); filter: brightness(1.1); }

        .auth-footer { margin-top: 2.5rem; font-size: 0.9rem; color: var(--muted-foreground); }
        .auth-footer a { color: var(--primary); font-weight: 800; }

        .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
