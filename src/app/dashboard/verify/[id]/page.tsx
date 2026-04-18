'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatPlateDisplay } from '@/lib/utils';

export default function VerifyPlate() {
  const { id } = useParams();
  const router = useRouter();
  const plateNumber = id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate upload and verification request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="verify-success">
        <div className="container">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="success-card glass"
          >
            <CheckCircle2 size={80} color="#10b981" />
            <h1>Verification Submitted!</h1>
            <p>Our team will review your documents within 24 hours. You'll receive a notification once your plate <strong>{formatPlateDisplay(plateNumber)}</strong> is verified.</p>
            <button onClick={() => router.push('/dashboard')} className="btn-primary">Return to Dashboard</button>
          </motion.div>
        </div>
        <style jsx>{`
          .verify-success { display: flex; align-items: center; justify-content: center; min-height: 80vh; }
          .success-card { text-align: center; padding: 4rem; border-radius: 2rem; max-width: 500px; }
          h1 { margin: 2rem 0 1rem; }
          p { color: var(--muted-foreground); margin-bottom: 2rem; line-height: 1.6; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="verify-page">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="verify-card"
        >
          <div className="verify-header">
            <ShieldCheck size={48} color="var(--primary)" />
            <h1>Verify Ownership</h1>
            <p>To finalize registration for <strong>{formatPlateDisplay(plateNumber)}</strong>, please provide proof of ownership.</p>
          </div>

          <div className="alert-box">
            <AlertCircle size={20} />
            <p>Your identity remains private. These documents are only used by admins to prevent fraudulent plate registrations.</p>
          </div>

          <form onSubmit={handleUpload} className="upload-form">
            <div className="upload-group">
              <label>Vehicle Registration Document (Tex-Passport)</label>
              <div className="dropzone">
                <FileText size={40} />
                <p>Click to upload or drag & drop</p>
                <span>JPG, PNG or PDF (max 10MB)</span>
                <input type="file" className="file-input" />
              </div>
            </div>

            <div className="upload-group">
              <label>Photo of your car with the plate visible</label>
              <div className="dropzone">
                <Upload size={40} />
                <p>Click to upload or drag & drop</p>
                <span>JPG, PNG (max 10MB)</span>
                <input type="file" className="file-input" />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary full-width"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Uploading Documents...' : 'Submit for Verification'}
            </button>
          </form>
        </motion.div>
      </div>

      <style jsx>{`
        .verify-page { padding: 4rem 0; background: #f8fafc; min-height: 100vh; }
        .container { max-width: 700px; margin: 0 auto; padding: 0 1.5rem; }
        .verify-card { background: white; padding: 3rem; border-radius: 2rem; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        
        .verify-header { text-align: center; margin-bottom: 2.5rem; }
        .verify-header h1 { font-size: 2rem; font-weight: 800; margin: 1rem 0 0.5rem; }
        
        .alert-box { 
          display: flex; gap: 1rem; background: #eff6ff; border: 1px solid #bfdbfe; 
          padding: 1.25rem; border-radius: 1rem; color: #1e40af; font-size: 0.9rem; margin-bottom: 2.5rem;
        }

        .upload-form { display: flex; flex-direction: column; gap: 2rem; }
        label { display: block; font-weight: 700; font-size: 0.95rem; margin-bottom: 0.75rem; }
        
        .dropzone {
          border: 2px dashed var(--border);
          border-radius: var(--radius);
          padding: 3rem 2rem;
          text-align: center;
          background: #fdfdfd;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .dropzone:hover { border-color: var(--primary); background: #f0f7ff; }
        .dropzone p { font-weight: 600; margin: 1rem 0 0.25rem; }
        .dropzone span { font-size: 0.8rem; color: var(--muted-foreground); }
        .file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        .full-width { width: 100%; padding: 1.25rem; font-size: 1.1rem; }
      `}</style>
    </div>
  );
}
