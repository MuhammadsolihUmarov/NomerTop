'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Car, ChevronRight, Camera, X, Shield, Globe } from 'lucide-react';
import { registerPlate } from '@/lib/actions';
import { toast } from 'sonner';

const detectCountry = (plate: string) => {
  const clean = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (!clean) return { code: 'OTH', flag: '🌐', name: 'Global' };

  if (/^\d{2}[A-Z]/.test(clean) || /^\d{2}\d{3}[A-Z]{3}/.test(clean)) return { code: 'UZ', flag: '🇺🇿', name: 'Uzbekistan' };
  if (/^[ABEKMHOPCTX]\d{3}[ABEKMHOPCTX]{2}/.test(clean)) return { code: 'RU', flag: '🇷🇺', name: 'Russia' };
  if (/^\d{3}[A-Z]{2,3}\d{2}/.test(clean)) return { code: 'KZ', flag: '🇰🇿', name: 'Kazakhstan' };

  return { code: 'OTH', flag: '🌐', name: 'Global' };
};

export default function RegisterPlate() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    color: ''
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const detected = useMemo(() => detectCountry(query), [query]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const data = new FormData();
    data.append('number', query.replace(/\s+/g, '').toUpperCase());
    data.append('country', detected.code);
    data.append('brand', formData.brand);
    data.append('model', formData.model);
    data.append('color', formData.color);
    photos.forEach(p => data.append('photos', p));

    const result = await registerPlate(data);
    
    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    } else {
      toast.success('Vehicle registered and secured!');
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="register-page-midnight">
      <div className="container">
        <header className="page-header">
          <button onClick={() => router.back()} className="btn-back glass">
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="registration-card glass"
        >
          <div className="form-header">
            <div className="icon-badge"><Car size={24} /></div>
            <h1>Register Vehicle</h1>
            <p>Connect your license plate to your digital identity.</p>
          </div>

          <form onSubmit={handleAction} className="registration-form">
            <div className="input-group">
              <label>Plate Number</label>
              <div className="smart-input-box">
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="01 A 777 AA"
                  className="smart-plate-input"
                  required
                />
                <div className="smart-badge">
                  <span>{detected.flag}</span>
                  <span className="smart-label">{detected.name}</span>
                </div>
              </div>
            </div>

            <div className="details-grid">
              <div className="input-field">
                <label>Manufacturer</label>
                <input 
                  type="text" 
                  placeholder="e.g. BMW" 
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  required
                />
              </div>
              <div className="input-field">
                <label>Model</label>
                <input 
                  type="text" 
                  placeholder="e.g. M5" 
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="photo-section">
              <label>Vehicle Photos</label>
              <div className="upload-grid">
                {photos.map((url, i) => (
                  <div key={i} className="upload-preview">
                    <img src={url} alt="preview" />
                    <button type="button" onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}><X size={12} /></button>
                  </div>
                ))}
                {photos.length < 3 && (
                  <button type="button" className="upload-btn" onClick={() => setPhotos([...photos, 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400'])}>
                    <Camera size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="tos-pill glass">
              <Shield size={16} />
              <span>I verify that I own this vehicle and will follow community guidelines.</span>
            </div>

            <button type="submit" className="btn-primary-large" disabled={isLoading} style={{ width: '100%', marginTop: '2rem' }}>
              {isLoading ? <div className="spinner"></div> : (
                <>
                  <span>Complete Registration</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      <style jsx>{`
        .register-page-midnight { padding: 4rem 0; }
        .container { max-width: 650px; margin: 0 auto; }
        .page-header { margin-bottom: 3rem; }
        .btn-back { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; border-radius: 12px; font-weight: 700; color: var(--muted); }
        
        .registration-card { padding: 4rem; border-radius: 32px; border: 1px solid var(--border); }
        .form-header { text-align: center; margin-bottom: 3.5rem; }
        .icon-badge { width: 60px; height: 60px; background: var(--surface); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--primary); margin: 0 auto 1.5rem; box-shadow: 0 0 30px var(--primary-glow); }
        
        h1 { font-size: 2.25rem; margin-bottom: 0.5rem; }
        p { color: var(--muted); }

        .registration-form { display: flex; flex-direction: column; gap: 2rem; }
        
        label { display: block; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: var(--muted); margin-bottom: 0.75rem; letter-spacing: 0.05em; }
        
        .smart-input-box { position: relative; }
        .smart-plate-input { width: 100%; background: #000; border: 2px solid var(--border); border-radius: 16px; padding: 1.25rem 1.5rem; font-size: 1.75rem; font-family: 'Courier New', monospace; font-weight: 900; color: white; text-transform: uppercase; letter-spacing: 2px; }
        .smart-plate-input:focus { outline: none; border-color: var(--primary); }
        
        .smart-badge { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 0.5rem; background: var(--surface); padding: 0.4rem 0.8rem; border-radius: 8px; border: 1px solid var(--border); }
        .smart-label { font-size: 0.7rem; font-weight: 800; color: white; text-transform: uppercase; }

        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .input-field input { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1rem; color: white; font-weight: 600; }
        .input-field input:focus { outline: none; border-color: var(--primary); }

        .upload-grid { display: flex; gap: 1rem; }
        .upload-preview { position: relative; width: 80px; height: 80px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
        .upload-preview img { width: 100%; height: 100%; object-fit: cover; }
        .upload-preview button { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.5); color: white; border-radius: 4px; padding: 2px; }

        .upload-btn { width: 80px; height: 80px; border-radius: 12px; border: 2px dashed var(--border); color: var(--muted); display: flex; align-items: center; justify-content: center; }
        .upload-btn:hover { border-color: var(--primary); color: var(--primary); }

        .tos-pill { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border-radius: 16px; color: var(--muted); font-size: 0.85rem; line-height: 1.4; border: 1px solid rgba(255,255,255,0.03); }

        @media (max-width: 600px) {
          .registration-card { padding: 2.5rem 1.5rem; border-radius: 24px; }
          .details-grid { grid-template-columns: 1fr; }
          .smart-plate-input { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
    </div>
  );
}
