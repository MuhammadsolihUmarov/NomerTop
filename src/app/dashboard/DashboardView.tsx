'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Bell, Plus, MessageCircle, Settings, ShieldCheck, Clock, Layers, LogOut } from 'lucide-react';
import { formatPlateDisplay } from '@/lib/utils';
import { toast } from 'sonner';

interface DashboardViewProps {
  user: any;
  plates: any[];
  notifications: any[];
}

export default function DashboardView({ user, plates, notifications }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState('plates');

  const navItems = [
    { id: 'plates', label: 'My Fleet', icon: Car },
    { id: 'notifications', label: 'Signals', icon: Bell, count: notifications.filter(n => !n.isRead).length },
    { id: 'settings', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <div className="dashboard-focal">
      <div className="container">
        {/* Desktop Sidebar / Mobile Top Profile */}
        <aside className="sidebar glass">
          <div className="user-profile">
            <div className="avatar-glow">
              <div className="avatar">{user.name?.charAt(0) || 'U'}</div>
              <div className="pulse"></div>
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p className="role-badge">{user.role || 'ELITE OWNER'}</p>
            </div>
          </div>

          <nav className="side-nav desktop-only">
            {navItems.map((item) => (
              <button 
                key={item.id}
                className={activeTab === item.id ? 'active' : ''} 
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.count ? <div className="badge-count">{item.count}</div> : null}
              </button>
            ))}
          </nav>

          <a href="/dashboard/register-plate" className="btn-add-fleet desktop-only">
            <Plus size={20} />
            <span>Enlist Vehicle</span>
          </a>
          
          <div className="sidebar-footer desktop-only">
            <button className="btn-logout" onClick={() => toast.info('Logging out...')}>
              <LogOut size={16} />
              <span>Disconnect</span>
            </button>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="dashboard-content">
          <AnimatePresence mode="wait">
            {activeTab === 'plates' && (
              <motion.section 
                key="plates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="plates-view"
              >
                <header className="view-header">
                  <div className="header-meta">
                    <h2>Fleet Command</h2>
                    <p>Manage your registered vehicle identities.</p>
                  </div>
                  <a href="/dashboard/register-plate" className="mobile-only-btn btn-primary-sm">
                    <Plus size={16} />
                  </a>
                </header>

                <div className="plates-grid">
                  {plates.map((plate) => (
                    <motion.div 
                      layoutId={plate.id}
                      key={plate.id} 
                      className="asset-card glass hover-glow"
                    >
                      <div className="asset-header">
                        <div className="mini-plate">
                          {formatPlateDisplay(plate.number, plate.country)}
                        </div>
                        <div className={`status-tag ${plate.verifiedStatus.toLowerCase()}`}>
                          {plate.verifiedStatus === 'APPROVED' ? <ShieldCheck size={12} /> : <Clock size={12} />}
                          <span>{plate.verifiedStatus}</span>
                        </div>
                      </div>
                      <div className="asset-details">
                        <h4>{plate.brand || 'Unknown'} <span>{plate.model || 'Vehicle'}</span></h4>
                        <div className="asset-metrics">
                          <div className="metric">
                            <MessageCircle size={14} />
                            <span>{plate.messages?.length || 0}</span>
                          </div>
                          <div className="metric">
                            <Layers size={14} />
                            <span>UZ-NET</span>
                          </div>
                        </div>
                      </div>
                      <div className="asset-actions">
                        <button className="btn-view" onClick={() => toast.success('Viewing History')}>Logs</button>
                        <button className="btn-manage">Configure</button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {plates.length === 0 && (
                    <div className="empty-fleet glass">
                      <div className="empty-icon-wrap">
                        <Car size={48} className="empty-icon-pulse" />
                      </div>
                      <h3>No Assets Enlisted</h3>
                      <p>Your vehicle identity is currently offline. Register your plate to start receiving smart notifications.</p>
                      <a href="/dashboard/register-plate" className="btn-primary">Register First Plate</a>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {activeTab === 'notifications' && (
              <motion.section 
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="notifications-view"
              >
                <header className="view-header">
                  <div className="header-meta">
                    <h2>Signal Logs</h2>
                    <p>Encrypted messages directed to your fleet.</p>
                  </div>
                </header>

                <div className="log-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`log-item glass ${!notif.isRead ? 'unread' : ''}`}>
                      <div className="log-icon-box">
                        <MessageCircle size={20} />
                      </div>
                      <div className="log-body">
                        <div className="log-meta">
                          <span className="log-title">{notif.title}</span>
                          <span className="log-time">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="log-text">{notif.body}</p>
                        <div className="log-actions">
                          <button className="btn-reply">Quick Response</button>
                          <button className="btn-dismiss">Archive</button>
                        </div>
                      </div>
                      {!notif.isRead && <div className="unread-pulse"></div>}
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="empty-logs glass">
                      <Bell size={48} className="muted-icon" />
                      <p>No incoming signals detected across your fleet.</p>
                    </div>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav glass">
        {navItems.map((item) => (
          <button 
            key={item.id}
            className={activeTab === item.id ? 'active' : ''} 
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={22} />
            <span>{item.label}</span>
            {item.count ? <div className="mobile-badge">{item.count}</div> : null}
          </button>
        ))}
        <a href="/dashboard/register-plate" className="mobile-add-btn">
          <Plus size={24} />
        </a>
      </nav>

      <style jsx>{`
        .dashboard-focal { padding: 4rem 0 8rem; min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 320px 1fr; gap: 4rem; padding: 0 1.5rem; }
        
        .sidebar { padding: 2.5rem; border-radius: 3rem; height: fit-content; position: sticky; top: 8rem; border: 1px solid rgba(255,255,255,0.05); }
        
        .user-profile { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 4rem; }
        .avatar-glow { position: relative; }
        .avatar { width: 60px; height: 60px; background: var(--primary); color: white; border-radius: 1.25rem; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.75rem; position: relative; z-index: 2; }
        .pulse { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--primary); border-radius: 1.25rem; z-index: 1; animation: pulse-anim 2s infinite; opacity: 0.3; }
        @keyframes pulse-anim { 0% { transform: scale(1); opacity: 0.3; } 100% { transform: scale(1.6); opacity: 0; } }

        .user-info h3 { font-size: 1.5rem; font-weight: 800; }
        .role-badge { display: inline-block; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--primary); background: rgba(16, 185, 129, 0.1); padding: 4px 10px; border-radius: 6px; margin-top: 6px; }

        .side-nav { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3rem; }
        .side-nav button { display: flex; align-items: center; gap: 1.25rem; padding: 1.25rem 1.5rem; border-radius: 1.5rem; color: var(--muted-foreground); font-weight: 700; position: relative; transition: 0.3s; }
        .side-nav button:hover { background: rgba(255,255,255,0.03); color: white; }
        .side-nav button.active { background: var(--primary); color: white; box-shadow: 0 12px 24px var(--primary-glow); }
        
        .badge-count { position: absolute; right: 1.5rem; background: #ef4444; color: white; font-size: 0.7rem; padding: 2px 8px; border-radius: 8px; font-weight: 800; }

        .btn-add-fleet { display: flex; align-items: center; justify-content: center; gap: 1rem; width: 100%; padding: 1.25rem; background: white; color: black; border-radius: 1.5rem; font-weight: 800; margin-bottom: 2rem; }
        .btn-add-fleet:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }

        .btn-logout { width: 100%; display: flex; align-items: center; gap: 0.75rem; color: var(--muted-foreground); font-size: 0.9rem; font-weight: 600; padding: 1rem; border-radius: 1rem; }
        .btn-logout:hover { color: #ef4444; background: rgba(239, 68, 68, 0.05); }

        .view-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4rem; }
        .header-meta h2 { font-size: 3rem; font-weight: 800; margin-bottom: 0.5rem; }
        .header-meta p { color: var(--muted-foreground); font-size: 1.1rem; }

        .plates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2.5rem; }
        .asset-card { padding: 2.5rem; border-radius: 2.5rem; border: 1px solid rgba(255,255,255,0.05); transition: 0.3s; }
        .asset-card.hover-glow:hover { transform: translateY(-8px); border-color: var(--primary); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5); }
        
        .mini-plate { font-family: 'Courier New', monospace; font-weight: 900; font-size: 1.75rem; letter-spacing: 3px; color: white; border-bottom: 3px solid var(--primary); padding-bottom: 0.5rem; width: fit-content; margin-bottom: 2rem; }
        
        .status-tag { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 800; padding: 6px 14px; border-radius: 99rem; border: 1px solid transparent; text-transform: uppercase; }
        .status-tag.approved { background: rgba(16, 185, 129, 0.1); color: var(--primary); border-color: rgba(16, 185, 129, 0.2); }
        .status-tag.pending { background: rgba(245, 158, 11, 0.1); color: var(--accent); border-color: rgba(245, 158, 11, 0.2); }

        .asset-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .asset-details { margin-bottom: 2.5rem; }
        .asset-details h4 { font-size: 1.5rem; color: white; margin-bottom: 1rem; }
        .asset-details h4 span { color: var(--muted-foreground); font-weight: 400; }
        
        .asset-metrics { display: flex; gap: 2rem; }
        .metric { display: flex; align-items: center; gap: 0.5rem; color: var(--muted-foreground); font-size: 0.85rem; font-weight: 600; }

        .asset-actions { display: flex; gap: 1rem; }
        .btn-view, .btn-manage { flex: 1; padding: 1rem; border-radius: 1rem; font-size: 0.9rem; font-weight: 700; border: 1px solid var(--border); color: white; transition: 0.2s; }
        .btn-view:hover { background: rgba(255,255,255,0.05); }
        .btn-manage:hover { border-color: var(--primary); color: var(--primary); }

        .log-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .log-item { padding: 2.5rem; border-radius: 2rem; display: flex; gap: 2rem; align-items: flex-start; position: relative; transition: 0.3s; border: 1px solid rgba(255,255,255,0.03); }
        .log-item.unread { border-color: rgba(16, 185, 129, 0.2); background: rgba(16, 185, 129, 0.02); }
        .log-icon-box { width: 56px; height: 56px; background: rgba(16, 185, 129, 0.1); border-radius: 1.25rem; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .log-meta { display: flex; justify-content: space-between; margin-bottom: 1rem; width: 100%; align-items: center; }
        .log-title { font-size: 1.1rem; font-weight: 800; color: white; }
        .log-time { font-size: 0.8rem; color: var(--muted-foreground); font-weight: 600; }
        .log-text { font-size: 1.1rem; color: var(--muted-foreground); line-height: 1.7; margin-bottom: 2rem; }
        
        .log-actions { display: flex; gap: 1rem; }
        .btn-reply { padding: 0.6rem 1.25rem; background: var(--primary); color: white; border-radius: 0.75rem; font-size: 0.85rem; font-weight: 700; }
        .btn-dismiss { padding: 0.6rem 1.25rem; border: 1px solid var(--border); color: var(--muted-foreground); border-radius: 0.75rem; font-size: 0.85rem; font-weight: 700; }

        .unread-pulse { position: absolute; right: 2rem; top: 2rem; width: 10px; height: 10px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 15px var(--primary-glow); }

        .empty-fleet, .empty-logs { padding: 6rem 3rem; text-align: center; display: flex; flex-direction: column; align-items: center; border-radius: 3rem; border: 1px dashed var(--border); }
        .empty-icon-wrap { width: 100px; height: 100px; background: rgba(255,255,255,0.03); border-radius: 2.5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 2.5rem; }
        .empty-icon-pulse { color: var(--muted-foreground); opacity: 0.5; animation: float-anim 3s ease-in-out infinite; }
        @keyframes float-anim { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .empty-fleet h3 { font-size: 1.75rem; margin-bottom: 1rem; color: white; }
        .empty-fleet p { color: var(--muted-foreground); max-width: 400px; margin-bottom: 3rem; line-height: 1.6; }

        .mobile-nav { display: none; }
        .mobile-only-btn { display: none; }
        .desktop-only { display: block; }

        @media (max-width: 1024px) {
          .container { grid-template-columns: 1fr; gap: 2rem; }
          .sidebar { position: static; padding: 2rem; border-radius: 2rem; display: flex; align-items: center; justify-content: space-between; }
          .user-profile { margin-bottom: 0; }
          .desktop-only { display: none; }
          .mobile-only-btn { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 12px; background: var(--primary); color: white; }
          .dashboard-focal { padding: 2rem 0 10rem; }
          .header-meta h2 { font-size: 2.25rem; }
          
          .mobile-nav { 
            display: flex; 
            position: fixed; 
            bottom: 1.5rem; 
            left: 1rem; 
            right: 1rem; 
            background: rgba(15, 23, 42, 0.8); 
            backdrop-filter: blur(20px); 
            border: 1px solid rgba(255,255,255,0.08); 
            border-radius: 2rem; 
            padding: 0.75rem; 
            justify-content: space-around; 
            align-items: center; 
            z-index: 1000;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          }
          .mobile-nav button { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--muted-foreground); font-size: 0.65rem; font-weight: 700; transition: 0.3s; padding: 0.5rem; }
          .mobile-nav button.active { color: var(--primary); }
          .mobile-add-btn { width: 56px; height: 56px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px var(--primary-glow); transform: translateY(-1.5rem); border: 4px solid var(--background); }
          .mobile-badge { position: absolute; top: 0.25rem; right: 0.75rem; background: #ef4444; color: white; font-size: 0.6rem; padding: 1px 4px; border-radius: 4px; }
        }
      `}</style>
    </div>
  );
}
