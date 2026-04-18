'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Bell, Plus, MessageCircle, Settings, ShieldCheck, Clock, Layers, LogOut } from 'lucide-react';
import { formatPlateDisplay } from '@/lib/utils';
import { toast } from 'sonner';

import { useTranslation } from '@/components/LanguageProvider';

interface DashboardViewProps {
  user: any;
  plates: any[];
  notifications: any[];
}

export default function DashboardView({ user, plates, notifications }: DashboardViewProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('plates');

  const navItems = [
    { id: 'plates', label: t.dashboard.myFleet, icon: Car },
    { id: 'notifications', label: t.dashboard.signals, icon: Bell, count: notifications.filter(n => !n.isRead).length },
    { id: 'settings', label: t.dashboard.security, icon: ShieldCheck },
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
            <span>{t.dashboard.enlist}</span>
          </a>
          
          <div className="sidebar-footer desktop-only">
            <button className="btn-logout" onClick={() => toast.info('Logging out...')}>
              <LogOut size={16} />
              <span>{t.nav.logout}</span>
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
                    <h2>{t.dashboard.fleetCommand}</h2>
                    <p>{t.dashboard.manageIdentities}</p>
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
                        <button className="btn-view" onClick={() => toast.success('Viewing History')}>{t.dashboard.logs}</button>
                        <button className="btn-manage">{t.dashboard.configure}</button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {plates.length === 0 && (
                    <div className="empty-fleet glass">
                      <div className="empty-icon-wrap">
                        <Car size={48} className="empty-icon-pulse" />
                      </div>
                      <h3>{t.dashboard.emptyFleet}</h3>
                      <p>{t.dashboard.emptyFleetDesc}</p>
                      <a href="/dashboard/register-plate" className="btn-primary">{t.dashboard.registerFirst}</a>
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
                    <h2>{t.dashboard.signalLogs}</h2>
                    <p>{t.dashboard.signalLogsDesc}</p>
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
                          <button className="btn-reply">{t.dashboard.quickResponse}</button>
                          <button className="btn-dismiss">{t.dashboard.archive}</button>
                        </div>
                      </div>
                      {!notif.isRead && <div className="unread-pulse"></div>}
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="empty-logs glass">
                      <Bell size={48} className="muted-icon" />
                      <p>{t.dashboard.noSignals}</p>
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
        .dashboard-focal { padding: 6rem 0 10rem; min-height: 100vh; position: relative; }
        .container { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 350px 1fr; gap: 5rem; padding: 0 1.5rem; }
        
        .sidebar { 
          padding: 3rem; border-radius: 3rem; height: fit-content; position: sticky; top: 8rem; 
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.5);
        }
        
        .user-profile { display: flex; align-items: center; gap: 2rem; margin-bottom: 5rem; }
        .avatar-glow { position: relative; }
        .avatar { width: 70px; height: 70px; background: var(--gradient-main); color: white; border-radius: 1.5rem; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 2rem; position: relative; z-index: 2; box-shadow: 0 10px 30px var(--primary-glow); }
        .pulse { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--primary); border-radius: 1.5rem; z-index: 1; animation: pulse-anim 2s infinite; opacity: 0.3; }
        @keyframes pulse-anim { 0% { transform: scale(1); opacity: 0.3; } 100% { transform: scale(1.6); opacity: 0; } }

        .user-info h3 { font-size: 1.75rem; font-weight: 900; letter-spacing: -0.02em; }
        .role-badge { display: inline-block; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; color: var(--primary); background: rgba(99, 102, 241, 0.1); padding: 0.5rem 1rem; border-radius: 0.75rem; margin-top: 0.75rem; border: 1px solid rgba(99, 102, 241, 0.1); }

        .side-nav { display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 4rem; }
        .side-nav button { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem 1.75rem; border-radius: 1.75rem; color: var(--muted-foreground); font-weight: 800; position: relative; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); font-size: 0.95rem; }
        .side-nav button:hover { background: rgba(255,255,255,0.05); color: white; transform: translateX(8px); }
        .side-nav button.active { background: var(--gradient-main); color: white; box-shadow: 0 15px 40px var(--primary-glow); border: 1px solid rgba(255,255,255,0.1); }
        
        .badge-count { position: absolute; right: 1.75rem; background: var(--accent); color: white; font-size: 0.75rem; padding: 4px 10px; border-radius: 0.75rem; font-weight: 900; box-shadow: 0 5px 15px var(--accent-glow); }

        .btn-add-fleet { 
          display: flex; align-items: center; justify-content: center; gap: 1rem; 
          width: 100%; padding: 1.5rem; background: white; color: black !important; 
          border-radius: 1.75rem; font-weight: 900; margin-bottom: 2rem; 
          transition: 0.4s;
        }
        .btn-add-fleet:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(255,255,255,0.1); }

        .btn-logout { width: 100%; display: flex; align-items: center; gap: 1rem; color: var(--muted-foreground); font-weight: 800; font-size: 0.9rem; padding: 1rem; transition: 0.3s; }
        .btn-logout:hover { color: #f43f5e; }

        .view-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 4rem; }
        .header-meta h2 { font-size: 3.5rem; font-weight: 950; letter-spacing: -0.03em; margin-bottom: 0.75rem; background: linear-gradient(to bottom, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header-meta p { font-size: 1.25rem; color: var(--muted-foreground); font-weight: 500; }

        .plates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 3rem; }
        .asset-card { 
          padding: 3rem; border-radius: 3rem; 
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .asset-card:hover { transform: translateY(-12px); border-color: rgba(255,255,255,0.15); box-shadow: 0 40px 80px -20px rgba(0,0,0,0.5); }

        .asset-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem; }
        .mini-plate { background: #f8fafc; border: 3px solid #1e293b; border-radius: 0.75rem; padding: 0.5rem 1rem; color: #000; font-family: 'Outfit'; font-weight: 900; font-size: 1rem; letter-spacing: 1px; }
        .status-tag { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; color: var(--primary); padding: 0.5rem 1rem; background: rgba(99, 102, 241, 0.1); border-radius: 99rem; border: 1px solid rgba(99, 102, 241, 0.1); }

        .asset-details { margin-bottom: 3rem; }
        .asset-details h4 { font-size: 1.75rem; color: white; margin-bottom: 1.25rem; font-weight: 900; }
        .asset-details h4 span { color: var(--muted-foreground); font-weight: 500; }
        
        .asset-metrics { display: flex; gap: 2.5rem; }
        .metric { display: flex; align-items: center; gap: 0.75rem; color: var(--muted-foreground); font-size: 0.95rem; font-weight: 700; }
        .metric span { color: white; }

        .asset-actions { display: flex; gap: 1.25rem; }
        .btn-view, .btn-manage { flex: 1; padding: 1.25rem; border-radius: 1.25rem; font-size: 0.95rem; font-weight: 800; border: 1px solid var(--border); color: white; transition: 0.3s; background: rgba(255,255,255,0.02); }
        .btn-view:hover { background: rgba(255,255,255,0.08); transform: translateY(-3px); }
        .btn-manage:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-3px); box-shadow: 0 10px 20px var(--primary-glow); }

        .log-list { display: flex; flex-direction: column; gap: 2.5rem; max-width: 900px; }
        .log-item { padding: 4rem; border-radius: 3.5rem; display: flex; gap: 3rem; align-items: flex-start; position: relative; transition: 0.4s; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.01); }
        .log-item.unread { border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.03); }
        .log-icon-box { width: 70px; height: 70px; background: rgba(16, 185, 129, 0.1); border-radius: 1.5rem; display: flex; align-items: center; justify-content: center; color: var(--secondary); box-shadow: 0 10px 20px var(--secondary-glow); }
        .log-meta { display: flex; justify-content: space-between; margin-bottom: 1.5rem; width: 100%; align-items: baseline; }
        .log-title { font-size: 1.5rem; font-weight: 900; color: white; letter-spacing: -0.01em; }
        .log-time { font-size: 0.9rem; color: var(--muted-foreground); font-weight: 700; }
        .log-text { font-size: 1.25rem; color: var(--muted-foreground); line-height: 1.8; margin-bottom: 3rem; }
        
        .log-actions { display: flex; gap: 1.5rem; }
        .btn-reply { padding: 0.85rem 1.75rem; background: var(--gradient-main); color: white; border-radius: 1rem; font-size: 0.95rem; font-weight: 850; box-shadow: 0 10px 20px var(--primary-glow); }
        .btn-dismiss { padding: 0.85rem 1.75rem; border: 1px solid var(--border); color: var(--foreground); border-radius: 1rem; font-size: 0.95rem; font-weight: 850; background: rgba(255,255,255,0.03); }

        .empty-fleet, .empty-logs { padding: 8rem 4rem; text-align: center; border-radius: 4rem; background: rgba(255,255,255,0.02); border: 2px dashed rgba(255,255,255,0.05); }
        .empty-icon-wrap { width: 120px; height: 120px; background: rgba(255,255,255,0.03); border-radius: 3rem; display: flex; align-items: center; justify-content: center; margin-bottom: 3rem; }
        .empty-icon-pulse { color: var(--muted-foreground); opacity: 0.4; }
        .empty-fleet h3 { font-size: 2.5rem; margin-bottom: 1.5rem; font-weight: 900; }
        .empty-fleet p { color: var(--muted-foreground); font-size: 1.25rem; max-width: 500px; margin-bottom: 4rem; line-height: 1.7; }

        @media (max-width: 1024px) {
          .container { grid-template-columns: 1fr; gap: 3rem; }
          .sidebar { position: static; padding: 2.5rem; border-radius: 2.5rem; display: flex; align-items: center; justify-content: space-between; }
          .user-profile { margin-bottom: 0; }
          .desktop-only { display: none; }
          .mobile-only-btn { display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 1.25rem; background: var(--gradient-main); color: white; box-shadow: 0 10px 20px var(--primary-glow); }
          .dashboard-focal { padding: 3rem 0 12rem; }
          .header-meta h2 { font-size: 2.75rem; }
          
          .mobile-nav { 
            display: flex; position: fixed; bottom: 2rem; left: 1.5rem; right: 1.5rem; 
            background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(25px); 
            border: 1px solid rgba(255,255,255,0.1); border-radius: 2.5rem; 
            padding: 1rem; justify-content: space-around; align-items: center; z-index: 1000;
            box-shadow: 0 40px 80px rgba(0,0,0,0.8);
          }
          .mobile-nav button { display: flex; flex-direction: column; align-items: center; gap: 6px; color: var(--muted-foreground); font-size: 0.75rem; font-weight: 800; transition: 0.3s; padding: 0.5rem; position: relative; }
          .mobile-nav button.active { color: white; }
          .mobile-nav button.active::after { content: ''; position: absolute; bottom: -4px; width: 20px; height: 3px; background: var(--primary); border-radius: 2px; }
          
          .mobile-add-btn { width: 68px; height: 68px; border-radius: 50%; background: var(--gradient-main); color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 15px 30px var(--primary-glow); transform: translateY(-2.5rem); border: 6px solid var(--background); }
          .mobile-badge { position: absolute; top: -0.25rem; right: 0.25rem; background: var(--accent); color: white; font-size: 0.7rem; padding: 2px 8px; border-radius: 99rem; font-weight: 900; box-shadow: 0 5px 10px var(--accent-glow); }
        }
      `}</style>
    </div>
  );
}
