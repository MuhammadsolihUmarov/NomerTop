'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Car, ChevronRight, Camera, X, Shield, Globe } from 'lucide-react';
import { registerPlate } from '@/lib/actions';
import { toast } from 'sonner';

import { useTranslation } from '@/components/LanguageProvider';

const detectCountry = (plate: string) => {
  const clean = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (!clean) return { code: 'OTH', flag: '🌐', name: 'Global Network' };

  if (/^\d{2}[A-Z]/.test(clean) || /^\d{2}\d{3}[A-Z]{3}/.test(clean)) return { code: 'UZ', flag: '🇺🇿', name: 'O‘zbekiston' };
  if (/^[ABEKMHOPCTX]\d{3}[ABEKMHOPCTX]{2}/.test(clean)) return { code: 'RU', flag: '🇷🇺', name: 'Rossiya' };
  if (/^\d{3}[A-Z]{2,3}\d{2}/.test(clean)) return { code: 'KZ', flag: '🇰🇿', name: 'Qozog‘iston' };

  return { code: 'OTH', flag: '🌐', name: 'Xalqaro tarmoq' };
};

export default function RegisterPlate() {
  const { t } = useTranslation();
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
      toast.success(t.registration.success);
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotos([...photos, url]);
      toast.success(t.registration.photoSuccess);
    }
  };

  return (
    <div className="register-page-midnight">
      <div className="container">
        <header className="page-header">
          <button onClick={() => router.back()} className="btn-back glass">
            <ArrowLeft size={16} />
            <span>{t.nav.dashboard}</span>
          </button>
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="registration-card glass"
        >
          <div className="form-header">
            <div className="icon-badge"><Car size={24} /></div>
            <h1>{t.registration.title}</h1>
            <p>{t.registration.subtitle}</p>
          </div>

          <form onSubmit={handleAction} className="registration-form">
            <div className="input-group">
              <label className="label-premium">{t.registration.plateNumber} <span className="text-secondary">*</span></label>
              <div className="smart-input-box focus-ring">
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
              <p className="helper-text italic mt-2 opacity-60">Sistemamiz raqam formatini avtomatik aniqlaydi.</p>
            </div>

            <div className="details-grid">
              <div className="input-field">
                <label className="label-premium">{t.registration.brand} <span className="text-secondary">*</span></label>
                <div className="focus-ring input-relative">
                  <input 
                    type="text" 
                    placeholder="Masalan: Chevrolet" 
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="input-field">
                <label className="label-premium">{t.registration.model} <span className="text-secondary">*</span></label>
                <div className="focus-ring input-relative">
                  <input 
                    type="text" 
                    placeholder="Masalan: Gentra" 
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="photo-section">
              <label className="label-premium">{t.registration.photos} <span className="text-accent"></span></label>
              <p className="helper-text mb-4">{t.plateDetail.visualVer}. Foto egasini tasdiqlash uchun kerak.</p>
              
              <div className="upload-grid-premium">
                {photos.map((url, i) => (
                  <div key={i} className="upload-preview-focal">
                    <img src={url} alt="preview" />
                    <button type="button" className="remove-btn" onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {photos.length < 3 && (
                  <label className="upload-zone-premium glass-card cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoUpload}
                    />
                    <div className="upload-content">
                      <Camera size={24} className="text-primary mb-2" />
                      <span>Rasm yuklash</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div className="verification-notice glass">
              <Shield size={20} className="text-secondary" />
              <div>
                <p className="font-bold text-white mb-1">Xavfsiz tasdiqlash</p>
                <p className="helper-text text-xs leading-relaxed">
                  Raqamingizni muloqotga tayyorlashdan oldin, mutaxassislarimiz ma’lumotlarni haqqoniyligini ko‘zdan kechirishi mumkin.
                </p>
              </div>
            </div>

            <button type="submit" className="btn-primary-focal" disabled={isLoading} style={{ width: '100%', marginTop: '3rem' }}>
              {isLoading ? <div className="spinner"></div> : (
                <>
                  <span>{t.registration.submit}</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      <style jsx>{`
        .register-page-midnight { padding: 4rem 0 8rem; position: relative; }
        .container { max-width: 700px; margin: 0 auto; padding: 0 1.5rem; }
        .page-header { margin-bottom: 4rem; }
        .btn-back { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; border-radius: 1rem; font-weight: 800; color: var(--muted-foreground); transition: 0.3s; }
        .btn-back:hover { background: rgba(255,255,255,0.05); color: white; }
        
        .registration-card { padding: 5rem 4rem; border-radius: 4rem; border: 1px solid rgba(255,255,255,0.1); }
        .form-header { text-align: center; margin-bottom: 4.5rem; }
        .icon-badge { width: 80px; height: 80px; background: rgba(99, 102, 241, 0.1); border-radius: 2rem; display: flex; align-items: center; justify-content: center; color: var(--primary); margin: 0 auto 2rem; box-shadow: 0 0 40px var(--primary-glow); }
        
        h1 { font-size: 3rem; font-weight: 950; margin-bottom: 0.75rem; letter-spacing: -0.02em; }
        p { color: var(--muted-foreground); font-size: 1.1rem; }

        .registration-form { display: flex; flex-direction: column; gap: 3rem; }
        
        .smart-input-box { position: relative; background: #000; border: 2px solid var(--border); border-radius: 2rem; overflow: hidden; transition: 0.3s; }
        .smart-plate-input { width: 100%; border: none; background: transparent; padding: 2.5rem; font-size: 3rem; font-family: 'Outfit', 'Courier New', monospace; font-weight: 950; color: white; text-transform: uppercase; letter-spacing: 6px; text-align: center; }
        .smart-plate-input:focus { outline: none; }
        
        .smart-badge { position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 0.75rem; background: var(--surface); padding: 0.5rem 1rem; border-radius: 12px; border: 1px solid var(--border); backdrop-filter: blur(10px); }
        .smart-label { font-size: 0.75rem; font-weight: 950; color: white; text-transform: uppercase; letter-spacing: 0.05em; }

        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .input-relative { border: 1px solid var(--border); border-radius: 1.25rem; background: rgba(0,0,0,0.3); overflow: hidden; transition: 0.3s; }
        .input-relative input { width: 100%; border: none; background: transparent; padding: 1.5rem; color: white; font-weight: 700; font-size: 1.1rem; }
        .input-relative input:focus { outline: none; }

        .upload-grid-premium { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1.5rem; }
        .upload-preview-focal { position: relative; aspect-ratio: 1; border-radius: 1.5rem; overflow: hidden; border: 1px solid var(--border); }
        .upload-preview-focal img { width: 100%; height: 100%; object-fit: cover; }
        .remove-btn { position: absolute; top: 0.75rem; right: 0.75rem; width: 32px; height: 32px; background: rgba(0,0,0,0.6); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }

        .upload-zone-premium { aspect-ratio: 1; border-radius: 1.5rem; display: flex; align-items: center; justify-content: center; text-align: center; }
        .upload-content { display: flex; flex-direction: column; align-items: center; font-size: 0.8rem; font-weight: 800; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.05em; }

        .verification-notice { display: flex; gap: 1.5rem; padding: 2rem; border-radius: 2rem; border: 1px solid rgba(16, 185, 129, 0.1); background: rgba(16, 185, 129, 0.02); }

        .btn-primary-focal { 
          background: var(--gradient-main); color: white; padding: 1.5rem; 
          border-radius: 1.5rem; font-weight: 900; font-size: 1.1rem;
          letter-spacing: 0.05em; box-shadow: 0 15px 35px var(--primary-glow); 
          transition: 0.4s; display: flex; align-items: center; justify-content: center; gap: 1rem;
        }

        .spinner { width: 28px; height: 28px; border: 3px solid rgba(255,255,255,0.2); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .registration-card { padding: 3rem 1.5rem; border-radius: 2.5rem; }
          .details-grid { grid-template-columns: 1fr; }
          .smart-plate-input { font-size: 1.75rem; padding: 1.5rem; }
          .smart-badge { display: none; }
        }
      `}</style>
    </div>
  );
}
