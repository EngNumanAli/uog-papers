'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2, UserPlus, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [mode,     setMode]     = useState<'login' | 'signup'>('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    if (mode === 'signup') {
      // ── Register new account ──────────────────────────────────────────
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        // Auto login after signup
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
        if (!loginError) router.push('/upload')
        else setError(loginError.message)
      }

    } else {
      // ── Login existing account ────────────────────────────────────────
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Wrong email or password. Please try again.')
      } else {
        router.push('/upload')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-black text-white">UOG Papers</h1>
          <p className="text-slate-500 mt-1 text-sm">Hafiz Hayat Campus</p>
        </div>

        <div className="card p-8">

          {/* Toggle Login / Signup */}
          <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all
                ${mode === 'login'
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError('') }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all
                ${mode === 'signup'
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-400 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-9"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'}
                  className="input pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Please wait...</>
              ) : mode === 'login' ? (
                <><LogIn size={16} /> Sign In</>
              ) : (
                <><UserPlus size={16} /> Create Account</>
              )}
            </button>

          </form>

        </div>

        <p className="text-center text-slate-600 text-sm mt-6">
          Just want to browse?{' '}
          <Link href="/browse" className="text-brand-400 hover:underline">
            No login required →
          </Link>
        </p>

      </div>
    </div>
  )
}
