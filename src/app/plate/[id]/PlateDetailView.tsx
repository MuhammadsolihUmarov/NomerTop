'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, MessageSquare, ArrowLeft, Clock, ShieldCheck, Camera, Share2, Shield } from 'lucide-react';
import { formatPlateDisplay } from '@/lib/utils';
import { sendMessage } from '@/lib/actions';
import { toast } from 'sonner';

import { useTranslation } from '@/components/LanguageProvider';

interface PlateDetailViewProps {
  plateNumber: string;
  isRegistered: boolean;
  plateData?: any;
}

export default function PlateDetailView({ plateNumber, isRegistered, plateData }: PlateDetailViewProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message) return;

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('message', message);
    formData.append('plateNumber', plateNumber);
    formData.append('isQuickMsg', t.plateDetail.quickMsgs.includes(message) ? 'true' : 'false');

    const result = await sendMessage(formData);

    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setIsSent(true);
      toast.success(t.plateDetail.sent);
    }
  };

  const handleQuickMsg = (msg: string) => {
    setMessage(msg);
  };

  const photos = plateData?.photos || [
    { url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800' },
    { url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <div className="plate-page">
      <div className="container">
        <header className="page-header">
          <button onClick={() => window.history.back()} className="btn-back glass">
            <ArrowLeft size={18} />
            <span>{t.plateDetail.return}</span>
          </button>
          <button className="btn-share glass" onClick={() => toast.success('Profile link copied!')}>
            <Share2 size={18} />
          </button>
        </header>

        <main className="plate-content">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="plate-profile-card glass"
          >
            <div className="profile-identity">
              <div className="plate-display-premium">
                <div className="plate-inner-wrap">
                  <div className="uz-strip"></div>
                  <span className="plate-text-large">{formatPlateDisplay(plateNumber, plateData?.country || 'UZ')}</span>
                </div>
              </div>
              
              <div className="identity-tags">
                <div className="badge-handle">@IDENTITY</div>
                {isRegistered ? (
                  <div className="status-badge verified">
                    <ShieldCheck size={14} />
                    <span>{t.plateDetail.verified}</span>
                  </div>
                ) : (
                  <div className="status-badge unclaimed">
                    <Clock size={14} />
                    <span>{t.plateDetail.unclaimed}</span>
                  </div>
                )}
              </div>
            </div>

            {isRegistered && (
              <div className="vehicle-intel">
                <h3>{plateData?.brand || 'CHEVROLET'} <span>{plateData?.model || 'GENTRA'}</span></h3>
                <div className="intel-grid">
                  <div className="intel-item">
                    <label>{t.plateDetail.color}</label>
                    <span>{plateData?.color || 'WHITE PEARL'}</span>
                  </div>
                  <div className="intel-item">
                    <label>{t.plateDetail.network}</label>
                    <span>NOMER-NET</span>
                  </div>
                </div>
              </div>
            )}

            <div className="visual-verification-section">
              <div className="section-title">
                <Camera size={16} />
                <span>{t.plateDetail.visualVer}</span>
              </div>
              <div className="photo-gallery">
                {photos.map((photo: any, i: number) => (
                  <div key={i} className="gallery-item glass">
                    <img src={photo.url} alt={`Vehicle Verification ${i+1}`} />
                  </div>
                ))}
              </div>
            </div>

            <p className="privacy-memo">
              {isRegistered 
                ? t.plateDetail.privacyOwner
                : t.plateDetail.privacyGuest}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div 
                key="dispatch"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="dispatch-focal glass"
              >
                <div className="dispatch-header">
                  <div className="title-row">
                    <MessageSquare size={24} className="glow-icon" />
                    <h2>{t.plateDetail.dispatch}</h2>
                  </div>
                  <div className="privacy-badge glass">
                    <Shield size={14} className="text-secondary" />
                    <span>{t.hero.trust.privacy}</span>
                  </div>
                </div>

                <div className="quick-signal-grid">
                  {t.plateDetail.quickMsgs.map((msg, i) => (
                    <button 
                      key={i} 
                      className={`signal-pill ${message === msg ? 'active' : ''}`}
                      onClick={() => handleQuickMsg(msg)}
                    >
                      {msg}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSend} className="message-form">
                  <div className="textarea-wrapper">
                    <textarea 
                      placeholder={t.plateDetail.compose}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      required
                    />
                    <div className="glow-border"></div>
                  </div>
                  
                  {error && <div className="error-log">{error}</div>}

                  <button 
                    type="submit" 
                    className="btn-dispatch-signal"
                    disabled={isLoading || !message}
                  >
                    {isLoading ? <div className="spinner"></div> : (
                      <>
                        <span>{t.plateDetail.send}</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="success-state glass"
              >
                <div className="success-icon-wrap">
                  <CheckCircle size={60} />
                </div>
                <h2>{t.plateDetail.sent}</h2>
                <p>Transmission ID <strong>#{Math.floor(Math.random() * 999999).toString(16).toUpperCase()}</strong> has been secured.</p>
                <div className="success-actions">
                  <button onClick={() => setIsSent(false)} className="btn-secondary">{t.plateDetail.newSignal}</button>
                  <a href="/search" className="btn-primary">{t.plateDetail.returnRadar}</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <style jsx>{`
        .plate-page { padding: 6rem 0 12rem; min-height: 100vh; position: relative; }
        .container { max-width: 900px; margin: 0 auto; padding: 0 1.5rem; }
        
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5rem; }
        .btn-back, .btn-share { 
          display: flex; align-items: center; gap: 0.75rem; 
          padding: 0.85rem 1.5rem; border-radius: 1rem; 
          color: var(--muted-foreground); font-weight: 800; 
          transition: 0.3s; 
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .btn-back:hover, .btn-share:hover { color: white; background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }

        .plate-profile-card { 
          padding: 5rem; border-radius: 4rem; 
          margin-bottom: 5rem; position: relative; overflow: hidden;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 50px 100px -20px rgba(0,0,0,0.6);
        }
        
        .profile-identity { display: flex; align-items: center; gap: 4rem; margin-bottom: 5rem; flex-wrap: wrap; }
        
        .plate-display-premium { 
          background: #f8fafc; border: 10px solid #1e293b; border-radius: 2rem; 
          padding: 2rem 4.5rem; position: relative; 
          box-shadow: 
            0 30px 60px rgba(0,0,0,0.5), 
            inset 0 4px 8px rgba(255,255,255,0.8),
            0 0 0 1px rgba(0,0,0,0.1);
          transform: perspective(1000px) rotateY(-5deg);
          transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .plate-display-premium:hover { transform: perspective(1000px) rotateY(0deg) scale(1.05); }
        
        .plate-inner-wrap { display: flex; align-items: center; gap: 2.5rem; }
        .uz-strip { width: 14px; height: 70px; background: linear-gradient(#0099ff 33%, #fff 33%, #fff 66%, #10b981 66%); border-radius: 4px; }
        .plate-text-large { font-size: 4rem; font-weight: 950; color: #000; font-family: 'Outfit', sans-serif; letter-spacing: 6px; }
        
        .identity-tags { display: flex; flex-direction: column; gap: 1.25rem; }
        .badge-handle { font-family: 'Outfit'; font-weight: 900; color: var(--primary); font-size: 1.5rem; letter-spacing: 0.05em; }
        .status-badge { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1.25rem; border-radius: 99rem; font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; width: fit-content; }
        .status-badge.verified { background: rgba(99, 102, 241, 0.1); color: var(--primary); border: 1px solid rgba(99, 102, 241, 0.2); box-shadow: 0 0 20px rgba(99, 102, 241, 0.1); }
        .status-badge.unclaimed { background: rgba(244, 63, 94, 0.1); color: var(--accent); border: 1px solid rgba(244, 63, 94, 0.2); }

        .vehicle-intel { margin-bottom: 5rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4rem; }
        .vehicle-intel h3 { font-size: 2.5rem; font-weight: 900; margin-bottom: 2rem; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .vehicle-intel h3 span { color: var(--muted-foreground); font-weight: 500; font-size: 1.5rem; margin-left: 1rem; }
        
        .intel-grid { display: flex; gap: 6rem; }
        .intel-item label { display: block; font-size: 0.75rem; font-weight: 900; color: var(--muted-foreground); margin-bottom: 1rem; letter-spacing: 0.15em; text-transform: uppercase; }
        .intel-item span { font-weight: 800; color: white; font-size: 1.25rem; }

        .visual-verification-section { margin-bottom: 5rem; }
        .section-title { display: flex; align-items: center; gap: 1rem; font-size: 0.85rem; font-weight: 900; color: var(--muted-foreground); margin-bottom: 2.5rem; letter-spacing: 0.15em; text-transform: uppercase; }
        .photo-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 2rem; }
        .gallery-item { aspect-ratio: 16/10; border-radius: 2rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: 0.7s cubic-bezier(0.19, 1, 0.22, 1); }
        .gallery-item:hover img { transform: scale(1.1) rotate(1deg); filter: brightness(1.1); }

        .privacy-memo { color: var(--muted-foreground); font-size: 1.1rem; line-height: 1.8; max-width: 600px; margin-top: 3rem; border-left: 4px solid var(--primary); padding-left: 2rem; background: rgba(99, 102, 241, 0.03); padding: 1.5rem 2rem; border-radius: 0 1.5rem 1.5rem 0; }

        .dispatch-focal { padding: 5rem; border-radius: 4rem; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 30px 80px -20px rgba(0,0,0,0.5); }
        .dispatch-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; margin-bottom: 4.5rem; }
        .dispatch-header .title-row { display: flex; align-items: center; gap: 1.5rem; }
        .privacy-badge { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; border-radius: 1rem; font-size: 0.8rem; font-weight: 800; color: var(--muted-foreground); border-color: rgba(16, 185, 129, 0.1); background: rgba(16, 185, 129, 0.02); }
        .glow-icon { color: var(--primary); filter: drop-shadow(0 0 15px var(--primary-glow)); }
        .dispatch-header h2 { font-size: 2.75rem; font-weight: 950; letter-spacing: -0.02em; }

        .quick-signal-grid { display: flex; flex-wrap: wrap; gap: 1.25rem; margin-bottom: 4rem; }
        .signal-pill { 
          padding: 1rem 1.75rem; border-radius: 1.25rem; 
          background: rgba(255,255,255,0.03); border: 1px solid var(--border); 
          color: var(--muted-foreground); font-weight: 800; transition: 0.3s;
          font-size: 0.9rem;
        }
        .signal-pill:hover { background: rgba(255,255,255,0.08); color: white; border-color: rgba(255,255,255,0.15); transform: translateY(-3px); }
        .signal-pill.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 15px 30px var(--primary-glow); }

        .textarea-wrapper { position: relative; margin-bottom: 3.5rem; }
        textarea { 
          width: 100%; padding: 2.5rem; border-radius: 2.5rem; 
          border: 2px solid var(--border); background: rgba(0,0,0,0.4); 
          color: white; font-size: 1.4rem; line-height: 1.6; resize: none; transition: 0.4s;
          font-family: inherit;
        }
        textarea:focus { outline: none; border-color: var(--primary); background: rgba(0,0,0,0.6); box-shadow: 0 0 50px var(--primary-glow); }

        .btn-dispatch-signal { 
          background: var(--gradient-main); color: white; 
          padding: 1.75rem; border-radius: 2rem; 
          font-weight: 900; font-size: 1.25rem; 
          display: flex; align-items: center; justify-content: center; 
          gap: 1.5rem; width: 100%; 
          box-shadow: 0 20px 50px var(--primary-glow); 
          transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          letter-spacing: 0.05em;
        }
        .btn-dispatch-signal:hover:not(:disabled) { transform: translateY(-5px); filter: brightness(1.1); box-shadow: 0 30px 60px var(--primary-glow); }
        .btn-dispatch-signal:disabled { opacity: 0.4; cursor: not-allowed; }

        .success-state { padding: 8rem 4rem; text-align: center; border-radius: 4rem; border: 1px solid var(--primary); background: rgba(99, 102, 241, 0.02); box-shadow: 0 0 100px var(--primary-glow); }
        .success-icon-wrap { color: var(--primary); margin-bottom: 4rem; filter: drop-shadow(0 0 30px var(--primary-glow)); }
        .success-state h2 { font-size: 3.5rem; font-weight: 950; margin-bottom: 2rem; letter-spacing: -0.02em; }
        .success-state p { font-size: 1.4rem; color: var(--muted-foreground); margin-bottom: 5rem; }
        
        .success-actions { display: flex; gap: 2rem; justify-content: center; }
        .btn-primary { background: var(--gradient-main); color: white; padding: 1.25rem 2.5rem; border-radius: 1.25rem; font-weight: 850; box-shadow: 0 15px 30px var(--primary-glow); }
        .btn-secondary { background: rgba(255,255,255,0.05); color: white; padding: 1.25rem 2.5rem; border-radius: 1.25rem; font-weight: 850; border: 1px solid var(--border); }

        .spinner { width: 30px; height: 30px; border: 4px solid rgba(255,255,255,0.2); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 800px) {
          .profile-identity { gap: 3rem; justify-content: center; text-align: center; }
          .identity-tags { align-items: center; }
          .plate-text-large { font-size: 2.5rem; }
          .plate-display-premium { padding: 1.5rem 2.5rem; }
          .plate-profile-card { padding: 3rem 1.5rem; border-radius: 3rem; }
          .dispatch-focal { padding: 3rem 1.5rem; border-radius: 3rem; }
          .success-state { padding: 5rem 1.5rem; }
          .success-state h2 { font-size: 2.25rem; }
          .intel-grid { gap: 3rem; flex-wrap: wrap; justify-content: center; }
          .vehicle-intel h3 { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
}
