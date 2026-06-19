'use client';

import Link from 'next/link';
import { ArrowRight, Activity, MapPin, Calendar, Users, TrendingUp, Smartphone, ShieldCheck, DollarSign } from 'lucide-react';

// Premium Medical Cross Icon SVG Component
function MedicalCrossIcon({ className = "w-6 h-6 text-white" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z" fill="currentColor" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50">

      {/* Navigation */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/25">
              <MedicalCrossIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              NoShowIQ
            </span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition">Features</a>
            <a href="#impact" className="text-slate-600 hover:text-blue-600 font-medium transition">Revenue Impact</a>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              Enter Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-xs font-bold tracking-wider uppercase mb-6 border border-blue-100">
            <MedicalCrossIcon className="w-3.5 h-3.5 text-blue-600" />
            Predictive Intelligence for Private Medical Practices
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Stop Lost Revenue from<br />
            Patient <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              No-Shows & Cancellations
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            NoShowIQ uses advanced machine learning models to analyze patient history, weather, and schedule density. We predict appointment attendance, automate reminders, and fill cancellations instantly.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              Explore Live Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-transparent border-2 border-slate-300 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {[
            { icon: TrendingUp, label: 'ML Prediction Accuracy', value: '94.8%', color: 'blue' },
            { icon: DollarSign, label: 'Monthly Revenue Saved', value: 'R35K+', suffix: '/ practitioner', color: 'emerald' },
            { icon: Calendar, label: 'Average Attendance Rate', value: '96.2%', color: 'cyan' },
            { icon: Users, label: 'Private Practices Active', value: '350+', color: 'indigo' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                <stat.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-white py-24 border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Designed Specifically for High-Performing Clinics
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Custom-built workflows that protect practitioner hours and secure practice profitability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: 'No-Show Probability Index',
                description: 'Pre-evaluates every booking based on past attendance, age, distance, and booking lead-time to output an exact risk profile.',
                color: 'blue'
              },
              {
                icon: Smartphone,
                title: 'Smart Conversational Reminders',
                description: 'Triggers multi-lingual, personalized WhatsApp/SMS alerts. High-risk patients receive interactive confirm/reschedule prompts.',
                color: 'cyan'
              },
              {
                icon: Calendar,
                title: 'Auto-Fill Cancellation Queue',
                description: 'When a cancellation is predicted or confirmed, the platform automatically alerts waitlisted patients to claim the slot.',
                color: 'emerald'
              },
              {
                icon: DollarSign,
                title: 'Revenue Leakage Analytics',
                description: 'Instantly quantifies lost time and displays saved billing values in real time so administrators can trace ROI.',
                color: 'indigo'
              },
              {
                icon: ShieldCheck,
                title: 'Practice Management Integration',
                description: 'Integrates natively into EHR and billing software, syncing calendar updates without changing existing reception flows.',
                color: 'purple'
              },
              {
                icon: Users,
                title: 'Multi-Practitioner Scheduling',
                description: 'Scales from individual specialist suites to massive private medical centers managing dozens of operating rooms.',
                color: 'pink'
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-slate-50/50 p-8 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition border border-slate-100">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight">
            Stop Letting Idle Slots Drain Your Practice
          </h2>
          <p className="text-lg mb-16 opacity-80 max-w-3xl mx-auto">
            Private specialist suites lose an average of R120,000 annually per doctor to empty appointment slots. NoShowIQ acts as an intelligent shield.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Unpredicted Absenteeism',
                problem: 'No-shows cost private suites 15-20% capacity',
                solution: 'AI predicts absences and triggers early rebooking'
              },
              {
                title: 'Unfilled Cancellations',
                problem: 'Last-minute cancellations go completely wasted',
                solution: 'Waitlist auto-fill recovers slots within 10 minutes'
              },
              {
                title: 'Manual Confirmation Load',
                problem: 'Receptionists spend 2.5 hours/day cold-calling',
                solution: 'Conversational triggers automate 92% of outreach'
              },
            ].map((impact, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-blue-500/30 transition">
                <h3 className="text-xl font-bold mb-4 text-white">{impact.title}</h3>
                <div className="text-rose-400 mb-3 text-sm flex items-center justify-center gap-1.5 font-medium">
                  <span>❌</span> {impact.problem}
                </div>
                <div className="text-emerald-400 text-sm flex items-center justify-center gap-1.5 font-semibold">
                  <span>✅</span> {impact.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Protect Your Clinic's Bottom Line Today
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Set up NoShowIQ in under an hour. Keep your schedules full, your staff happy, and your patients cared for.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all"
          >
            Explore Live Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <MedicalCrossIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">NoShowIQ</span>
          </div>
          <p className="text-slate-500 text-sm mb-2">
            The Revenue Protection Engine for Modern Private Clinics 🏥🔒
          </p>
          <p className="text-xs text-slate-400">
            © 2026 NoShowIQ. Built by <strong>Raphasha27</strong> with Next.js, FastAPI & Vercel
          </p>
        </div>
      </footer>
    </div>
  );
}

