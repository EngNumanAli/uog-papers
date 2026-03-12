'use client'
import Link from 'next/link'
import { BookOpen, Upload, Search, Shield, Users, FileText, ArrowRight, GraduationCap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">

      {/* ── Nav ── */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-none">UOG Papers</p>
              <p className="text-xs text-slate-500 leading-none mt-0.5">Hafiz Hayat Campus</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/browse" className="btn-ghost text-sm py-2">Browse Papers</Link>
            <Link href="/login"  className="btn-primary text-sm py-2">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                        bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30
                          rounded-full px-4 py-1.5 text-brand-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Free for all UOG Students
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-black text-white
                         leading-none tracking-tight mb-6">
            Past Papers
            <span className="block text-brand-400">Made Simple</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Find, download and share past exam papers for every department,
            every semester at Hafiz Hayat Campus. Built by students, for students.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/browse"
                  className="btn-primary flex items-center gap-2 text-base px-8 py-3">
              <Search size={18} />
              Browse Papers
              <ArrowRight size={16} />
            </Link>
            <Link href="/upload"
                  className="btn-ghost flex items-center gap-2 text-base px-8 py-3">
              <Upload size={18} />
              Upload a Paper
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Departments',  value: '15+', icon: BookOpen },
            { label: 'Students',     value: '10K+',icon: Users },
            { label: 'Papers',       value: '500+',icon: FileText },
            { label: 'Free Forever', value: '100%',icon: Shield },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-6 text-center">
              <Icon size={24} className="text-brand-400 mx-auto mb-3" />
              <p className="font-display text-3xl font-black text-white">{value}</p>
              <p className="text-slate-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="font-display text-3xl font-bold text-white text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step:'01', title:'Browse & Filter',   desc:'Select your faculty, department, semester and exam type to find exactly what you need.',        icon: Search },
            { step:'02', title:'Download Free',     desc:'All papers are completely free. No signup required to download and study.',                       icon: FileText },
            { step:'03', title:'Upload & Share',    desc:'Have a paper not in the system? Sign in with your UOG email and upload it for everyone.',          icon: Upload },
          ].map(({ step, title, desc, icon: Icon }) => (
            <div key={step} className="card p-6 relative overflow-hidden group hover:border-brand-500/50 transition-colors">
              <span className="absolute top-4 right-4 font-display text-5xl font-black text-slate-800 group-hover:text-slate-700 transition-colors">
                {step}
              </span>
              <div className="w-10 h-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4">
                <Icon size={20} className="text-brand-400" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 py-8 px-4 text-center">
        <p className="text-slate-600 text-sm">
          Built for University of Gujrat — Hafiz Hayat Campus students 🎓
        </p>
      </footer>

    </div>
  )
}
