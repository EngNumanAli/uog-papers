'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { UOG_DATA, SEMESTERS, SHIFTS, EXAM_TYPES, YEARS, getDeptsByFaculty, getDegreesForDept } from '@/lib/uog-data'
import { UploadFormData } from '@/lib/types'
import Link from 'next/link'
import {
  GraduationCap, Upload, FileText, CheckCircle, AlertCircle,
  Loader2, ChevronDown, X, ArrowLeft
} from 'lucide-react'

const EMPTY: UploadFormData = {
  course_name:'', course_code:'', faculty:'', department:'',
  degree:'', semester:1, shift:'Morning', exam_type:'Mid Term',
  year: new Date().getFullYear(), teacher_name:'', file: null,
}

export default function UploadPage() {
  const [form,     setForm]     = useState<UploadFormData>(EMPTY)
  const [user,     setUser]     = useState<any>(null)
  const [loading,  setLoading]  = useState(false)
  const [status,   setStatus]   = useState<'idle'|'success'|'error'>('idle')
  const [message,  setMessage]  = useState('')
  const [drag,     setDrag]     = useState(false)
  const [step,     setStep]     = useState('')

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  function set(key: keyof UploadFormData, val: any) {
    setForm(prev => {
      const next = { ...prev, [key]: val }
      if (key === 'faculty')    { next.department = ''; next.degree = '' }
      if (key === 'department') { next.degree = '' }
      return next
    })
  }

  function handleFile(file: File | undefined) {
    if (!file) return
    if (file.type !== 'application/pdf') {
      setMessage('Only PDF files are allowed.'); setStatus('error'); return
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File must be under 5MB.'); setStatus('error'); return
    }
    setForm(prev => ({ ...prev, file }))
    setStatus('idle'); setMessage('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user)      { setMessage('Please sign in to upload.'); setStatus('error'); return }
    if (!form.file) { setMessage('Please select a PDF file.'); setStatus('error'); return }

    setLoading(true); setStatus('idle'); setStep('Preparing upload...')

    try {
      // Use FormData to send to our API route
      // This goes: Mobile → Vercel server → Supabase
      // NO direct mobile → Supabase connection = NO CORS issues
      const formData = new FormData()
      formData.append('file', form.file)
      formData.append('metadata', JSON.stringify({
        course_name:  form.course_name,
        course_code:  form.course_code,
        faculty:      form.faculty,
        department:   form.department,
        degree:       form.degree,
        semester:     form.semester,
        shift:        form.shift,
        exam_type:    form.exam_type,
        year:         form.year,
        teacher_name: form.teacher_name,
        uploaded_by:  user.email,
      }))

      setStep('Uploading to server...')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body:   formData,
        // NO Content-Type header — browser sets it automatically with boundary
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      setStep('')
      setStatus('success')
      setMessage('Paper uploaded successfully! It will appear after admin approval.')
      setForm(EMPTY)

    } catch (err: any) {
      setStep('')
      setStatus('error')
      setMessage(err.message || 'Upload failed. Please try again.')
    }

    setLoading(false)
  }

  const depts   = form.faculty    ? getDeptsByFaculty(form.faculty)   : []
  const degrees = form.department ? getDegreesForDept(form.department) : []

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="card p-10 text-center max-w-md w-full">
          <GraduationCap size={48} className="text-brand-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign in to Upload</h2>
          <p className="text-slate-400 text-sm mb-6">
            You need to sign in with your email to upload past papers.
          </p>
          <Link href="/login" className="btn-primary w-full flex items-center justify-center gap-2">
            Sign In to Upload
          </Link>
          <Link href="/browse" className="block mt-3 text-sm text-slate-500 hover:text-brand-400 transition-colors">
            ← Browse papers without signing in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-16">

      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/browse" className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold text-white">Upload Past Paper</h1>
            <p className="text-xs text-slate-500">Signed in as {user.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {status === 'success' && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 mb-6 flex items-start gap-3">
            <CheckCircle size={20} className="text-green-400 shrink-0 mt-0.5" />
            <p className="text-green-300 text-sm">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{message}</p>
          </div>
        )}

        {step && (
          <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Loader2 size={18} className="animate-spin text-sky-400" />
            <p className="text-sky-300 text-sm font-semibold">{step}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="label">PDF File *</label>
            <div
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
              className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                          transition-all duration-200
                          ${drag      ? 'border-brand-400 bg-brand-400/5' : ''}
                          ${form.file ? 'border-brand-500 bg-brand-500/5' : 'border-slate-700 hover:border-slate-500'}`}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input id="file-input" type="file" accept=".pdf,application/pdf"
                     className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
              {form.file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText size={24} className="text-brand-400" />
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{form.file.name}</p>
                    <p className="text-slate-400 text-xs">{(form.file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button type="button"
                          onClick={e => { e.stopPropagation(); setForm(p => ({...p,file:null})) }}
                          className="ml-2 text-slate-500 hover:text-red-400 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={32} className="text-slate-600 mx-auto mb-3" />
                  <p className="text-white text-sm font-medium">Tap to select PDF</p>
                  <p className="text-slate-500 text-xs mt-1">PDF only · Max 5MB</p>
                </>
              )}
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="text-white font-semibold text-sm">Course Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Course Name *</label>
                <input required value={form.course_name}
                       onChange={e => set('course_name', e.target.value)}
                       className="input" placeholder="e.g. Data Structures" />
              </div>
              <div>
                <label className="label">Course Code</label>
                <input value={form.course_code}
                       onChange={e => set('course_code', e.target.value)}
                       className="input" placeholder="e.g. CS-301" />
              </div>
              <div>
                <label className="label">Teacher Name</label>
                <input value={form.teacher_name}
                       onChange={e => set('teacher_name', e.target.value)}
                       className="input" placeholder="e.g. Sir Usman" />
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="text-white font-semibold text-sm">Academic Details</h3>
            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="label">Faculty *</label>
                <div className="relative">
                  <select required className="select pr-8" value={form.faculty}
                          onChange={e => set('faculty', e.target.value)}>
                    <option value="">Select Faculty</option>
                    {UOG_DATA.faculties.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="label">Department *</label>
                <div className="relative">
                  <select required className="select pr-8" value={form.department}
                          onChange={e => set('department', e.target.value)}
                          disabled={!form.faculty}>
                    <option value="">Select Department</option>
                    {depts.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="label">Degree Program *</label>
                <div className="relative">
                  <select required className="select pr-8" value={form.degree}
                          onChange={e => set('degree', e.target.value)}
                          disabled={!form.department}>
                    <option value="">Select Degree</option>
                    {degrees.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="label">Semester *</label>
                <div className="relative">
                  <select required className="select pr-8" value={form.semester}
                          onChange={e => set('semester', Number(e.target.value))}>
                    {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="label">Shift *</label>
                <div className="relative">
                  <select required className="select pr-8" value={form.shift}
                          onChange={e => set('shift', e.target.value)}>
                    {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="label">Exam Type *</label>
                <div className="relative">
                  <select required className="select pr-8" value={form.exam_type}
                          onChange={e => set('exam_type', e.target.value)}>
                    {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="label">Year *</label>
                <div className="relative">
                  <select required className="select pr-8" value={form.year}
                          onChange={e => set('year', Number(e.target.value))}>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>

          <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
            {loading
              ? <><Loader2 size={18} className="animate-spin" /> Uploading...</>
              : <><Upload size={18} /> Submit Paper for Review</>
            }
          </button>

          <p className="text-center text-slate-600 text-xs">
            Papers are reviewed by admin before going live — usually within 24 hours.
          </p>
        </form>
      </div>
    </div>
  )
}
