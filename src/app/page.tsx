'use client';

import Link from 'next/link';
import { ArrowRight, Activity, MapPin, Pill, Users, TrendingUp, Smartphone, Heart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              HealthBridge AI
            </span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition">Features</a>
            <a href="#impact" className="text-gray-600 hover:text-blue-600 font-medium transition">Impact</a>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-semibold mb-6">
            <Activity className="w-4 h-4" />
            AI-Powered Healthcare for Rural South Africa
          </div>

          <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Connecting Rural Healthcare<br />
            with <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              AI-Driven Intelligence
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            HealthBridge AI predicts patient volume, prevents medicine stockouts, optimizes mobile clinic routes,
            and allocates staff efficiently to improve healthcare delivery in underserved communities.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-2"
            >
              Explore Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-transparent border-2 border-gray-900 text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-900 hover:text-white transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
          {[
            { icon: Activity, label: 'Clinics Monitored', value: '127+', color: 'blue' },
            { icon: Pill, label: 'Medicine Types Tracked', value: '50+', color: 'green' },
            { icon: Users, label: 'Patients Served Monthly', value: '45K+', color: 'purple' },
            { icon: TrendingUp, label: 'Prediction Accuracy', value: '92%', color: 'orange' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all">
              <stat.icon className={`w-8 h-8 text-${stat.color}-600 mb-3`} />
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Rural Healthcare
            </h2>
            <p className="text-xl text-gray-600">
              AI-powered solutions tailored for South African healthcare challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: 'Patient Volume Prediction',
                description: 'AI forecasts daily patient numbers accounting for pension weeks, flu seasons, and local events.',
                color: 'blue'
              },
              {
                icon: Pill,
                title: 'Medicine Stock Management',
                description: 'Predictive alerts for ARVs, TB meds, and chronic disease medications before stockouts occur.',
                color: 'green'
              },
              {
                icon: MapPin,
                title: 'Mobile Clinic Routing',
                description: 'Optimized routes maximize patient reach while minimizing travel time and fuel costs.',
                color: 'purple'
              },
              {
                icon: Users,
                title: 'Staff Allocation',
                description: 'Smart recommendations distribute healthcare workers based on predicted demand.',
                color: 'orange'
              },
              {
                icon: Smartphone,
                title: 'Multi-Language Support',
                description: 'SMS/WhatsApp notifications in English, Zulu, Xhosa, and Afrikaans.',
                color: 'pink'
              },
              {
                icon: TrendingUp,
                title: 'Real-Time Dashboard',
                description: 'Live insights into clinic resources, alerts, and performance metrics.',
                color: 'indigo'
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer"
              >
                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="bg-gradient-to-br from-blue-600 to-green-600 py-20 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Tackling South Africa's Healthcare Challenges
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto">
            HealthBridge AI addresses the unique challenges faced by rural clinics across Limpopo,
            Eastern Cape, KwaZulu-Natal, and beyond.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Unpredictable Patient Surges',
                problem: 'Pension payout days cause 60% volume spikes',
                solution: 'AI predicts surges 7 days in advance'
              },
              {
                title: 'Medicine Stockouts',
                problem: '40% of clinics run out of critical ARVs monthly',
                solution: 'Predictive alerts prevent 85% of stockouts'
              },
              {
                title: 'Staff Shortages',
                problem: 'Inefficient allocation causes burnout',
                solution: 'Optimal scheduling reduces overtime by 30%'
              },
            ].map((impact, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-4">{impact.title}</h3>
                <div className="text-red-200 mb-3">❌ {impact.problem}</div>
                <div className="text-green-200">✅ {impact.solution}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Rural Healthcare?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join the mission to make healthcare accessible for every South African community.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all"
          >
            Explore Live Dashboard
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">HealthBridge AI</span>
          </div>
          <p className="text-gray-600 mb-2">
            Making Healthcare Accessible, One Clinic at a Time 🏥✨
          </p>
          <p className="text-sm text-gray-500">
            © 2026 HealthBridge AI. Built by <strong>Raphasha27</strong> with Next.js & .NET 8
          </p>
        </div>
      </footer>
    </div>
  );
}
