"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- Types ---
type Appointment = {
  id: string;
  patient: string;
  time: string;
  risk: number;
  riskLevel: 'high' | 'medium' | 'low';
  type: string;
  status: string;
  reasoning: string[];
};

// --- Mock Data Types are now handled via API ---

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const ActivityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);

// --- Components ---

const RiskBadge = ({ level }: { level: string }) => {
  const styles = {
    high: { bg: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', border: '1px solid rgba(220, 38, 38, 0.2)' },
    medium: { bg: 'rgba(217, 119, 6, 0.1)', color: '#d97706', border: '1px solid rgba(217, 119, 6, 0.2)' },
    low: { bg: 'rgba(5, 150, 105, 0.1)', color: '#059669', border: '1px solid rgba(5, 150, 105, 0.2)' },
  }[level as 'high' | 'medium' | 'low'];

  return (
    <span style={{ 
      padding: '4px 10px', 
      borderRadius: '20px', 
      fontSize: '0.75rem', 
      fontWeight: 700, 
      textTransform: 'uppercase',
      ...styles
    }}>
      {level} Risk
    </span>
  );
};

export default function Home() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');
  const [showModal, setShowModal] = useState(false);
  const [showKiosk, setShowKiosk] = useState(false);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', email: '', phone: '' });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resApps, resPatients, resPayments] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/patients'),
        fetch('/api/payments')
      ]);
      setAppointments(await resApps.json());
      setPatients(await resPatients.json());
      setPayments(await resPayments.json());
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const predictAllRisks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', { method: 'PATCH' });
      const updated = await res.json();
      setAppointments(updated);
      showNotification("AI Predictions Refreshed");
    } catch (err) {
      showNotification("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      patient: patientName || 'New Patient',
      time: '12:00 PM',
      risk: 0.1,
      riskLevel: 'low',
      type: 'Consultation',
      status: 'Pending',
      date: new Date().toISOString()
    };
    
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const newApp = await res.json();
      setAppointments(prev => [...prev, newApp]);
      setShowModal(false);
      setPatientName('');
      showNotification("Appointment Scheduled!");
    } catch (err) {
      showNotification("Scheduling failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main style={{ padding: '0', maxWidth: '1400px', margin: '0 auto', display: 'flex', minHeight: '100vh', flexWrap: 'wrap', backgroundColor: '#f8fafc' }}>
      
      {/* Sidebar - Light Theme, High Contrast Black Text */}
      <nav className="sidebar" style={{ 
        width: '260px', 
        backgroundColor: '#ffffff', 
        color: '#0f172a', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '24px 16px',
        borderRight: '1px solid #e2e8f0',
        overflowY: 'auto'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a', paddingLeft: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: 'var(--accent)', borderRadius: '10px', color: 'white', display: 'grid', placeItems: 'center' }}>IQ</div>
          NoShowIQ
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', paddingLeft: '12px', marginBottom: '8px' }}>Main</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button className="btn" style={{ justifyContent: 'flex-start', background: activeTab === 'daily' ? '#eff6ff' : 'transparent', color: activeTab === 'daily' ? '#2563eb' : '#334155' }} onClick={() => setActiveTab('daily')}>
                <ActivityIcon /> Dashboard
              </button>
              <button className="btn" style={{ justifyContent: 'flex-start', background: activeTab === 'schedule' ? '#eff6ff' : 'transparent', color: activeTab === 'schedule' ? '#2563eb' : '#334155' }} onClick={() => setActiveTab('schedule')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Schedule
              </button>
              <button className="btn" style={{ justifyContent: 'flex-start', background: activeTab === 'patients' ? '#eff6ff' : 'transparent', color: activeTab === 'patients' ? '#2563eb' : '#334155' }} onClick={() => setActiveTab('patients')}>
                <UserIcon /> Patients
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', paddingLeft: '12px', marginBottom: '8px' }}>Operations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button className="btn" style={{ justifyContent: 'flex-start', background: activeTab === 'waitlist' ? '#eff6ff' : 'transparent', color: activeTab === 'waitlist' ? '#2563eb' : '#334155', fontWeight: 600 }} onClick={() => setActiveTab('waitlist')}>
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Waitlist (Auto)
              </button>
              <button className="btn" style={{ justifyContent: 'flex-start', background: activeTab === 'reminders' ? '#eff6ff' : 'transparent', color: activeTab === 'reminders' ? '#2563eb' : '#334155', fontWeight: 600 }} onClick={() => setActiveTab('reminders')}>
                 <BellIcon /> Reminders
              </button>
              <button className="btn" style={{ justifyContent: 'flex-start', background: showKiosk ? '#eff6ff' : 'transparent', color: showKiosk ? '#2563eb' : '#334155', fontWeight: 600 }} onClick={() => setShowKiosk(true)}>
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Check-In Kiosk
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', paddingLeft: '12px', marginBottom: '8px' }}>Insights</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button className="btn" style={{ justifyContent: 'flex-start', color: '#334155', fontWeight: 600 }} onClick={() => setActiveTab('analytics')}>
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Analytics
              </button>
              <button className="btn" style={{ justifyContent: 'flex-start', background: activeTab === 'payments' ? '#eff6ff' : 'transparent', color: activeTab === 'payments' ? '#2563eb' : '#334155', fontWeight: 600 }} onClick={() => setActiveTab('payments')}>
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Payments
              </button>
            </div>
          </div>

        </div>
        
        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
          <button className="btn" style={{ justifyContent: 'flex-start', color: '#64748b', fontWeight: 600 }} onClick={() => router.push('/login')}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <section className="main-content" style={{ flex: 1, padding: '32px', minWidth: '320px', backgroundColor: '#f8fafc' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
              {activeTab === 'daily' && 'Clinic Dashboard'}
              {activeTab === 'patients' && 'Patient Directory'}
              {activeTab === 'schedule' && 'Appointment Schedule'}
              {activeTab === 'payments' && 'Payments Overview'}
              {activeTab === 'waitlist' && 'Smart Waitlist'}
              {activeTab === 'reminders' && 'Reminder Center'}
            </h1>
            <p style={{ color: '#64748b' }}>Real-time prediction and schedule optimization</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: '#0f172a', cursor: 'pointer' }} onClick={() => showNotification("You have 3 unread notifications")}>
              <BellIcon />
              <div style={{ width: '8px', height: '8px', background: '#dc2626', borderRadius: '50%' }}></div>
            </div>
          </div>
        </header>

        {activeTab === 'daily' && (
          <>
            {/* Stats Grid */}
            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(to bottom right, #ffffff, #f1f5f9)', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Total Appointments</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{appointments.length}</div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>↑ 12% from yesterday</div>
              </div>
              <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(to bottom right, #ffffff, #fff1f2)', border: '1px solid #fecaca', boxShadow: '0 4px 6px -1px rgba(220,38,38,0.05)' }}>
                <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>High Risk Patients</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#dc2626' }}>{appointments.filter(a => a.riskLevel === 'high').length}</div>
                <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, marginTop: '4px' }}>Requires immediate action</div>
              </div>
              <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(to bottom right, #ffffff, #f0f9ff)', border: '1px solid #bae6fd', boxShadow: '0 4px 6px -1px rgba(37,99,235,0.05)' }}>
                <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Est. Revenue Risk</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>$1,240</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginTop: '4px' }}>Based on no-show prob.</div>
              </div>
            </div>

            {/* Real-time Appointments List */}
            <div className="glass-card" style={{ padding: '24px', background: 'white', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
              {loading && activeTab === 'daily' && (
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  background: 'rgba(255, 255, 255, 0.7)', 
                  backdropFilter: 'blur(4px)', 
                  zIndex: 10, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <div style={{ width: '200px', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div className="shimmer" style={{ width: '40%', height: '100%', background: '#2563eb', borderRadius: '2px' }}></div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563eb' }}>AI ENGINE SCANNING...</div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Real-Time Flow IQ</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                   <button 
                    onClick={predictAllRisks}
                    disabled={loading}
                    className="btn" 
                    style={{ 
                      fontSize: '0.85rem', 
                      backgroundColor: loading ? '#94a3b8' : '#2563eb', 
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                    }}>
                    {loading ? 'Analyzing...' : 'Refresh Predictions'}
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.85rem' }}>
                      <th style={{ padding: '16px 8px' }}>Patient</th>
                      <th style={{ padding: '16px 8px' }}>Time</th>
                      <th style={{ padding: '16px 8px' }}>Risk Score</th>
                      <th style={{ padding: '16px 8px' }}>Status</th>
                      <th style={{ padding: '16px 8px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((app) => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.95rem', color: '#1e293b' }}>
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{app.patient}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{app.type}</div>
                        </td>
                        <td style={{ padding: '16px 8px', fontWeight: 600 }}>{app.time}</td>
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ width: '100px', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${app.risk * 100}%`, 
                              height: '100%', 
                              background: app.risk > 0.6 ? '#dc2626' : app.risk > 0.3 ? '#d97706' : '#059669',
                              transition: 'width 0.5s ease'
                            }}></div>
                          </div>
                          <div style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: 600 }}>{(app.risk * 100).toFixed(0)}%</div>
                        </td>
                        <td style={{ padding: '16px 8px' }}><RiskBadge level={app.riskLevel} /></td>
                        <td style={{ padding: '16px 8px' }}>
                      <button 
                        className="btn" 
                        onClick={() => setSelectedAppointment(app)}
                        style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' }}
                      >
                        Details
                      </button>
                    </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Patients View Stub */}
        {activeTab === 'patients' && (
            <div className="glass-card" style={{ padding: '24px', background: 'white', border: '1px solid #e2e8f0' }}>
               <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>All Patients</h2>
               <ul style={{ listStyle: 'none', padding: 0 }}>
                 {patients.map(p => (
                   <li key={p.id} style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                     <div>
                       <div style={{ fontWeight: 600 }}>{p.name}</div>
                       <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.email}</div>
                     </div>
                     <span style={{ color: '#64748b' }}>Last Visit: {p.lastVisit}</span>
                   </li>
                 ))}
               </ul>
            </div>
        )}

        {/* Schedule View - Timeline */}
        {activeTab === 'schedule' && (
           <div className="glass-card" style={{ padding: '24px', background: 'white', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Timeline — {formatDate(currentDate)}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn" style={{ fontSize: '0.8rem', background: '#f1f5f9', color: '#334155' }} onClick={() => changeDate(-1)}>Previous</button>
                  <button className="btn" style={{ fontSize: '0.8rem', background: '#f1f5f9', color: '#334155' }} onClick={() => changeDate(1)}>Next</button>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'].map((slot) => {
                  const appsInSlot = appointments.filter(a => a.time === slot);
                  return (
                    <div key={slot} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '16px', borderBottom: '1px solid #f8fafc', paddingBottom: '12px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', paddingTop: '10px' }}>{slot}</div>
                      <div style={{ minHeight: '50px', background: appsInSlot.length > 1 ? '#fff1f2' : '#f8fafc', borderRadius: '8px', border: '1px dashed #e2e8f0', padding: '4px', display: 'flex', gap: '8px' }}>
                         {appsInSlot.length === 0 && <div style={{ color: '#cbd5e1', fontSize: '0.8rem', padding: '10px' }}>Available</div>}
                         {appsInSlot.map(app => (
                           <div key={app.id} 
                                onClick={() => setSelectedAppointment(app)}
                                style={{ 
                                  flex: 1, 
                                  background: 'white', 
                                  borderLeft: `4px solid ${app.risk > 0.6 ? '#dc2626' : '#059669'}`, 
                                  padding: '8px', 
                                  borderRadius: '4px', 
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                  fontSize: '0.85rem',
                                  cursor: 'pointer'
                                }}>
                             <div style={{ fontWeight: 600 }}>{app.patient}</div>
                             <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.type}</div>
                           </div>
                         ))}
                      </div>
                    </div>
                  );
                })}
              </div>
           </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
           <div className="glass-card" style={{ padding: '24px', background: 'white', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Advanced Analytics</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                   <div style={{ color: '#64748b', fontSize: '0.8rem' }}>No-Show Rate</div>
                   <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>12.4%</div>
                   <div style={{ color: '#10b981', fontSize: '0.8rem' }}>↓ 2% vs last week</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                   <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Revenue Saved</div>
                   <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>$4,250</div>
                   <div style={{ color: '#10b981', fontSize: '0.8rem' }}>From predictive overbooking</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                   <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Avg. Wait Time</div>
                   <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>14m</div>
                   <div style={{ color: '#64748b', fontSize: '0.8rem' }}>On target</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '20px' }}>Weekly No-Shows</h3>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '140px', paddingBottom: '20px' }}>
                    {[65, 40, 80, 35, 90, 55, 70].map((h, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '100%', height: `${h}%`, background: h > 70 ? '#dc2626' : '#2563eb', borderRadius: '4px 4px 0 0', transition: 'height 1s' }}></div>
                        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '20px' }}>Revenue Impact</h3>
                  <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <svg width="120" height="120" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="75, 100" />
                    </svg>
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>$12.4k</div>
                      <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Projected</div>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        )}

        {/* Mobile Bottom Navigation */}
         <nav className="mobile-nav" style={{ 
            display: 'none', 
            position: 'fixed', bottom: 0, left: 0, right: 0, 
            background: 'white', borderTop: '1px solid #e2e8f0', 
            padding: '12px', justifyContent: 'space-around', zIndex: 100 
          }}>
            <button onClick={() => setActiveTab('daily')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'daily' ? '#2563eb' : '#64748b' }}>
              <ActivityIcon />
              <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Dash</span>
            </button>
            <button onClick={() => setActiveTab('patients')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'patients' ? '#2563eb' : '#64748b' }}>
              <UserIcon />
              <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Patients</span>
            </button>
            <button onClick={() => setActiveTab('schedule')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === 'schedule' ? '#2563eb' : '#64748b' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Schedule</span>
            </button>
          </nav>

          {/* Patient Detail Modal */}
          {selectedAppointment && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="glass-card" style={{ background: 'white', padding: '0', borderRadius: '16px', width: '90%', maxWidth: '600px', overflow: 'hidden', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{selectedAppointment.patient}</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{selectedAppointment.type} • {selectedAppointment.time}</p>
                  </div>
                  <button onClick={() => setSelectedAppointment(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
                </div>
                
                <div style={{ padding: '24px', overflowY: 'auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ background: '#f1f5f9', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Risk Assessment</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: selectedAppointment.riskLevel === 'high' ? '#dc2626' : selectedAppointment.riskLevel === 'medium' ? '#d97706' : '#059669' }}>
                        {(selectedAppointment.risk * 100).toFixed(0)}%
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#334155' }}>Probability of No-Show</div>
                    </div>
                    <div style={{ background: '#f1f5f9', padding: '16px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Recommendation</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                        {selectedAppointment.riskLevel === 'high' ? 'Double Book or Call' : selectedAppointment.riskLevel === 'medium' ? 'Waitlist Available' : 'No Action Needed'}
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>Reasoning (AI Insights)</h3>
                  <ul style={{ paddingLeft: '20px', color: '#334155', marginBottom: '24px', lineHeight: '1.6' }}>
                    {selectedAppointment.reasoning && selectedAppointment.reasoning.length > 0 ? (
                      selectedAppointment.reasoning.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))
                    ) : (
                      <li>No specific risk factors detected for this patient.</li>
                    )}
                  </ul>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                     <button className="btn" onClick={() => showNotification('Reminder sent via SMS!')} style={{ flex: 1, background: '#e0f2fe', color: '#0284c7' }}>
                        Send Reminder
                     </button>
                     <button className="btn" onClick={() => showNotification('Patient marked as confirmed.')} style={{ flex: 1, background: '#dcfce7', color: '#16a34a' }}>
                        Confirm
                     </button>
                     <button className="btn" onClick={() => showNotification('Reschedule link sent.')} style={{ flex: 1, background: '#fef2f2', color: '#dc2626' }}>
                        Reschedule
                     </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {notification && (
            <div className="animate-fade" style={{
              position: 'fixed',
              bottom: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#0f172a',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '30px',
              zIndex: 300,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#4ade80' }}>✓</span> {notification}
            </div>
          )}
      </section>

      {/* New Appointment Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ background: 'white', padding: '0', borderRadius: '16px', width: '90%', maxWidth: '500px', overflow: 'hidden' }}>
            <div style={{ padding: '24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>New Appointment</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            <form onSubmit={handleAddAppointment} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Patient Name</label>
                <input 
                  autoFocus
                  type="text" 
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. John Doe"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#0f172a' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Appointment Type</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', background: 'white', color: '#0f172a' }}>
                  <option>General Checkup</option>
                  <option>Consultation</option>
                  <option>Follow-up</option>
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Time</label>
                <input type="time" defaultValue="09:00" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#0f172a' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                 <button type="button" onClick={() => setShowModal(false)} className="btn" style={{ background: '#f1f5f9', color: '#64748b' }}>Cancel</button>
                 <button type="submit" className="btn" style={{ background: '#2563eb', color: 'white' }}>Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payments View */}
      {activeTab === 'payments' && (
         <div className="glass-card" style={{ padding: '24px', background: 'white', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Recent Payments</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.85rem' }}>
                    <th style={{ padding: '16px 8px' }}>Patient</th>
                    <th style={{ padding: '16px 8px' }}>Service</th>
                    <th style={{ padding: '16px 8px' }}>Date</th>
                    <th style={{ padding: '16px 8px' }}>Amount</th>
                    <th style={{ padding: '16px 8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.95rem', color: '#1e293b' }}>
                      <td style={{ padding: '16px 8px', fontWeight: 600 }}>{payment.patient}</td>
                      <td style={{ padding: '16px 8px' }}>{payment.service}</td>
                      <td style={{ padding: '16px 8px', color: '#64748b' }}>{payment.date}</td>
                      <td style={{ padding: '16px 8px', fontWeight: 700 }}>{payment.amount}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          background: payment.status === 'Paid' ? '#dcfce7' : '#fff7ed',
                          color: payment.status === 'Paid' ? '#16a34a' : '#c2410c'
                        }}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </div>
      )}

      {/* Waitlist View */}
      {activeTab === 'waitlist' && (
        <div className="glass-card" style={{ padding: '24px', background: 'white', border: '1px solid #e2e8f0' }}>
           <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Priority Waitlist</h2>
           <p style={{ color: '#64748b', marginBottom: '16px' }}>Patients automatically prioritized by symptoms and history.</p>
           <ul style={{ listStyle: 'none', padding: 0 }}>
             {[
               { id: 'w1', name: 'James Carter', priority: 'High', reason: 'Acute Pain' },
               { id: 'w2', name: 'Linda Kim', priority: 'Medium', reason: 'Reschedule needed' },
               { id: 'w3', name: 'Paul Smith', priority: 'Low', reason: 'Routine checkup' },
             ].map(p => (
               <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #f8fafc' }}>
                  <span>
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>{p.reason}</span>
                  </span>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                    background: p.priority === 'High' ? '#fee2e2' : p.priority === 'Medium' ? '#ffedd5' : '#dcfce7',
                    color: p.priority === 'High' ? '#dc2626' : p.priority === 'Medium' ? '#d97706' : '#16a34a'
                  }}>{p.priority}</span>
               </li>
             ))}
           </ul>
        </div>
      )}

      {/* Reminders View */}
      {activeTab === 'reminders' && (
        <div className="glass-card" style={{ padding: '24px', background: 'white', border: '1px solid #e2e8f0' }}>
           <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Automated Reminders</h2>
           <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1, padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                 <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>24</div>
                 <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Sent Today</div>
              </div>
              <div style={{ flex: 1, padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                 <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>21</div>
                 <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Confirmed</div>
              </div>
           </div>
           <button className="btn" style={{ width: '100%', background: '#2563eb', color: 'white', justifyContent: 'center' }} onClick={() => showNotification("Batch reminders sent!")}>
              Send Pending Reminders
           </button>
        </div>
      )}

      {/* Kiosk Mode Overlay */}
      {showKiosk && (
         <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'white', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: '#2563eb', marginBottom: '12px' }}>NoShowIQ</div>
            <h1 style={{ fontSize: '2rem', marginBottom: '48px', color: '#0f172a' }}>Self Check-In Kiosk</h1>
            <div style={{ display: 'flex', gap: '24px' }}>
               <button className="btn" style={{ padding: '24px 48px', fontSize: '1.2rem', background: '#2563eb', color: 'white', borderRadius: '16px' }} onClick={() => showNotification("Scan your QR code")}>
                  Check In
               </button>
               <button className="btn" style={{ padding: '24px 48px', fontSize: '1.2rem', background: '#f8fafc', color: '#0f172a', borderRadius: '16px', border: '1px solid #e2e8f0' }} onClick={() => setShowKiosk(false)}>
                  Close Kiosk
               </button>
            </div>
         </div>
      )}

      {/* FAB Menu Actions */}
       {fabMenuOpen && (
           <div style={{ position: 'fixed', bottom: '150px', left: '80px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 90 }}>
           <button onClick={() => { setShowModal(true); setFabMenuOpen(false); }} className="btn" style={{ background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', justifyContent: 'flex-start', color: '#0f172a', fontWeight: 600 }}>
             📅 New Appointment
           </button>
            <button onClick={() => { setShowPatientModal(true); setFabMenuOpen(false); }} className="btn" style={{ background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', justifyContent: 'flex-start', color: '#0f172a', fontWeight: 600 }}>
              👤 Add Patient
            </button>
           <button onClick={() => { setShowKiosk(true); setFabMenuOpen(false); }} className="btn" style={{ background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', justifyContent: 'flex-start', color: '#059669', fontWeight: 600 }}>
             ✅ Quick Check-In
           </button>
           <button onClick={() => { setActiveTab('waitlist'); setFabMenuOpen(false); }} className="btn" style={{ background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', justifyContent: 'flex-start', color: '#2563eb', fontWeight: 600 }}>
             📋 View Waitlist
           </button>
           <button onClick={async () => { 
                const payload = { patient: 'EMERGENCY', time: 'NOW', risk: 1.0, riskLevel: 'high', type: 'URGENT', status: 'Confirmed', date: new Date().toISOString() };
                setLoading(true);
                try {
                  const res = await fetch('/api/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                  const freshApp = await res.json();
                  setAppointments(prev => [freshApp, ...prev]);
                  showNotification("Emergency slot created!");
                } catch (err) {
                  showNotification("Action failed");
                } finally {
                  setLoading(false);
                  setFabMenuOpen(false); 
                }
              }} className="btn" style={{ background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', justifyContent: 'flex-start', color: '#dc2626', fontWeight: 600 }}>
             🚨 Emergency Slot
           </button>
           <button onClick={() => { showNotification("Time blocked for Provider A"); setFabMenuOpen(false); }} className="btn" style={{ background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', justifyContent: 'flex-start', color: '#64748b', fontWeight: 600 }}>
             🚫 Block Time
           </button>
         </div>
       )}

      {/* Add Patient Modal */}
      {showPatientModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ background: 'white', padding: '0', borderRadius: '16px', width: '90%', maxWidth: '500px', overflow: 'hidden' }}>
            <div style={{ padding: '24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Add New Patient</h2>
              <button onClick={() => setShowPatientModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Full Name</label>
                <input type="text" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} placeholder="e.g. Jane Doe" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#0f172a' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Email</label>
                <input type="email" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} placeholder="jane@example.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#0f172a' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Phone</label>
                <input type="tel" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} placeholder="(555) 123-4567" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#0f172a' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                 <button onClick={() => setShowPatientModal(false)} className="btn" style={{ background: '#f1f5f9', color: '#64748b' }}>Cancel</button>
                 <button onClick={async () => { 
                   setLoading(true);
                   try {
                     const res = await fetch('/api/patients', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({...newPatient, lastVisit: new Date().toISOString().split('T')[0]})
                     });
                     const freshPatient = await res.json();
                     setPatients(prev => [...prev, freshPatient]);
                     setShowPatientModal(false); 
                     setNewPatient({ name: '', email: '', phone: '' });
                     showNotification("Patient added successfully");
                   } catch (err) {
                     showNotification("Failed to add patient");
                   } finally {
                     setLoading(false);
                   }
                  }} className="btn" style={{ background: '#2563eb', color: 'white' }}>Add Patient</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick Action Button - Menu Trigger */}
        <button 
          className="btn btn-primary"
          onClick={() => setFabMenuOpen(!fabMenuOpen)}
          style={{
            position: 'fixed',
            bottom: '80px', 
            left: '80px',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            padding: 0,
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
            zIndex: 90,
            display: 'grid',
            placeItems: 'center',
            transform: fabMenuOpen ? 'rotate(45deg)' : 'none',
            transition: 'transform 0.2s'
          }}
          title="Quick Actions"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>

      <style jsx global>{`
        @media (min-width: 769px) {
           /* On desktop, FAB should be bottom left as requested originally, or keep right? Let's keep right standard for FABs or stick to previous request? 
              User asked for "Keep it mobile friendly". Standard FAB is bottom right. 
              Let's override for desktop to be bottom left if that was the "dev badge replacement" spot.
           */
        }
        @media (max-width: 768px) {
          .sidebar {
            display: none !important;
          }
          .mobile-nav {
            display: flex !important;
          }
          .main-content {
            padding: 16px !important;
            margin-bottom: 80px; /* Space for bottom nav */
          }
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .shimmer {
          animation: shimmer 1.5s infinite ease-in-out;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </main>
  );
}
