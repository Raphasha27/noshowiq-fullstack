import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NoShowIQ - Stop Healthcare No-Shows',
  description: 'AI-powered appointment scheduling that predicts and prevents patient no-shows.',
};

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0f172a', color: 'white', overflowX: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 800, fontSize: '1.2rem' }}>
          <div style={{ width: '32px', height: '32px', background: '#3b82f6', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>IQ</div>
          NoShowIQ
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>Features</a>
          <a href="#demo" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>Live Demo</a>
          <Link href="/login" style={{ padding: '10px 24px', background: 'white', color: '#0f172a', fontWeight: 700, borderRadius: '24px', textDecoration: 'none' }}>
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', textAlign: 'center', position: 'relative' }}>
        
        {/* Background Glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '20px', color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px' }}>
            ✨ AI-Powered Efficiency for Clinics
          </div>
          
          <h1 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', background: 'linear-gradient(to right, white, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Stop No-Shows Before <br/> They Happen.
          </h1>
          
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 48px', lineHeight: 1.6 }}>
            NoShowIQ uses advanced machine learning to predict patient attendance, automate reminders, and fill gaps instantly with a smart waitlist.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link href="/login" style={{ padding: '16px 48px', background: '#3b82f6', color: 'white', fontWeight: 700, borderRadius: '12px', textDecoration: 'none', fontSize: '1.1rem', boxShadow: '0 20px 40px -10px rgba(59,130,246,0.4)', transition: 'transform 0.2s' }}>
              Get Started Now
            </Link>
            <a href="#how-it-works" style={{ padding: '16px 48px', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 600, borderRadius: '12px', textDecoration: 'none', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              How it Works
            </a>
          </div>
        </div>

        {/* Hero Visual */}
        <div style={{ marginTop: '80px', perspective: '1000px' }}>
           <div style={{ 
             maxWidth: '900px', 
             margin: '0 auto', 
             background: 'rgba(30, 41, 59, 0.7)', 
             border: '1px solid rgba(255,255,255,0.1)', 
             borderRadius: '24px', 
             padding: '24px', 
             transform: 'rotateX(10deg) scale(0.95)',
             boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
             backdropFilter: 'blur(20px)'
           }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'left' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                   <div style={{ color: '#60a5fa', fontWeight: 700, marginBottom: '8px' }}>High Risk Detected</div>
                   <div style={{ fontSize: '2rem', fontWeight: 800 }}>R22,940</div>
                   <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Potential revenue saved</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                   <div style={{ color: '#34d399', fontWeight: 700, marginBottom: '8px' }}>Optimization</div>
                   <div style={{ fontSize: '2rem', fontWeight: 800 }}>+12%</div>
                   <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Schedule efficiency</div>
                </div>
                 <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                   <div style={{ color: '#f472b6', fontWeight: 700, marginBottom: '8px' }}>Predictions</div>
                   <div style={{ fontSize: '2rem', fontWeight: 800 }}>94%</div>
                   <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Accuracy rate</div>
                </div>
             </div>
           </div>
        </div>

      </section>

      {/* Features Grid */}
      <section id="features" style={{ background: '#1e293b', padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
             <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Everything you need to run efficiently.</h2>
             <p style={{ color: '#94a3b8' }}>Modern tooling for modern clinics.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
             {[
               { icon: '🔮', title: 'Predictive AI', desc: 'Analyzes patient history and behavioral patterns to score no-show risk in real-time.' },
               { icon: '⚡', title: 'Smart Waitlist', desc: 'Automatically fills last-minute cancellations with high-priority patients nearby.' },
               { icon: '📱', title: 'Auto-Reminders', desc: 'Intelligent SMS & WhatsApp reminders sent at the optimal time for response.' },
               { icon: '📊', title: 'Revenue Analytics', desc: 'Track lost revenue, recovery rates, and clinic performance with beautiful charts.' },
               { icon: '🔒', title: 'Secure & Private', desc: 'Enterprise-grade security ensuring patient data remains confidential and protected.' },
               { icon: '🌍', title: 'Cloud Native', desc: 'Access your clinic dashboard from anywhere, on any device, anytime.' },
             ].map((f, i) => (
               <div key={i} style={{ padding: '32px', background: '#0f172a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ fontSize: '2rem', marginBottom: '24px' }}>{f.icon}</div>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>{f.title}</h3>
                 <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{f.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
         <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '32px' }}>Ready to optimize your clinic?</h2>
         <Link href="/login" style={{ padding: '20px 64px', background: 'white', color: '#0f172a', fontWeight: 800, borderRadius: '16px', textDecoration: 'none', fontSize: '1.2rem' }}>
            Get Started Free
         </Link>
      </section>
      
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px 24px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
        © 2026 NoShowIQ. Built by Raphasha27 using Next.js & .NET 8.
      </footer>

    </main>
  );
}
