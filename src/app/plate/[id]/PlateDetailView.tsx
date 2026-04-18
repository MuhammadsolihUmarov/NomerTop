'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, MessageSquare, ArrowLeft, Clock, ShieldCheck, Camera, Share2 } from 'lucide-react';
import { formatPlateDisplay } from '@/lib/utils';
import { sendMessage } from '@/lib/actions';
import { toast } from 'sonner';

const QUICK_MESSAGES = [
  "Your lights are on!",
  "Your car is blocking mine.",
  "You left a window open.",
  "Please move your car.",
  "Did you forget your keys?",
];

interface PlateDetailViewProps {
  plateNumber: string;
  isRegistered: boolean;
  plateData?: any;
}

export default function PlateDetailView({ plateNumber, isRegistered, plateData }: PlateDetailViewProps) {
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
    formData.append('isQuickMsg', QUICK_MESSAGES.includes(message) ? 'true' : 'false');

    const result = await sendMessage(formData);

    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setIsSent(true);
      toast.success('Signal dispatched successfully!');
    }
  };

  const handleQuickMsg = (msg: string) => {
    setMessage(msg);
    toast.info('Quick message selected');
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
            <span>Return to Fleet</span>
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
                <div className="badge-handle">@IDENTITY_HANDLE</div>
                {isRegistered ? (
                  <div className="status-badge verified">
                    <ShieldCheck size={14} />
                    <span>AUTHENTICATED</span>
                  </div>
                ) : (
                  <div className="status-badge unclaimed">
                    <Clock size={14} />
                    <span>UNCLAIMED PROTOCOL</span>
                  </div>
                )}
              </div>
            </div>

            {isRegistered && (
              <div className="vehicle-intel">
                <h3>{plateData?.brand || 'CHEVROLET'} <span>{plateData?.model || 'GENTRA'}</span></h3>
                <div className="intel-grid">
                  <div className="intel-item">
                    <label>COLOR</label>
                    <span>{plateData?.color || 'WHITE PEARL'}</span>
                  </div>
                  <div className="intel-item">
                    <label>NETWORK</label>
                    <span>GLOBAL MESH</span>
                  </div>
                </div>
              </div>
            )}

            <div className="visual-verification-section">
              <div className="section-title">
                <Camera size={16} />
                <span>VISUAL VERIFICATION</span>
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
                ? "Secure end-to-end encrypted channel. Signals are routed directly to the owner's vault."
                : "This handle is not yet registered. Signal will be stored in escrow and released upon valid ownership claim."}
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
                  <MessageSquare size={20} className="glow-icon" />
                  <h2>Dispatch Signal</h2>
                </div>

                <div className="quick-signal-grid">
                  {QUICK_MESSAGES.map((msg, i) => (
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
                      placeholder="Compose secure transmission..."
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
                        <span>INITIALIZE DISPATCH</span>
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
                <h2>SIGNAL DELIVERED</h2>
                <p>Transmission ID <strong>#{Math.floor(Math.random() * 999999).toString(16).toUpperCase()}</strong> has been secured in the global mesh.</p>
                <div className="success-actions">
                  <button onClick={() => setIsSent(false)} className="btn-secondary">New Signal</button>
                  <a href="/search" className="btn-primary">Return to Radar</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <style jsx>{`
        .plate-page { padding: 4rem 0 10rem; min-height: 100vh; }
        .container { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
        
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4rem; }
        .btn-back, .btn-share { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; border-radius: 99rem; color: var(--muted-foreground); font-weight: 700; transition: 0.2s; border: 1px solid rgba(255,255,255,0.05); }
        .btn-back:hover, .btn-share:hover { color: white; background: rgba(255,255,255,0.1); }

        .plate-profile-card { padding: 4rem; border-radius: 4rem; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 4rem; position: relative; overflow: hidden; }
        
        .profile-identity { display: flex; align-items: center; gap: 3rem; margin-bottom: 4rem; flex-wrap: wrap; }
        
        .plate-display-premium { background: #f8fafc; border: 8px solid #1e293b; border-radius: 1.5rem; padding: 1.5rem 3rem; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.8); }
        .plate-inner-wrap { display: flex; align-items: center; gap: 2rem; }
        .uz-strip { width: 10px; height: 50px; background: linear-gradient(#0099ff 33%, #fff 33%, #fff 66%, #10b981 66%); border-radius: 3px; }
        .plate-text-large { font-size: 3rem; font-weight: 900; color: #000; font-family: 'Courier New', monospace; letter-spacing: 4px; }
        
        .identity-tags { display: flex; flex-direction: column; gap: 1rem; }
        .badge-handle { font-family: 'Outfit'; font-weight: 800; color: var(--primary); font-size: 1.25rem; letter-spacing: 0.1em; }
        .status-badge { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 99rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; width: fit-content; }
        .status-badge.verified { background: rgba(16, 185, 129, 0.1); color: var(--primary); border: 1px solid rgba(16, 185, 129, 0.2); }
        .status-badge.unclaimed { background: rgba(245, 158, 11, 0.1); color: var(--accent); border: 1px solid rgba(245, 158, 11, 0.2); }

        .vehicle-intel { margin-bottom: 4rem; border-top: 1px solid var(--border); padding-top: 3rem; }
        .vehicle-intel h3 { font-size: 2rem; font-weight: 800; margin-bottom: 1.5rem; }
        .vehicle-intel h3 span { color: var(--muted-foreground); font-weight: 400; }
        
        .intel-grid { display: flex; gap: 4rem; }
        .intel-item label { display: block; font-size: 0.7rem; font-weight: 800; color: var(--muted-foreground); margin-bottom: 0.5rem; letter-spacing: 0.1em; }
        .intel-item span { font-weight: 700; color: white; font-size: 1.1rem; }

        .visual-verification-section { margin-bottom: 4rem; }
        .section-title { display: flex; align-items: center; gap: 1rem; font-size: 0.8rem; font-weight: 800; color: var(--muted-foreground); margin-bottom: 2rem; letter-spacing: 0.1em; }
        .photo-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; }
        .gallery-item { aspect-ratio: 16/10; border-radius: 1.5rem; overflow: hidden; border: 1px solid var(--border); }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .gallery-item:hover img { transform: scale(1.1); }

        .privacy-memo { color: var(--muted-foreground); font-size: 1rem; line-height: 1.7; max-width: 500px; margin-top: 2rem; border-left: 3px solid var(--primary); padding-left: 1.5rem; }

        .dispatch-focal { padding: 4rem; border-radius: 3rem; border: 1px solid rgba(255,255,255,0.05); }
        .dispatch-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 3rem; }
        .glow-icon { color: var(--primary); filter: drop-shadow(0 0 10px var(--primary-glow)); }
        .dispatch-header h2 { font-size: 2rem; font-weight: 800; }

        .quick-signal-grid { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 3.5rem; }
        .signal-pill { padding: 0.8rem 1.5rem; border-radius: 99rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border); color: var(--muted-foreground); font-weight: 700; transition: 0.2s; }
        .signal-pill:hover { background: rgba(255,255,255,0.06); color: white; }
        .signal-pill.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 0 20px var(--primary-glow); }

        .textarea-wrapper { position: relative; margin-bottom: 2.5rem; }
        textarea { width: 100%; padding: 2rem; border-radius: 2rem; border: 2px solid var(--border); background: rgba(0,0,0,0.3); color: white; font-size: 1.25rem; line-height: 1.6; resize: none; transition: 0.3s; }
        textarea:focus { outline: none; border-color: var(--primary); background: rgba(0,0,0,0.5); }

        .btn-dispatch-signal { background: var(--primary); color: white; padding: 1.5rem; border-radius: 1.5rem; font-weight: 800; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; gap: 1.25rem; width: 100%; box-shadow: 0 15px 30px var(--primary-glow); transition: 0.3s; }
        .btn-dispatch-signal:hover:not(:disabled) { transform: translateY(-3px); filter: brightness(1.1); }
        .btn-dispatch-signal:disabled { opacity: 0.5; cursor: not-allowed; }

        .success-state { padding: 6rem 4rem; text-align: center; border-radius: 3rem; border: 1px solid var(--primary); background: rgba(16, 185, 129, 0.02); }
        .success-icon-wrap { color: var(--primary); margin-bottom: 3rem; filter: drop-shadow(0 0 20px var(--primary-glow)); }
        .success-state h2 { font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem; }
        .success-state p { font-size: 1.25rem; color: var(--muted-foreground); margin-bottom: 4rem; }
        
        .success-actions { display: flex; gap: 1.5rem; justify-content: center; }
        .btn-primary { background: var(--primary); color: white; padding: 1rem 2rem; border-radius: 1rem; font-weight: 700; }
        .btn-secondary { background: rgba(255,255,255,0.05); color: white; padding: 1rem 2rem; border-radius: 1rem; font-weight: 700; border: 1px solid var(--border); }

        .spinner { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 800px) {
          .profile-identity { gap: 2rem; justify-content: center; text-align: center; }
          .identity-tags { align-items: center; }
          .plate-text-large { font-size: 2rem; }
          .plate-profile-card { padding: 3rem 1.5rem; border-radius: 2.5rem; }
          .dispatch-focal { padding: 2.5rem 1.5rem; border-radius: 2.5rem; }
          .success-state { padding: 4rem 1.5rem; }
          .success-state h2 { font-size: 2rem; }
          .intel-grid { gap: 2rem; }
        }
      `}</style>
    </div>
  );
}
