'use client';

import { useState, useEffect } from 'react';
import {
  Activity, MapPin, Pill, Users, TrendingUp, AlertCircle,
  CheckCircle, Clock, Send, MoreVertical, Heart, Bell, Settings,
  ChevronDown, Calendar, Truck, Search, Menu, X, Filter, Download, Plus, ChevronRight
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

// Mock data for SA rural clinics
const clinicsData = [
  {
    id: 1,
    name: 'Vuwani Community Clinic',
    province: 'Limpopo',
    type: 'Primary Healthcare',
    predictedPatients: 287,
    capacity: 250,
    risk: 'high',
    medicineAlerts: 3,
    staffGap: 2,
    latitude: -22.9491,
    longitude: 30.4256
  },
  {
    id: 2,
    name: 'Lusikisiki CHC',
    province: 'Eastern Cape',
    type: 'Community Health Centre',
    predictedPatients: 156,
    capacity: 200,
    risk: 'low',
    medicineAlerts: 0,
    staffGap: 0,
    latitude: -31.3636,
    longitude: 29.5819
  },
  {
    id: 3,
    name: 'Nquthu District Clinic',
    province: 'KwaZulu-Natal',
    type: 'Primary Healthcare',
    predictedPatients: 198,
    capacity: 180,
    risk: 'medium',
    medicineAlerts: 1,
    staffGap: 1,
    latitude: -28.2167,
    longitude: 30.3167
  },
  {
    id: 4,
    name: 'Makhado Mobile Unit',
    province: 'Limpopo',
    type: 'Mobile Clinic',
    predictedPatients: 134,
    capacity: 150,
    risk: 'low',
    medicineAlerts: 0,
    staffGap: 0,
    latitude: -23.0494,
    longitude: 29.9090
  }
];

const medicineAlertsData = [
  { name: 'ARV (HIV Treatment)', daysLeft: 4, risk: 'high', clinic: 'Vuwani Community Clinic' },
  { name: 'TB Medication', daysLeft: 11, risk: 'medium', clinic: 'Nquthu District Clinic' },
  { name: 'Paracetamol', daysLeft: 3, risk: 'high', clinic: 'Vuwani Community Clinic' },
];

const recentActivity = [
  { text: 'High patient volume predicted at Vuwani Clinic', time: '5 mins ago', type: 'alert' },
  { text: 'Mobile clinic route optimized for Makhado', time: '12 mins ago', type: 'success' },
  { text: 'ARV stock alert triggered', time: '23 mins ago', type: 'warning' },
  { text: 'Staff allocation updated for Lusikisiki CHC', time: '1 hour ago', type: 'info' },
];

export default function Dashboard() {
  const [selectedClinic, setSelectedClinic] = useState(clinicsData[0]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-50 text-red-700 border border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      default: return 'bg-green-50 text-green-700 border border-green-200';
    }
  };

  // Simulated Real-time Updates
  const [alerts, setAlerts] = useState(recentActivity);

  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert = {
        text: 'New appointment booked at Vuwani Clinic',
        time: 'Just now',
        type: 'success'
      };
      // Add new alert and keep only latest 5
      setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
    }, 45000); // New alert every 45 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-green-50">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                HealthBridge AI
              </span>
            </Link>
            <div className="ml-8 flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700 font-medium">Clinic Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard/notifications" className="p-2 hover:bg-gray-100 rounded-lg transition relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 py-8">

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Daily Patient Volume</p>
                <div className="text-3xl font-bold text-gray-900 mt-2">775</div>
                <p className="text-xs text-gray-500 mt-1">Across 4 clinics</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">+12%</span>
              <span className="text-gray-500">vs yesterday</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-red-700 font-medium">Medicine Stock Alerts</p>
                <div className="text-3xl font-bold text-red-900 mt-2">4</div>
                <p className="text-xs text-red-700 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Action Required
                </p>
              </div>
              <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center">
                <Pill className="w-6 h-6 text-red-700" />
              </div>
            </div>
            <button className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
              View Alerts
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Clinics Served</p>
                <div className="text-3xl font-bold text-gray-900 mt-2">127</div>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">98%</span>
              <span className="text-gray-500">uptime</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Resource Allocation</p>
                <div className="text-3xl font-bold text-gray-900 mt-2">94%</div>
                <p className="text-xs text-gray-500 mt-1">Target: 95%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Clinic Overview Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Today's Clinic Overview</h2>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">February 6, 2026</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Clinic</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Province</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Predicted Volume</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Risk Level</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clinicsData.map((clinic) => (
                      <tr key={clinic.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition cursor-pointer" onClick={() => setSelectedClinic(clinic)}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {clinic.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{clinic.name}</div>
                              <div className="text-xs text-gray-500">{clinic.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{clinic.province}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">{clinic.predictedPatients} patients</div>
                          <div className="text-xs text-gray-500">Capacity: {clinic.capacity}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadge(clinic.risk)}`}>
                            {clinic.risk === 'high' && '🔴'}
                            {clinic.risk === 'medium' && '🟡'}
                            {clinic.risk === 'low' && '🟢'}
                            {clinic.risk} Risk
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {clinic.medicineAlerts > 0 ? (
                            <div className="flex items-center gap-1 text-orange-600">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">{clinic.medicineAlerts} alerts</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">All good</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {clinic.risk === 'high' && (
                              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition">
                                Allocate Staff
                              </button>
                            )}
                            {clinic.medicineAlerts > 0 && (
                              <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition flex items-center gap-1">
                                <Send className="w-3 h-3" />
                                Order Meds
                              </button>
                            )}
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
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

            {/* Optimization Insights */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-orange-900">Optimization Insights</h3>
              </div>
              <div className="bg-white/60 rounded-xl p-4 mb-3">
                <div className="font-semibold text-orange-900 text-sm mb-2">🔴 High Risk Detected</div>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Vuwani Community Clinic</strong> has a predicted volume of 287 patients exceeding capacity (250).
                  Consider adding 2 additional staff.
                </p>
                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition">
                  Apply Optimization
                </button>
              </div>
              <div className="text-xs text-orange-700">
                Next pension week: <strong>Feb 12-14</strong> (High surge expected)
              </div>
            </div>

            {/* Medicine Alerts */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Medicine Stock Alerts</h3>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">{medicineAlertsData.length}</span>
              </div>
              <div className="p-4 space-y-3">
                {medicineAlertsData.map((med, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${med.risk === 'high' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-sm text-gray-900">{med.name}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${med.risk === 'high' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'}`}>
                        {med.daysLeft} days left
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-3">{med.clinic}</div>
                    <button className="w-full px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-1">
                      <Truck className="w-3 h-3" />
                      Order Restock
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-4 space-y-3">
                {alerts.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${activity.type === 'alert' ? 'bg-red-500' :
                      activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-90 animate-pulse-once">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
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
