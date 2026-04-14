// 'use client'
// import { useState, useEffect } from 'react'
// import { createClient } from '@/lib/supabase'
// import { UOG_DATA, SEMESTERS, SHIFTS, EXAM_TYPES, YEARS, getDeptsByFaculty, getDegreesForDept } from '@/lib/uog-data'
// import { UploadFormData } from '@/lib/types'
// import Link from 'next/link'
// import {
//   GraduationCap, Upload, FileText, CheckCircle, AlertCircle,
//   Loader2, ChevronDown, X, ArrowLeft
// } from 'lucide-react'

// const EMPTY: UploadFormData = {
//   course_name:'', course_code:'', faculty:'', department:'',
//   degree:'', semester:1, shift:'Morning', exam_type:'Mid Term',
//   year: new Date().getFullYear(), teacher_name:'', file: null,
// }

// export default function UploadPage() {
//   const [form,     setForm]     = useState<UploadFormData>(EMPTY)
//   const [user,     setUser]     = useState<any>(null)
//   const [loading,  setLoading]  = useState(false)
//   const [status,   setStatus]   = useState<'idle'|'success'|'error'>('idle')
//   const [message,  setMessage]  = useState('')
//   const [drag,     setDrag]     = useState(false)
//   const [step,     setStep]     = useState('')

//   useEffect(() => {
//     createClient().auth.getUser().then(({ data }) => setUser(data.user))
//   }, [])

//   function set(key: keyof UploadFormData, val: any) {
//     setForm(prev => {
//       const next = { ...prev, [key]: val }
//       if (key === 'faculty')    { next.department = ''; next.degree = '' }
//       if (key === 'department') { next.degree = '' }
//       return next
//     })
//   }

//   function handleFile(file: File | undefined) {
//     if (!file) return
//     if (file.type !== 'application/pdf') {
//       setMessage('Only PDF files are allowed.'); setStatus('error'); return
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       setMessage('File must be under 5MB.'); setStatus('error'); return
//     }
//     setForm(prev => ({ ...prev, file }))
//     setStatus('idle'); setMessage('')
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     if (!user)      { setMessage('Please sign in to upload.'); setStatus('error'); return }
//     if (!form.file) { setMessage('Please select a PDF file.'); setStatus('error'); return }

//     setLoading(true); setStatus('idle'); setStep('Preparing upload...')

//     try {
//       const formData = new FormData()
//       formData.append('file', form.file)
//       formData.append('metadata', JSON.stringify({
//         course_name:  form.course_name,
//         course_code:  form.course_code,
//         faculty:      form.faculty,
//         department:   form.department,
//         degree:       form.degree,
//         semester:     form.semester,
//         shift:        form.shift,
//         exam_type:    form.exam_type,
//         year:         form.year,
//         teacher_name: form.teacher_name,
//         uploaded_by:  user.email,
//       }))

//       setStep('Uploading to server...')

//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body:   formData,
//       })

//       const result = await response.json()

//       if (!response.ok) {
//         throw new Error(result.error || 'Upload failed')
//       }

//       setStep('')
//       setStatus('success')
//       setMessage('Paper uploaded successfully! It will appear after admin approval.')
//       setForm(EMPTY)

//     } catch (err: any) {
//       setStep('')
//       setStatus('error')
//       setMessage(err.message || 'Upload failed. Please try again.')
//     }

//     setLoading(false)
//   }

//   const depts   = form.faculty    ? getDeptsByFaculty(form.faculty)   : []
//   const degrees = form.department ? getDegreesForDept(form.department) : []

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
//         <div className="card p-10 text-center max-w-md w-full">
//           <GraduationCap size={48} className="text-brand-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-white mb-2">Sign in to Upload</h2>
//           <p className="text-slate-400 text-sm mb-6">
//             You need to sign in with your email to upload past papers.
//           </p>
//           <Link href="/login" className="btn-primary w-full flex items-center justify-center gap-2">
//             Sign In to Upload
//           </Link>
//           <Link href="/browse" className="block mt-3 text-sm text-slate-500 hover:text-brand-400 transition-colors">
//             ← Browse papers without signing in
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 pb-16">

//       <div className="bg-slate-900 border-b border-slate-800">
//         <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
//           <Link href="/browse" className="text-slate-500 hover:text-white transition-colors">
//             <ArrowLeft size={20} />
//           </Link>
//           <div>
//             <h1 className="font-display text-xl font-bold text-white">Upload Past Paper</h1>
//             <p className="text-xs text-slate-500">Signed in as {user.email}</p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-3xl mx-auto px-4 py-8">

//         {status === 'success' && (
//           <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 mb-6 flex items-start gap-3">
//             <CheckCircle size={20} className="text-green-400 shrink-0 mt-0.5" />
//             <p className="text-green-300 text-sm">{message}</p>
//           </div>
//         )}

//         {status === 'error' && (
//           <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-6 flex items-start gap-3">
//             <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
//             <p className="text-red-300 text-sm">{message}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">

//           <div>
//             <label className="label">PDF File *</label>
//             <div
//               onDragOver={e => { e.preventDefault(); setDrag(true) }}
//               onDragLeave={() => setDrag(false)}
//               onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
//               className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
//                           transition-all duration-200
//                           ${drag      ? 'border-brand-400 bg-brand-400/5' : ''}
//                           ${form.file ? 'border-brand-500 bg-brand-500/5' : 'border-slate-700 hover:border-slate-500'}`}
//               onClick={() => document.getElementById('file-input')?.click()}
//             >
//               <input id="file-input" type="file" accept=".pdf,application/pdf"
//                      className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
//               {form.file ? (
//                 <div className="flex items-center justify-center gap-3">
//                   <FileText size={24} className="text-brand-400" />
//                   <div className="text-left">
//                     <p className="text-white text-sm font-medium">{form.file.name}</p>
//                     <p className="text-slate-400 text-xs">{(form.file.size / 1024).toFixed(0)} KB</p>
//                   </div>
//                   <button type="button"
//                           onClick={e => { e.stopPropagation(); setForm(p => ({...p,file:null})) }}
//                           className="ml-2 text-slate-500 hover:text-red-400 transition-colors">
//                     <X size={16} />
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   <Upload size={32} className="text-slate-600 mx-auto mb-3" />
//                   <p className="text-white text-sm font-medium">Tap to select PDF</p>
//                   <p className="text-slate-500 text-xs mt-1">PDF only · Max 5MB</p>
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="card p-6 space-y-4">
//             <h3 className="text-white font-semibold text-sm">Course Information</h3>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <label className="label">Course Name *</label>
//                 <input required value={form.course_name}
//                        onChange={e => set('course_name', e.target.value)}
//                        className="input" placeholder="e.g. Data Structures" />
//               </div>
//               <div>
//                 <label className="label">Course Code</label>
//                 <input value={form.course_code}
//                        onChange={e => set('course_code', e.target.value)}
//                        className="input" placeholder="e.g. CS-301" />
//               </div>
//               <div>
//                 <label className="label">Teacher Name</label>
//                 <input value={form.teacher_name}
//                        onChange={e => set('teacher_name', e.target.value)}
//                        className="input" placeholder="e.g. Sir Usman" />
//               </div>
//             </div>
//           </div>

//           <div className="card p-6 space-y-4">
//             <h3 className="text-white font-semibold text-sm">Academic Details</h3>
//             <div className="grid md:grid-cols-2 gap-4">

//               <div>
//                 <label className="label">Faculty *</label>
//                 <div className="relative">
//                   <select required className="select pr-8" value={form.faculty}
//                           onChange={e => set('faculty', e.target.value)}>
//                     <option value="">Select Faculty</option>
//                     {UOG_DATA.faculties.map(f => (
//                       <option key={f.id} value={f.id}>{f.name}</option>
//                     ))}
//                   </select>
//                   <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
//                 </div>
//               </div>

//               <div>
//                 <label className="label">Department *</label>
//                 <div className="relative">
//                   <select required className="select pr-8" value={form.department}
//                           onChange={e => set('department', e.target.value)}
//                           disabled={!form.faculty}>
//                     <option value="">Select Department</option>
//                     {depts.map(d => (
//                       <option key={d.id} value={d.id}>{d.name}</option>
//                     ))}
//                   </select>
//                   <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
//                 </div>
//               </div>

//               <div>
//                 <label className="label">Degree Program *</label>
//                 <div className="relative">
//                   <select required className="select pr-8" value={form.degree}
//                           onChange={e => set('degree', e.target.value)}
//                           disabled={!form.department}>
//                     <option value="">Select Degree</option>
//                     {degrees.map(d => (
//                       <option key={d} value={d}>{d}</option>
//                     ))}
//                   </select>
//                   <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
//                 </div>
//               </div>

//               <div>
//                 <label className="label">Semester *</label>
//                 <div className="relative">
//                   <select required className="select pr-8" value={form.semester}
//                           onChange={e => set('semester', Number(e.target.value))}>
//                     {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
//                   </select>
//                   <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
//                 </div>
//               </div>

//               <div>
//                 <label className="label">Shift *</label>
//                 <div className="relative">
//                   <select required className="select pr-8" value={form.shift}
//                           onChange={e => set('shift', e.target.value)}>
//                     {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
//                   </select>
//                   <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
//                 </div>
//               </div>

//               <div>
//                 <label className="label">Exam Type *</label>
//                 <div className="relative">
//                   <select required className="select pr-8" value={form.exam_type}
//                           onChange={e => set('exam_type', e.target.value)}>
//                     {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//                   </select>
//                   <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
//                 </div>
//               </div>

//               <div>
//                 <label className="label">Year *</label>
//                 <div className="relative">
//                   <select required className="select pr-8" value={form.year}
//                           onChange={e => set('year', Number(e.target.value))}>
//                     {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
//                   </select>
//                   <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
//                 </div>
//               </div>

//             </div>
//           </div>

//           <button type="submit" disabled={loading}
//                   className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
//             {loading
//               ? <><Loader2 size={18} className="animate-spin" /> Uploading...</>
//               : <><Upload size={18} /> Submit Paper for Review</>
//             }
//           </button>

//           <p className="text-center text-slate-600 text-xs">
//             Papers are reviewed by admin before going live — usually within 24 hours.
//           </p>
//         </form>
//       </div>
//     </div>
//   )
// }
'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { UOG_DATA, SEMESTERS, SHIFTS, EXAM_TYPES, YEARS, getDeptsByFaculty, getDegreesForDept } from '@/lib/uog-data'
import { UploadFormData } from '@/lib/types'
import Link from 'next/link'
import {
  GraduationCap, Upload, FileText, CheckCircle, AlertCircle,
  Loader2, ChevronDown, X, ArrowLeft, Camera, Image as ImageIcon,
  RotateCcw, FlipHorizontal, ZoomIn, Trash2, Plus
} from 'lucide-react'

const EMPTY: UploadFormData = {
  course_name:'', course_code:'', faculty:'', department:'',
  degree:'', semester:1, shift:'Morning', exam_type:'Mid Term',
  year: new Date().getFullYear(), teacher_name:'', file: null,
}

type CapturedImage = {
  id: string
  file: File
  preview: string
  name: string
}

type UploadMode = 'pdf' | 'images'

export default function UploadPage() {
  const [form,           setForm]           = useState<UploadFormData>(EMPTY)
  const [user,           setUser]           = useState<any>(null)
  const [loading,        setLoading]        = useState(false)
  const [status,         setStatus]         = useState<'idle'|'success'|'error'>('idle')
  const [message,        setMessage]        = useState('')
  const [drag,           setDrag]           = useState(false)
  const [step,           setStep]           = useState('')
  const [uploadMode,     setUploadMode]     = useState<UploadMode>('pdf')
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([])
  const [cameraOpen,     setCameraOpen]     = useState(false)
  const [cameraError,    setCameraError]    = useState('')
  const [facingMode,     setFacingMode]     = useState<'environment'|'user'>('environment')
  const [imageDrag,      setImageDrag]      = useState(false)
  const [previewImg,     setPreviewImg]     = useState<string|null>(null)

  const videoRef    = useRef<HTMLVideoElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const streamRef   = useRef<MediaStream|null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  // Stop camera on unmount
  useEffect(() => {
    return () => { stopCamera() }
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

  // ── Camera helpers ─────────────────────────────────────────────

  async function startCamera(facing: 'environment'|'user' = facingMode) {
    setCameraError('')
    try {
      if (streamRef.current) stopCamera()
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraOpen(true)
    } catch (err: any) {
      setCameraError('Camera access denied. Please allow camera permission and try again.')
      setCameraOpen(false)
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraOpen(false)
  }

  async function flipCamera() {
    const next = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(next)
    await startCamera(next)
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return
    const video  = videoRef.current
    const canvas = canvasRef.current
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      if (!blob) return
      const id   = Date.now().toString()
      const name = `photo_${id}.jpg`
      const file = new File([blob], name, { type: 'image/jpeg' })
      const preview = URL.createObjectURL(blob)
      setCapturedImages(prev => [...prev, { id, file, preview, name }])
    }, 'image/jpeg', 0.92)
  }

  function handleImageFiles(files: FileList | null) {
    if (!files) return
    const allowed = ['image/jpeg','image/png','image/webp','image/heic']
    Array.from(files).forEach(file => {
      if (!allowed.includes(file.type)) return
      if (file.size > 10 * 1024 * 1024) return
      const id      = Date.now().toString() + Math.random()
      const preview = URL.createObjectURL(file)
      setCapturedImages(prev => [...prev, { id, file, preview, name: file.name }])
    })
  }

  function removeImage(id: string) {
    setCapturedImages(prev => {
      const img = prev.find(i => i.id === id)
      if (img) URL.revokeObjectURL(img.preview)
      return prev.filter(i => i.id !== id)
    })
  }

  // ── Submit ─────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) { setMessage('Please sign in to upload.'); setStatus('error'); return }

    if (uploadMode === 'pdf' && !form.file) {
      setMessage('Please select a PDF file.'); setStatus('error'); return
    }
    if (uploadMode === 'images' && capturedImages.length === 0) {
      setMessage('Please capture or select at least one image.'); setStatus('error'); return
    }

    setLoading(true); setStatus('idle')

    try {
      const metadata = JSON.stringify({
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
        upload_type:  uploadMode,
      })

      if (uploadMode === 'pdf') {
        setStep('Uploading PDF...')
        const formData = new FormData()
        formData.append('file', form.file!)
        formData.append('metadata', metadata)
        const res    = await fetch('/api/upload', { method: 'POST', body: formData })
        const result = await res.json()
        if (!res.ok) throw new Error(result.error || 'Upload failed')

      } else {
        // Upload each image
        for (let i = 0; i < capturedImages.length; i++) {
          setStep(`Uploading image ${i + 1} of ${capturedImages.length}...`)
          const formData = new FormData()
          formData.append('file', capturedImages[i].file)
          formData.append('metadata', metadata)
          const res    = await fetch('/api/upload', { method: 'POST', body: formData })
          const result = await res.json()
          if (!res.ok) throw new Error(result.error || `Failed to upload image ${i + 1}`)
        }
      }

      setStep('')
      setStatus('success')
      setMessage('Paper uploaded successfully! It will appear after admin approval.')
      setForm(EMPTY)
      setCapturedImages([])
      stopCamera()

    } catch (err: any) {
      setStep('')
      setStatus('error')
      setMessage(err.message || 'Upload failed. Please try again.')
    }

    setLoading(false)
  }

  const depts   = form.faculty    ? getDeptsByFaculty(form.faculty)   : []
  const degrees = form.department ? getDegreesForDept(form.department) : []

  // ── Not signed in ──────────────────────────────────────────────

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

  // ── Main UI ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 pb-16">

      {/* Hidden canvas for camera capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Image preview modal */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewImg(null)}
        >
          <img src={previewImg} alt="Preview" className="max-w-full max-h-full rounded-xl object-contain" />
          <button
            onClick={() => setPreviewImg(null)}
            className="absolute top-4 right-4 text-white bg-slate-800 rounded-full p-2 hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Header */}
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

        {/* Status messages */}
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

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Upload Mode Toggle ── */}
          <div>
            <label className="label mb-2">Upload Type *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUploadMode('pdf')}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium
                  ${uploadMode === 'pdf'
                    ? 'border-brand-500 bg-brand-500/10 text-brand-300'
                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500'}`}
              >
                <FileText size={18} />
                PDF File
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('images')}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium
                  ${uploadMode === 'images'
                    ? 'border-brand-500 bg-brand-500/10 text-brand-300'
                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500'}`}
              >
                <Camera size={18} />
                Photos / Camera
              </button>
            </div>
          </div>

          {/* ── PDF Upload ── */}
          {uploadMode === 'pdf' && (
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
          )}

          {/* ── Image / Camera Upload ── */}
          {uploadMode === 'images' && (
            <div className="space-y-4">
              <label className="label">Paper Photos *</label>

              {/* Camera viewfinder */}
              {cameraOpen && (
                <div className="relative rounded-xl overflow-hidden bg-black border border-slate-700">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full max-h-72 object-cover"
                  />
                  {/* Camera overlay controls */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="text-white/70 hover:text-white bg-white/10 rounded-full p-2 transition-colors"
                    >
                      <X size={20} />
                    </button>
                    {/* Shutter */}
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="w-16 h-16 rounded-full bg-white border-4 border-brand-400 hover:bg-brand-100
                                 active:scale-95 transition-all shadow-lg shadow-brand-400/30 flex items-center justify-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-white" />
                    </button>
                    <button
                      type="button"
                      onClick={flipCamera}
                      className="text-white/70 hover:text-white bg-white/10 rounded-full p-2 transition-colors"
                    >
                      <FlipHorizontal size={20} />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      LIVE
                    </span>
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-xs flex items-start gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  {cameraError}
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                {!cameraOpen ? (
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="flex items-center justify-center gap-2 p-3.5 rounded-xl
                               bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium
                               transition-colors active:scale-95"
                  >
                    <Camera size={18} />
                    Open Camera
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex items-center justify-center gap-2 p-3.5 rounded-xl
                               bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium
                               transition-colors active:scale-95"
                  >
                    <Camera size={18} />
                    Capture Photo
                  </button>
                )}
                <label
                  className="flex items-center justify-center gap-2 p-3.5 rounded-xl
                             border-2 border-dashed border-slate-600 hover:border-slate-400
                             text-slate-400 hover:text-white text-sm font-medium
                             transition-colors cursor-pointer active:scale-95"
                  onDragOver={e => { e.preventDefault(); setImageDrag(true) }}
                  onDragLeave={() => setImageDrag(false)}
                  onDrop={e => { e.preventDefault(); setImageDrag(false); handleImageFiles(e.dataTransfer.files) }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    capture={undefined}
                    className="hidden"
                    onChange={e => handleImageFiles(e.target.files)}
                  />
                  <ImageIcon size={18} />
                  From Gallery
                </label>
              </div>

              {/* Captured images grid */}
              {capturedImages.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-400 text-xs">{capturedImages.length} photo{capturedImages.length > 1 ? 's' : ''} added</p>
                    <button
                      type="button"
                      onClick={() => setCapturedImages([])}
                      className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={12} />
                      Remove all
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {capturedImages.map((img, idx) => (
                      <div key={img.id} className="relative group aspect-[3/4] rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
                        <img
                          src={img.preview}
                          alt={`Page ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity
                                        flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewImg(img.preview)}
                            className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 text-white transition-colors"
                          >
                            <ZoomIn size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="bg-red-500/80 hover:bg-red-500 rounded-full p-1.5 text-white transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                          {idx + 1}
                        </span>
                      </div>
                    ))}
                    {/* Add more button */}
                    <label className="aspect-[3/4] rounded-lg border-2 border-dashed border-slate-700
                                      hover:border-slate-500 flex flex-col items-center justify-center gap-1
                                      text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">
                      <input type="file" accept="image/*" multiple className="hidden"
                             onChange={e => handleImageFiles(e.target.files)} />
                      <Plus size={20} />
                      <span className="text-xs">Add</span>
                    </label>
                  </div>
                </div>
              )}

              {capturedImages.length === 0 && (
                <p className="text-center text-slate-600 text-xs py-2">
                  Take photos of each page of your paper — one photo per page recommended
                </p>
              )}
            </div>
          )}

          {/* ── Course Info ── */}
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

          {/* ── Academic Details ── */}
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

          {/* Step indicator */}
          {step && (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 size={14} className="animate-spin text-brand-400" />
              {step}
            </div>
          )}

          <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
            {loading
              ? <><Loader2 size={18} className="animate-spin" /> {step || 'Uploading...'}</>
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
