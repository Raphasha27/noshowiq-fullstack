"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, TrendingUp, Users, Activity, ExternalLink, ArrowRight, MessageSquare, ChevronRight } from "lucide-react"

export default function NoShowIQLanding() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#060a11] text-white selection:bg-[#00f0ff] selection:text-black overflow-hidden font-sans">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00f0ff] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#00f0ff] opacity-[0.02] blur-[150px] rounded-full pointer-events-none" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik02MCAwTDAgMEwwIDYwIi8+PC9nPjwvc3ZnPg==')] opacity-[0.2] pointer-events-none mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-[#060a11]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#0080ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Activity className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tight">NoShow<span className="text-[#00f0ff]">IQ</span></span>
          </div>
          
          <a 
            href="https://kirov-dynamics-technology.github.io/kirov-dynamics/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm font-medium"
          >
            Kirov Dynamics Hub
            <ExternalLink className="w-4 h-4 text-[#00f0ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
        {/* Hero Section */}
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff] text-sm font-semibold mb-8 uppercase tracking-wider"
          >
            <ShieldCheck className="w-4 h-4" />
            Predictive Intelligence for Private Medical Practices
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          >
            Stop Lost Revenue from <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0080ff]">
              Patient No-Shows & Cancellations
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg lg:text-xl text-gray-400 mb-12 max-w-3xl leading-relaxed"
          >
            NoShowIQ uses advanced machine learning models to analyze patient history, weather, and schedule density. We predict appointment attendance, automate reminders, and fill cancellations instantly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-6"
          >
            <a 
              href="https://kirov-dynamics-technology.github.io/kirov-dynamics/"
              target="_blank"
              rel="noopener noreferrer" 
              className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#00f0ff] to-[#0080ff] px-8 font-medium text-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
            >
              <span className="mr-2 font-bold text-lg">Explore Live Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a 
              href="https://kirov-dynamics-technology.github.io/kirov-dynamics/"
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-transparent px-8 font-medium text-white transition-all hover:bg-white/5 hover:border-white/40"
            >
              Learn More
            </a>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { value: "94.8%", label: "ML Prediction Accuracy" },
            { value: "$ R35K+", label: "Monthly Revenue Saved" },
            { value: "96.2%", label: "Average Attendance Rate" },
            { value: "350+", label: "Private Practices Active" }
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-[#00f0ff]/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2 relative z-10">{stat.value}</div>
              <div className="text-sm text-gray-400 font-medium relative z-10">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features Section */}
        <div className="mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 max-w-2xl"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Designed Specifically for <span className="text-[#00f0ff]">High-Performing Clinics</span></h2>
            <p className="text-gray-400 text-lg">Custom-built workflows that protect practitioner hours and secure practice profitability.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Activity className="w-6 h-6" />}
              title="No-Show Probability Index"
              desc="Pre-evaluates every booking based on past attendance, age, distance, and booking lead-time to output an exact risk profile."
              delay={0.1}
            />
            <FeatureCard 
              icon={<MessageSquare className="w-6 h-6" />}
              title="Smart Conversational Reminders"
              desc="Triggers multi-lingual, personalized WhatsApp/SMS alerts. High-risk patients receive interactive confirm/reschedule prompts."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6" />}
              title="Revenue Recovery Waitlist"
              desc="Automatically texts next-in-line patients when a cancellation occurs, filling gaps in your schedule in seconds."
              delay={0.3}
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6" />}
              title="Practitioner Dashboard"
              desc="Deep insights into clinic efficiency, lost revenue metrics, and patient attendance behavior across all departments."
              delay={0.4}
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#060a11]/90 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="font-bold text-white">NoShowIQ</span> © 2026. Built by Kirov Dynamics.
          </div>
          <a 
            href="https://kirov-dynamics-technology.github.io/kirov-dynamics/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#00f0ff] hover:text-white transition-colors"
          >
            Return to Portfolio Hub <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-[#00f0ff]/50 transition-all group"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff] mb-6 group-hover:scale-110 group-hover:bg-[#00f0ff] group-hover:text-black transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#00f0ff] transition-colors">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">
        {desc}
      </p>
    </motion.div>
  )
}
