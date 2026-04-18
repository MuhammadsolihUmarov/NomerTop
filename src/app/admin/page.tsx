'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Check, X, ExternalLink, BarChart3, Users, FileCheck, Search } from 'lucide-react';
import { formatPlateDisplay } from '@/lib/utils';

const MOCK_REQUESTS = [
  { id: 'v1', user: 'Usmon', plate: '01Z999ZZ', date: '2024-04-17', brand: 'Tesla Model 3' },
  { id: 'v2', user: 'Anvar', plate: '10A123BC', date: '2024-04-16', brand: 'Chevrolet Gentra' },
];

export default function AdminPanel() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setRequests(requests.filter(r => r.id !== id));
    // In real app, this would call a server action
  };

  return (
    <div className="admin-focal-container">
      <div className="container">
        <header className="admin-header-premium">
          <div className="admin-title">
            <div className="admin-badge"><ShieldAlert size={16} /> SYSTEM COMMAND</div>
            <h1>Control Panel</h1>
            <p>Master overview of the NomerTop decentralized network.</p>
          </div>
          
          <div className="admin-stats-grid">
            <motion.div whileHover={{ y: -5 }} className="admin-stat-card glass">
              <div className="stat-icon indigo"><Users size={20} /></div>
              <div className="stat-data">
                <span>Active Operatives</span>
                <strong>1,284</strong>
              </div>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="admin-stat-card glass">
              <div className="stat-icon emerald"><FileCheck size={20} /></div>
              <div className="stat-data">
                <span>Verified Assets</span>
                <strong>842</strong>
              </div>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="admin-stat-card glass">
              <div className="stat-icon amber"><BarChart3 size={20} /></div>
              <div className="stat-data">
                <span>Signal Volume</span>
                <strong>4,521</strong>
              </div>
            </motion.div>
          </div>
        </header>

        <main className="admin-focal-main">
          <section className="queue-section">
            <div className="queue-header">
              <h2>Pending Approvals</h2>
              <div className="queue-count">{requests.length}</div>
            </div>

            <div className="focal-table-wrapper glass">
              <table>
                <thead>
                  <tr>
                    <th>Asset ID</th>
                    <th>Requester</th>
                    <th>Vehicle Details</th>
                    <th>Discovery Date</th>
                    <th>Documentation</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td className="number-cell">{formatPlateDisplay(req.plate)}</td>
                      <td>{req.user}</td>
                      <td><span className="car-tag">{req.brand}</span></td>
                      <td className="time-cell">{req.date}</td>
                      <td>
                        <button className="btn-table-link">
                          <ExternalLink size={14} />
                          <span>Review Assets</span>
                        </button>
                      </td>
                      <td>
                        <div className="action-stack">
                          <button className="btn-table-approve" onClick={() => handleAction(req.id, 'approve')}>
                            <Check size={16} />
                          </button>
                          <button className="btn-table-reject" onClick={() => handleAction(req.id, 'reject')}>
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty-cell">
                        <div className="empty-wrap">
                          <Check size={48} />
                          <p>All assets are currently in compliance.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <style jsx>{`
        .admin-focal-container { padding: 4rem 0 10rem; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        
        .admin-header-premium { margin-bottom: 5rem; }
        .admin-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 4px 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 99rem; color: #ef4444; font-size: 0.75rem; font-weight: 800; margin-bottom: 1.5rem; letter-spacing: 0.1em; }
        
        h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 0.5rem; }
        .admin-title p { color: var(--muted-foreground); font-size: 1.25rem; margin-bottom: 4rem; }

        .admin-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .admin-stat-card { padding: 2rem; border-radius: 2rem; display: flex; align-items: center; gap: 1.5rem; border: 1px solid rgba(255,255,255,0.05); }
        .stat-icon { width: 50px; height: 50px; border-radius: 1rem; display: flex; align-items: center; justify-content: center; }
        .stat-icon.indigo { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
        .stat-icon.emerald { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .stat-icon.amber { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        
        .stat-data span { display: block; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: var(--muted-foreground); margin-bottom: 4px; }
        .stat-data strong { font-size: 1.75rem; color: white; display: block; }

        .queue-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .queue-header h2 { font-size: 2rem; font-weight: 800; }
        .queue-count { background: var(--primary); color: white; padding: 2px 12px; border-radius: 99rem; font-weight: 800; font-size: 0.85rem; box-shadow: 0 0 20px var(--primary-glow); }

        .focal-table-wrapper { border-radius: 2.5rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { padding: 1.5rem; font-size: 0.8rem; font-weight: 800; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.1em; background: rgba(255,255,255,0.02); }
        td { padding: 1.5rem; border-top: 1px solid rgba(255,255,255,0.03); color: var(--muted-foreground); font-size: 1rem; }
        
        .number-cell { font-family: 'Courier New', monospace; font-weight: 900; color: white; font-size: 1.25rem; letter-spacing: 2px; }
        .car-tag { background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 6px; color: white; font-size: 0.85rem; font-weight: 600; }
        .time-cell { font-size: 0.85rem; }

        .btn-table-link { display: flex; align-items: center; gap: 0.5rem; color: var(--secondary); font-weight: 800; font-size: 0.85rem; }
        .btn-table-link:hover { color: white; }

        .action-stack { display: flex; gap: 1rem; justify-content: flex-end; }
        .action-stack button { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .btn-table-approve { background: rgba(16, 185, 129, 0.1); color: var(--primary); border: 1px solid rgba(16, 185, 129, 0.2); }
        .btn-table-approve:hover { background: var(--primary); color: white; box-shadow: 0 0 20px var(--primary-glow); }
        .btn-table-reject { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
        .btn-table-reject:hover { background: #ef4444; color: white; box-shadow: 0 0 20px rgba(239,68,68,0.4); }

        .empty-cell { padding: 6rem !important; }
        .empty-wrap { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; color: var(--primary); filter: opacity(0.5); }
        .empty-wrap p { color: var(--muted-foreground); font-weight: 600; font-size: 1.1rem; }

        @media (max-width: 1024px) {
          .admin-stats-grid { grid-template-columns: 1fr; }
          .focal-table-wrapper { overflow-x: auto; }
          .action-stack { justify-content: flex-start; }
        }
      `}</style>
    </div>
  );
}
