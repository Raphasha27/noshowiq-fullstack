"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate login delay
    setTimeout(() => {
      if ((email === 'admin@noshowiq.com' || email === 'doctor@clinic.com') && (password === 'demo123' || password === 'demo')) {
        localStorage.setItem('user', JSON.stringify({ name: 'Dr. Sarah Connor', role: 'admin' }));
        setLoading(false);
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}></div>

      <div className="login-card" style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '3rem', 
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px', 
        boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.5)'
      }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)', 
            borderRadius: '12px', 
            margin: '0 auto 1.5rem', 
            color: 'white', 
            display: 'grid', 
            placeItems: 'center',
            fontSize: '1.2rem',
            fontWeight: 800,
            boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)'
          }}>IQ</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: '#64748b' }}>Sign in to access your clinic dashboard</p>
        </div>

        {error && (
          <div style={{ 
            marginBottom: '1rem', 
            padding: '12px', 
            borderRadius: '12px', 
            background: '#fee2e2', 
            color: '#dc2626', 
            fontSize: '0.9rem', 
            fontWeight: 600,
            textAlign: 'center',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@clinic.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '1rem',
                color: '#0f172a',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Password</label>
              <a href="#" style={{ fontSize: '0.85rem', color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Forgot?</a>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '1rem',
                color: '#0f172a',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              className="input-field"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'transform 0.1s',
              boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
          Don't have an account? <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Contact Admin</a>
        </div>

        {/* Demo Credentials Hint */}
        <div style={{ marginTop: '24px', padding: '16px', background: '#eff6ff', borderRadius: '12px', border: '1px dashed #bfdbfe' }}>
           <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af', marginBottom: '8px', textTransform: 'uppercase' }}>Demo Credentials</div>
           <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#334155', marginBottom: '4px' }}>
              <span>Email:</span> <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>admin@noshowiq.com</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#334155', marginBottom: '12px' }}>
              <span>Pass:</span> <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>demo123</span>
           </div>
           <button 
             type="button"
             onClick={() => {
               setEmail('admin@noshowiq.com');
               setPassword('demo123');
             }}
             style={{
               width: '100%',
               padding: '8px',
               background: 'white',
               border: '1px solid #bfdbfe',
               borderRadius: '8px',
               color: '#2563eb',
               fontSize: '0.8rem',
               fontWeight: 600,
               cursor: 'pointer'
             }}
           >
             ⚡ Auto-Fill Demo User
           </button>
        </div>
      </div>

      <style jsx>{`
        .input-field:focus {
          border-color: #2563eb !important;
          background: white !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
        }
      `}</style>
    </main>
  );
}
