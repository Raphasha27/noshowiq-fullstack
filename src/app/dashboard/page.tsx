'use client';

import { useState, useEffect } from 'react';
import {
  Activity, MapPin, Calendar, Users, TrendingUp, AlertCircle,
  CheckCircle, Clock, Send, MoreVertical, Bell, Settings,
  ChevronDown, Truck, Search, Menu, X, Filter, Download, Plus, ChevronRight, DollarSign, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import AIChatbot from '../components/AIChatbot';
import dynamic from 'next/dynamic';

// Dynamically import InteractiveMap (client-side only)
const InteractiveMap = dynamic(() => import('../components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 h-80 flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  )
});

// Premium Medical Cross Icon SVG Component
function MedicalCrossIcon({ className = "w-6 h-6 text-white" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z" fill="currentColor" />
    </svg>
  );
}

// Mock data for Private Medical Centres
const clinicsData = [
  {
    id: 1,
    name: 'Sandton Specialist Medical Centre',
    province: 'Gauteng',
    type: 'Multi-Specialty Suite',
    predictedPatients: 24, // appointments today
    capacity: 28, // slots available
    risk: 'high', // high no-show risk detected
    medicineAlerts: 3, // appointments at high risk
    staffGap: 2, // predicted lost slots
    latitude: -26.1076,
    longitude: 28.0567
  },
  {
    id: 2,
    name: 'Rosebank Medical Suites',
    province: 'Gauteng',
    type: 'Primary Care Center',
    predictedPatients: 42,
    capacity: 45,
    risk: 'low',
    medicineAlerts: 0,
    staffGap: 0,
    latitude: -26.1450,
    longitude: 28.0436
  },
  {
    id: 3,
    name: 'Cape Town Specialist Centre',
    province: 'Western Cape',
    type: 'Cardiology Clinic',
    predictedPatients: 18,
    capacity: 22,
    risk: 'medium',
    medicineAlerts: 1,
    staffGap: 1,
    latitude: -33.9249,
    longitude: 18.4241
  },
  {
    id: 4,
    name: 'Pretoria Family Care Suite',
    province: 'Gauteng',
    type: 'Paediatric & Family Care',
    predictedPatients: 31,
    capacity: 32,
    risk: 'low',
    medicineAlerts: 0,
    staffGap: 0,
    latitude: -25.7479,
    longitude: 28.2293
  }
];

const attendanceAlertsData = [
  { name: 'Dr. A. Ndlovu (Cardiology)', riskText: '9:30 AM Appt: 84% No-Show Risk', risk: 'high', clinic: 'Sandton Specialist Medical Centre' },
  { name: 'Dr. M. Venter (Paediatrics)', riskText: '11:15 AM Appt: 61% No-Show Risk', risk: 'medium', clinic: 'Cape Town Specialist Centre' },
  { name: 'Dr. S. Patel (Dermatology)', riskText: '2:00 PM Appt: 78% No-Show Risk', risk: 'high', clinic: 'Sandton Specialist Medical Centre' },
];

const recentActivity = [
  { text: 'High risk of no-show predicted for 9:30 AM slot (Sandton)', time: '5 mins ago', type: 'alert' },
  { text: 'Waitlist auto-fill matched patient for Dr. Ndlovu (11:00 AM)', time: '12 mins ago', type: 'success' },
  { text: 'WhatsApp smart-confirmation received from Mr. Khumalo', time: '23 mins ago', type: 'success' },
  { text: 'Pretoria Suite: 98% overall attendance rate confirmed for today', time: '1 hour ago', type: 'info' },
];

export default function Dashboard() {
  const [selectedClinic, setSelectedClinic] = useState(clinicsData[0]);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border border-amber-200';
      default: return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
  };

  // Simulated Real-time Updates
  const [alerts, setAlerts] = useState(recentActivity);

  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert = {
        text: 'Smart reminder answered: Slot at Rosebank Suite confirmed',
        time: 'Just now',
        type: 'success'
      };
      setAlerts(prev => [newAlert, ...prev.slice(0, 3)]);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/30">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/25">
                <MedicalCrossIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                NoShowIQ
              </span>
            </Link>
            <div className="ml-8 flex items-center gap-2 text-sm border-l border-slate-200 pl-6">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-slate-700 font-semibold">Specialist Practices Registry</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-lg border border-slate-200">
              Demo Credentials: admin / testpass
            </div>
            <Link href="/dashboard/notifications" className="p-2 hover:bg-slate-100 rounded-lg transition relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </Link>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 py-8">

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Scheduled Today</p>
                <div className="text-3xl font-black text-slate-900 mt-2">115</div>
                <p className="text-xs text-slate-500 mt-1">Across 4 private centers</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-semibold">+8%</span>
              <span className="text-slate-500">vs weekly average</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200 rounded-2xl p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-rose-800 font-bold uppercase tracking-wider">Revenue at Risk</p>
                <div className="text-3xl font-black text-rose-900 mt-2">R14,800</div>
                <p className="text-xs text-rose-700 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  3 High-Risk No-Shows
                </p>
              </div>
              <div className="w-12 h-12 bg-rose-200/50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-rose-700" />
              </div>
            </div>
            <button className="w-full mt-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition shadow-sm shadow-rose-600/10">
              Trigger Reminders
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Practitioners Protected</p>
                <div className="text-3xl font-black text-slate-900 mt-2">34</div>
                <p className="text-xs text-slate-500 mt-1">Specialists active</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-semibold">100%</span>
              <span className="text-slate-500">sync status</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Average Attendance Rate</p>
                <div className="text-3xl font-black text-slate-900 mt-2">96.2%</div>
                <p className="text-xs text-slate-500 mt-1">Target: 95.0%</p>
              </div>
              <div className="w-12 h-12 bg-cyan-50 border border-cyan-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '96.2%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Practice Overview Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900">Today's Attendance Overview</h2>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>June 19, 2026</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Practice / Center</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Booked Slots</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">No-Show Risk Status</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Smart Outreach</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clinicsData.map((clinic) => (
                      <tr key={clinic.id} className="border-b border-slate-100 hover:bg-blue-50/30 transition cursor-pointer" onClick={() => setSelectedClinic(clinic)}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-black text-sm">
                              {clinic.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-950 text-sm">{clinic.name}</div>
                              <div className="text-xs text-slate-500">{clinic.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">{clinic.province}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-900">{clinic.predictedPatients} slots filled</div>
                          <div className="text-xs text-slate-500">Max Capacity: {clinic.capacity}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getRiskBadge(clinic.risk)}`}>
                            {clinic.risk === 'high' && '🔴'}
                            {clinic.risk === 'medium' && '🟡'}
                            {clinic.risk === 'low' && '🟢'}
                            <span className="capitalize ml-1">{clinic.risk} Risk</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {clinic.medicineAlerts > 0 ? (
                            <div className="flex items-center gap-1.5 text-rose-600">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs font-bold">{clinic.medicineAlerts} high-risk</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-emerald-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs font-bold">Stable</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {clinic.risk === 'high' && (
                              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-sm">
                                Auto-Fill Queue
                              </button>
                            )}
                            {clinic.medicineAlerts > 0 && (
                              <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1">
                                <Send className="w-3 h-3 text-slate-500" />
                                Send SMS
                              </button>
                            )}
                            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition">
                              <MoreVertical className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Map */}
            <InteractiveMap />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Predictive Revenue Insights */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-amber-900 text-sm uppercase tracking-wider">Predictive Insights</h3>
              </div>
              <div className="bg-white/70 rounded-xl p-4 mb-3 border border-amber-100">
                <div className="font-bold text-rose-700 text-xs uppercase mb-2">🔴 Attendance Alert</div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                  <strong>Sandton Medical Centre</strong> has 3 specialist appointments at 80%+ no-show probability for today (value: R5,800). Smart reminders dispatched.
                </p>
                <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition">
                  Activate Waitlist Auto-Fill
                </button>
              </div>
              <div className="text-xs text-amber-800 font-semibold">
                🔔 Expected peak no-show days: <strong>Mondays (8:00 AM - 10:00 AM)</strong>
              </div>
            </div>

            {/* High-Risk Appointments */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Immediate Risk Log</h3>
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">{attendanceAlertsData.length}</span>
              </div>
              <div className="p-4 space-y-3">
                {attendanceAlertsData.map((med, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${med.risk === 'high' ? 'bg-rose-50/50 border-rose-200' : 'bg-amber-50/50 border-amber-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-xs text-slate-900">{med.name}</div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${med.risk === 'high' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'}`}>
                        {med.risk.toUpperCase()} RISK
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mb-1">{med.riskText}</div>
                    <div className="text-[10px] text-slate-400 mb-3">{med.clinic}</div>
                    <button className="w-full px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition flex items-center justify-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-slate-500" />
                      Propose Reschedule
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Activity Log</h3>
              </div>
              <div className="p-4 space-y-3">
                {alerts.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${activity.type === 'alert' ? 'bg-rose-500' :
                      activity.type === 'success' ? 'bg-emerald-500' :
                        activity.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-800">{activity.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIChatbot />
    </div>
  );
}

