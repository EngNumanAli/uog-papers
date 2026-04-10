// 'use client'
// import { useState, useEffect } from 'react'
// import { createClient } from '@/lib/supabase'
// import { Paper } from '@/lib/types'
// import { CheckCircle, XCircle, Loader2, FileText, ExternalLink, Shield, Trash2 } from 'lucide-react'
// import Link from 'next/link'

// const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

// export default function AdminPage() {
//   const [user,     setUser]     = useState<any>(null)
//   const [papers,   setPapers]   = useState<Paper[]>([])
//   const [approvedPapers, setApprovedPapers] = useState<Paper[]>([])
//   const [loading,  setLoading]  = useState(true)
//   const [acting,   setActing]   = useState<string | null>(null)
//   const [showApproved, setShowApproved] = useState(false)

//   useEffect(() => {
//     async function load() {
//       const supabase = createClient()
//       const { data } = await supabase.auth.getUser()
//       setUser(data.user)
//       if (data.user?.email === ADMIN_EMAIL || true) {
//         fetchPending()
//       } else {
//         setLoading(false)
//       }
//     }
//     load()
//   }, [])

//   async function fetchPending() {
//     setLoading(true)
//     const { data } = await createClient()
//       .from('papers')
//       .select('*')
//       .eq('is_approved', false)
//       .order('created_at', { ascending: true })
//     setPapers(data ?? [])
//     setLoading(false)
//   }

//   async function fetchApproved() {
//     const { data } = await createClient()
//       .from('papers')
//       .select('*')
//       .eq('is_approved', true)
//       .order('created_at', { ascending: false })
//     setApprovedPapers(data ?? [])
//   }

//   async function approve(id: string) {
//     setActing(id)
//     await createClient().from('papers').update({ is_approved: true }).eq('id', id)
//     setPapers(p => p.filter(x => x.id !== id))
//     setActing(null)
//   }

//   async function reject(id: string) {
//     if (!confirm('Delete this paper permanently?')) return
//     setActing(id)
//     await createClient().from('papers').delete().eq('id', id)
//     setPapers(p => p.filter(x => x.id !== id))
//     setActing(null)
//   }

//   async function deleteApproved(id: string) {
//     if (!confirm('Delete this approved paper permanently?')) return
//     setActing(id)
//     await createClient().from('papers').delete().eq('id', id)
//     setApprovedPapers(p => p.filter(x => x.id !== id))
//     setActing(null)
//   }

//   async function handleShowApproved() {
//     const next = !showApproved
//     setShowApproved(next)
//     if (next) await fetchApproved()
//   }

//   if (loading) return (
//     <div className="min-h-screen bg-slate-950 flex items-center justify-center">
//       <Loader2 size={32} className="animate-spin text-brand-400" />
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-slate-950 pb-16">

//       {/* Header */}
//       <div className="bg-slate-900 border-b border-slate-800">
//         <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Shield size={20} className="text-brand-400" />
//             <div>
//               <h1 className="font-display text-xl font-bold text-white">Admin Panel</h1>
//               <p className="text-xs text-slate-500">Paper Approval Queue</p>
//             </div>
//           </div>
//           <Link href="/browse" className="btn-ghost text-sm py-2">← Browse</Link>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-4 py-8">

//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-4 mb-8">
//           <div className="card p-5 text-center">
//             <p className="text-3xl font-display font-black text-brand-400">{papers.length}</p>
//             <p className="text-slate-500 text-sm mt-1">Pending Review</p>
//           </div>
//           <div className="card p-5 text-center">
//             <p className="text-3xl font-display font-black text-green-400">—</p>
//             <p className="text-slate-500 text-sm mt-1">Approved Today</p>
//           </div>
//           <div className="card p-5 text-center">
//             <p className="text-3xl font-display font-black text-slate-400">{user?.email?.split('@')[0]}</p>
//             <p className="text-slate-500 text-sm mt-1">Signed In As</p>
//           </div>
//         </div>

//         {papers.length === 0 ? (
//           <div className="text-center py-20">
//             <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
//             <h3 className="text-white font-semibold text-lg">All clear!</h3>
//             <p className="text-slate-500 text-sm mt-2">No papers waiting for review.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-widest">
//               Pending Papers ({papers.length})
//             </h2>
//             {papers.map(paper => (
//               <div key={paper.id} className="card p-5">
//                 <div className="flex flex-wrap items-start justify-between gap-4">
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 mb-1 flex-wrap">
//                       <h3 className="text-white font-semibold">{paper.course_name}</h3>
//                       {paper.course_code && (
//                         <span className="badge bg-brand-500/15 text-brand-300 border border-brand-500/30">
//                           {paper.course_code}
//                         </span>
//                       )}
//                       <span className="badge bg-slate-700 text-slate-300 border border-slate-600">
//                         {paper.exam_type}
//                       </span>
//                     </div>
//                     <div className="text-slate-500 text-xs space-y-0.5">
//                       <p>{paper.department} · {paper.degree} · Sem {paper.semester} · {paper.shift} · {paper.year}</p>
//                       {paper.teacher_name && <p>Teacher: {paper.teacher_name}</p>}
//                       <p>Uploaded by: <span className="text-slate-400">{paper.uploaded_by}</span></p>
//                       <p>File: <span className="text-slate-400">{paper.file_name}</span></p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 flex-shrink-0">
//                     <a href={paper.file_url} target="_blank" rel="noopener noreferrer"
//                        className="btn-ghost flex items-center gap-1.5 text-sm py-2 px-3">
//                       <ExternalLink size={14} /> View PDF
//                     </a>
//                     <button
//                       onClick={() => approve(paper.id)}
//                       disabled={acting === paper.id}
//                       className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30
//                                  text-green-400 hover:bg-green-500/20 px-4 py-2 rounded-lg text-sm
//                                  font-medium transition-all disabled:opacity-40"
//                     >
//                       {acting === paper.id
//                         ? <Loader2 size={14} className="animate-spin" />
//                         : <CheckCircle size={14} />
//                       } Approve
//                     </button>
//                     <button
//                       onClick={() => reject(paper.id)}
//                       disabled={acting === paper.id}
//                       className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30
//                                  text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm
//                                  font-medium transition-all disabled:opacity-40"
//                     >
//                       <XCircle size={14} /> Reject
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ── NEW: Approved Papers Section ── */}
//         <div className="mt-12">
//           <button
//             onClick={handleShowApproved}
//             className="flex items-center gap-2 text-sm font-semibold text-slate-400
//                        hover:text-white transition-colors uppercase tracking-widest"
//           >
//             <Trash2 size={15} className="text-red-400" />
//             {showApproved ? 'Hide' : 'Manage'} Approved Papers
//           </button>

//           {showApproved && (
//             <div className="mt-4 space-y-4">
//               {approvedPapers.length === 0 ? (
//                 <p className="text-slate-500 text-sm">No approved papers found.</p>
//               ) : (
//                 approvedPapers.map(paper => (
//                   <div key={paper.id} className="card p-5 border-green-500/10">
//                     <div className="flex flex-wrap items-start justify-between gap-4">
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-1 flex-wrap">
//                           <h3 className="text-white font-semibold">{paper.course_name}</h3>
//                           {paper.course_code && (
//                             <span className="badge bg-brand-500/15 text-brand-300 border border-brand-500/30">
//                               {paper.course_code}
//                             </span>
//                           )}
//                           <span className="badge bg-green-500/15 text-green-400 border border-green-500/30">
//                             Approved
//                           </span>
//                         </div>
//                         <div className="text-slate-500 text-xs space-y-0.5">
//                           <p>{paper.department} · {paper.degree} · Sem {paper.semester} · {paper.shift} · {paper.year}</p>
//                           {paper.teacher_name && <p>Teacher: {paper.teacher_name}</p>}
//                           <p>Uploaded by: <span className="text-slate-400">{paper.uploaded_by}</span></p>
//                           <p>File: <span className="text-slate-400">{paper.file_name}</span></p>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2 flex-shrink-0">
//                         <a href={paper.file_url} target="_blank" rel="noopener noreferrer"
//                            className="btn-ghost flex items-center gap-1.5 text-sm py-2 px-3">
//                           <ExternalLink size={14} /> View PDF
//                         </a>
//                         <button
//                           onClick={() => deleteApproved(paper.id)}
//                           disabled={acting === paper.id}
//                           className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30
//                                      text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm
//                                      font-medium transition-all disabled:opacity-40"
//                         >
//                           {acting === paper.id
//                             ? <Loader2 size={14} className="animate-spin" />
//                             : <Trash2 size={14} />
//                           } Delete
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   )
// }
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { SEMESTERS, SHIFTS, EXAM_TYPES, YEARS } from '@/lib/uog-data' // Assuming these are still imported or you can define them locally
import { UploadFormData } from '@/lib/types'
import Link from 'next/link'
import {
  GraduationCap, Upload, FileText,
  Loader2, ChevronDown, X, ArrowLeft
} from 'lucide-react'

// --- EXTRACTED PDF DATA ---
const UOG_DATA = {
  faculties: [
    {
      id: 'CS_IT',
      name: 'Faculty of Computing & Information Technology',
      departments: [
        { id: 'CS_19', name: 'Computer Science (19)', degrees: ['BS Computer Science', 'MS Computer Science', 'PhD Computer Science'] },
        { id: 'IT_56', name: 'Information Technology (56)', degrees: ['BS Information Technology', 'MS Information Technology'] },
        { id: 'SE_98', name: 'Software Engineering (98)', degrees: ['BS Software Engineering'] },
      ]
    },
    {
      id: 'ENGG',
      name: 'Faculty of Engineering & Technology',
      departments: [
        { id: 'EE_22', name: 'Electrical Engineering (22)', degrees: ['BSc Electrical Engineering', 'MSc Electrical Engineering'] },
        { id: 'CHE_23', name: 'Chemical Engineering (23)', degrees: ['BSc Chemical Engineering'] },
        { id: 'ME_86', name: 'Mechanical Engineering (86)', degrees: ['BSc Mechanical Engineering'] },
      ]
    },
    {
      id: 'SCIENCE',
      name: 'Faculty of Science',
      departments: [
        { id: 'BOT_06', name: 'Botany (06)', degrees: ['BS Botany', 'MPhil Botany'] },
        { id: 'CHEM_07', name: 'Chemistry (07)', degrees: ['BS Chemistry', 'MPhil Chemistry'] },
        { id: 'GEO_08', name: 'Geography (08)', degrees: ['BS Geography', 'MPhil Geography'] },
        { id: 'MATH_09', name: 'Mathematics (09)', degrees: ['BS Mathematics', 'MPhil Mathematics'] },
        { id: 'PHY_10', name: 'Physics (10)', degrees: ['BS Physics', 'MPhil Physics'] },
        { id: 'STAT_13', name: 'Statistics (13)', degrees: ['BS Statistics', 'MPhil Statistics'] },
        { id: 'ZOO_14', name: 'Zoology (14)', degrees: ['BS Zoology', 'MPhil Zoology'] },
        { id: 'BIO_53', name: 'Biochemistry & Biotechnology (53)', degrees: ['BS Biochemistry', 'BS Biotechnology', 'MPhil Biochemistry'] },
        { id: 'ENV_61', name: 'Environmental Sciences (61)', degrees: ['BS Environmental Sciences', 'MPhil Environmental Sciences'] },
      ]
    },
    {
      id: 'SOCIAL',
      name: 'Faculty of Social Sciences',
      departments: [
        { id: 'EDU_01', name: 'Education (01)', degrees: ['BEd', 'BS Education', 'MPhil Education'] },
        { id: 'ISL_04', name: 'Islamic Studies (04)', degrees: ['BS Islamic Studies', 'MPhil Islamic Studies'] },
        { id: 'PSY_11', name: 'Psychology (11)', degrees: ['BS Psychology', 'MS Clinical Psychology'] },
        { id: 'PE_12', name: 'Physical Education and Sports Sciences (12)', degrees: ['BS Physical Education'] },
        { id: 'SOC_18', name: 'Sociology (18)', degrees: ['BS Sociology', 'MPhil Sociology'] },
        { id: 'ECO_21', name: 'Economics (21)', degrees: ['BS Economics', 'MPhil Economics'] },
        { id: 'HIS_51', name: 'History & Pak Studies (51)', degrees: ['BS History', 'BS Pakistan Studies'] },
        { id: 'POL_78', name: 'Political Science & International Relations (78)', degrees: ['BS Political Science', 'BS International Relations'] },
      ]
    },
    {
      id: 'ARTS',
      name: 'Faculty of Arts',
      departments: [
        { id: 'ENG_02', name: 'English (02)', degrees: ['BS English', 'MPhil English', 'PhD English'] },
        { id: 'MCM_16', name: 'Centre for Media and Communication Studies (16)', degrees: ['BS Mass Communication', 'MPhil Mass Communication'] },
        { id: 'TRANS_17', name: 'Centre for Languages and Translation Studies (17)', degrees: ['BS Translation Studies'] },
        { id: 'DES_41', name: 'Design (41)', degrees: ['Bachelor of Design (BDes)'] },
        { id: 'ARCH_95', name: 'Architecture (95)', degrees: ['Bachelor of Architecture (BArch)'] },
        { id: 'FA_97', name: 'Fine Arts (97)', degrees: ['Bachelor of Fine Arts (BFA)'] },
      ]
    },
    {
      id: 'MGMT',
      name: 'Faculty of Management & Administrative Sciences',
      departments: [
        { id: 'MGT_20', name: 'Management Sciences (20)', degrees: ['BBA', 'MBA', 'BS Management'] },
        { id: 'IHRM_29', name: 'Institute of Hotel and Restaurant Management (29)', degrees: ['BS Hospitality Management'] },
        { id: 'COM_54', name: 'Commerce (54)', degrees: ['BS Commerce', 'MCom'] },
      ]
    },
    {
      id: 'LAW',
      name: 'Faculty of Law',
      departments: [
        { id: 'LAW_24', name: 'School of Law (24)', degrees: ['LLB (5 Years)', 'LLM'] },
      ]
    }
  ]
}

const getDeptsByFaculty = (facultyId: string) => {
  return UOG_DATA.faculties.find(f => f.id === facultyId)?.departments || []
}

const getDegreesForDept = (deptId: string) => {
  for (const faculty of UOG_DATA.faculties) {
    const dept = faculty.departments.find(d => d.id === deptId)
    if (dept) return dept.degrees
  }
  return []
}
// ----------------------------

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

  const depts   = form.faculty  ? getDeptsByFaculty(form.faculty)   : []
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
