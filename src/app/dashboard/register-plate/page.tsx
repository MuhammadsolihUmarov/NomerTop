'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Car, Info, ChevronRight, AlertCircle, Plus, Shield, Camera, X, Globe } from 'lucide-react';
import { registerPlate } from '@/lib/actions';
import { toast } from 'sonner';

const COUNTRIES = [
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', placeholder: '01 A 777 AA' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', placeholder: 'A 123 AA 77' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', placeholder: '123 ABC 01' },
];

export default function RegisterPlate() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    number: '',
    country: 'UZ',
    brand: '',
    model: '',
    color: ''
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const data = new FormData();
    data.append('number', formData.number);
    data.append('country', formData.country);
    data.append('brand', formData.brand);
    data.append('model', formData.model);
    data.append('color', formData.color);
    // In a real app, we'd append actual files. For now, we'll simulate.
    photos.forEach(p => data.append('photos', p));

    const result = await registerPlate(data);
    
    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
      setIsLoading(false);
    } else {
      toast.success('Vehicle identity secured!');
      router.push('/dashboard');
      router.refresh();
    }
  };

  const addPhoto = () => {
    // Mock photo addition
    const mockPhoto = `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400`;
    setPhotos([...photos, mockPhoto]);
    toast.info('Vehicle photo added to verification queue');
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const selectedCountry = COUNTRIES.find(c => c.code === formData.country) || COUNTRIES[0];

  return (
    <div className="register-plate-focal">
      <div className="container">
        <header className="view-header">
          <button onClick={() => router.back()} className="btn-back glass">
            <ArrowLeft size={18} />
            <span>Fleet Control</span>
          </button>
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="registration-card-premium glass"
        >
          <div className="card-header">
            <div className="icon-wrap-premium"><Car size={32} /></div>
            <h1>Initialize Identity</h1>
            <p>Bind globally unique vehicle handles to your encrypted account.</p>
          </div>

          <form onSubmit={handleAction} className="focal-registration-form">
            <div className="form-section">
              <div className="section-head">
                <Globe size={16} />
                <span>Regional Protocol</span>
              </div>
              <div className="country-grid">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={`country-pill ${formData.country === c.code ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, country: c.code})}
                  >
                    <span>{c.flag}</span>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid">
              <div className="focal-group full">
                <label>License Handle</label>
                <div className="plate-input-wrapper">
                  <div className="country-prefix">{selectedCountry.flag}</div>
                  <input 
                    name="number"
                    type="text" 
                    placeholder={selectedCountry.placeholder} 
                    className="focal-plate-input"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                  />
                </div>
                <p className="field-hint">Your plate number acts as your unique vehicle username.</p>
              </div>

              <div className="focal-group">
                <label>Manufacturer</label>
                <input 
                  name="brand"
                  type="text" 
                  placeholder="e.g. Tesla" 
                  className="focal-input"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                />
              </div>

              <div className="focal-group">
                <label>Model Version</label>
                <input 
                  name="model"
                  type="text" 
                  placeholder="e.g. Model S Plaid" 
                  className="focal-input"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                />
              </div>
            </div>

            <div className="photo-section">
              <div className="section-head">
                <Camera size={16} />
                <span>Visual Verification</span>
              </div>
              <div className="photo-upload-grid">
                {photos.map((url, i) => (
                  <div key={i} className="photo-preview glass">
                    <img src={url} alt="Vehicle Preview" />
                    <button type="button" onClick={() => removePhoto(i)} className="btn-remove">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {photos.length < 4 && (
                  <button type="button" className="btn-add-photo glass" onClick={addPhoto}>
                    <Plus size={24} />
                    <span>Add Photo</span>
                  </button>
                )}
              </div>
              <p className="photo-hint">Add up to 4 photos of your vehicle for verification and public profile identity.</p>
            </div>

            <div className="security-agreement glass">
              <Shield size={18} />
              <p>I confirm that I am the authorized owner of this vehicle. Misuse of the NomerTop identity system may lead to permanent ban.</p>
            </div>

            <button type="submit" className="btn-primary-focal" disabled={isLoading}>
              {isLoading ? (
                <div className="spinner-wrap">
                  <div className="spinner"></div>
                  <span>Securing Identity...</span>
                </div>
              ) : (
                <>
                  <span>COMPLETE ENLISTMENT</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      <style jsx>{`
        .register-plate-focal { padding: 4rem 0 8rem; min-height: 100vh; }
        .container { max-width: 750px; margin: 0 auto; padding: 0 1.5rem; }
        
        .view-header { margin-bottom: 4rem; }
        .btn-back { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; border-radius: 99rem; color: var(--muted-foreground); font-weight: 700; border: 1px solid rgba(255,255,255,0.05); }
        .btn-back:hover { color: white; background: rgba(255,255,255,0.1); }

        .registration-card-premium { padding: 5rem 4rem; border-radius: 4rem; border: 1px solid rgba(255,255,255,0.05); }
        
        .card-header { text-align: center; margin-bottom: 5rem; }
        .icon-wrap-premium { width: 80px; height: 80px; background: rgba(16, 185, 129, 0.1); border-radius: 2rem; display: flex; align-items: center; justify-content: center; color: var(--primary); margin: 0 auto 2rem; box-shadow: 0 0 40px var(--primary-glow); }
        
        h1 { font-size: 3rem; font-weight: 800; margin-bottom: 0.75rem; }
        p { color: var(--muted-foreground); font-size: 1.1rem; }

        .focal-registration-form { display: flex; flex-direction: column; gap: 4rem; }
        
        .section-head { display: flex; align-items: center; gap: 1rem; color: var(--primary); font-weight: 800; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem; }

        .country-grid { display: flex; gap: 1rem; flex-wrap: wrap; }
        .country-pill { padding: 0.75rem 1.5rem; border-radius: 1rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border); color: var(--muted-foreground); font-weight: 700; display: flex; align-items: center; gap: 0.75rem; transition: 0.3s; }
        .country-pill:hover { background: rgba(255,255,255,0.06); color: white; }
        .country-pill.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 5px 15px var(--primary-glow); }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
        .focal-group { display: flex; flex-direction: column; gap: 1rem; }
        .focal-group.full { grid-column: 1 / -1; }
        
        label { font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground); }
        
        .plate-input-wrapper { position: relative; display: flex; align-items: center; }
        .country-prefix { position: absolute; left: 1.5rem; font-size: 2rem; z-index: 2; pointer-events: none; }
        
        .focal-plate-input { width: 100%; background: rgba(0,0,0,0.3); border: 2px solid var(--border); border-radius: 1.5rem; padding: 1.5rem 1.5rem 1.5rem 4.5rem; color: white; font-size: 2.5rem; font-family: 'Courier New', monospace; font-weight: 900; text-align: left; letter-spacing: 4px; text-transform: uppercase; transition: 0.3s; }
        .focal-plate-input:focus { outline: none; border-color: var(--primary); background: rgba(0,0,0,0.5); }

        .focal-input { background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 1.25rem; padding: 1.25rem 1.5rem; color: white; font-size: 1.1rem; transition: 0.3s; }
        .focal-input:focus { outline: none; border-color: var(--primary); background: rgba(0,0,0,0.5); }
        
        .field-hint { font-size: 0.85rem; color: var(--muted-foreground); margin-top: 0.5rem; }

        .photo-upload-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1.25rem; }
        .photo-preview { position: relative; aspect-ratio: 1; border-radius: 1.25rem; overflow: hidden; border: 1px solid var(--border); }
        .photo-preview img { width: 100%; height: 100%; object-fit: cover; }
        .btn-remove { position: absolute; top: 0.5rem; right: 0.5rem; width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.6); color: white; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }

        .btn-add-photo { aspect-ratio: 1; border-radius: 1.25rem; border: 2px dashed var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; color: var(--muted-foreground); transition: 0.3s; }
        .btn-add-photo:hover { border-color: var(--primary); color: var(--primary); background: rgba(16, 185, 129, 0.05); }
        .btn-add-photo span { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }

        .photo-hint { font-size: 0.85rem; color: var(--muted-foreground); margin-top: 1.5rem; line-height: 1.6; }

        .security-agreement { display: flex; gap: 1.5rem; padding: 2rem; border-radius: 2rem; background: rgba(255,255,255,0.02); align-items: center; border: 1px solid rgba(255,255,255,0.05); }
        .security-agreement p { font-size: 1rem; line-height: 1.6; color: var(--muted-foreground); }
        .security-agreement :global(svg) { color: var(--primary); flex-shrink: 0; }

        .btn-primary-focal { background: var(--primary); color: white; padding: 1.5rem; border-radius: 1.5rem; font-weight: 800; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; gap: 1rem; box-shadow: 0 15px 30px var(--primary-glow); transition: all 0.3s; width: 100%; }
        .btn-primary-focal:hover:not(:disabled) { transform: translateY(-3px); filter: brightness(1.1); }
        .btn-primary-focal:disabled { opacity: 0.7; cursor: wait; }

        .spinner-wrap { display: flex; align-items: center; gap: 1rem; }
        .spinner { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .registration-card-premium { padding: 3rem 1.5rem; border-radius: 2.5rem; }
          .form-grid { grid-template-columns: 1fr; gap: 2rem; }
          .focal-plate-input { font-size: 1.75rem; padding-left: 3.5rem; }
          .country-prefix { font-size: 1.5rem; left: 1rem; }
          h1 { font-size: 2.25rem; }
        }
      `}</style>
    </div>
  );
}
