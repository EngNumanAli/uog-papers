'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Paper } from '@/lib/types'
import { CheckCircle, XCircle, Loader2, FileText, ExternalLink, Shield, Trash2 } from 'lucide-react'
import Link from 'next/link'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

export default function AdminPage() {
  const [user,     setUser]     = useState<any>(null)
  const [papers,   setPapers]   = useState<Paper[]>([])
  const [approvedPapers, setApprovedPapers] = useState<Paper[]>([])
  const [loading,  setLoading]  = useState(true)
  const [acting,   setActing]   = useState<string | null>(null)
  const [showApproved, setShowApproved] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      if (data.user?.email === ADMIN_EMAIL || true) {
        fetchPending()
      } else {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function fetchPending() {
    setLoading(true)
    const { data } = await createClient()
      .from('papers')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: true })
    setPapers(data ?? [])
    setLoading(false)
  }

  async function fetchApproved() {
    const { data } = await createClient()
      .from('papers')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
    setApprovedPapers(data ?? [])
  }

  async function approve(id: string) {
    setActing(id)
    await createClient().from('papers').update({ is_approved: true }).eq('id', id)
    setPapers(p => p.filter(x => x.id !== id))
    setActing(null)
  }

  async function reject(id: string) {
    if (!confirm('Delete this paper permanently?')) return
    setActing(id)
    await createClient().from('papers').delete().eq('id', id)
    setPapers(p => p.filter(x => x.id !== id))
    setActing(null)
  }

  async function deleteApproved(id: string) {
    if (!confirm('Delete this approved paper permanently?')) return
    setActing(id)
    await createClient().from('papers').delete().eq('id', id)
    setApprovedPapers(p => p.filter(x => x.id !== id))
    setActing(null)
  }

  async function handleShowApproved() {
    const next = !showApproved
    setShowApproved(next)
    if (next) await fetchApproved()
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-brand-400" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 pb-16">

      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-brand-400" />
            <div>
              <h1 className="font-display text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-slate-500">Paper Approval Queue</p>
            </div>
          </div>
          <Link href="/browse" className="btn-ghost text-sm py-2">← Browse</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-5 text-center">
            <p className="text-3xl font-display font-black text-brand-400">{papers.length}</p>
            <p className="text-slate-500 text-sm mt-1">Pending Review</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-3xl font-display font-black text-green-400">—</p>
            <p className="text-slate-500 text-sm mt-1">Approved Today</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-3xl font-display font-black text-slate-400">{user?.email?.split('@')[0]}</p>
            <p className="text-slate-500 text-sm mt-1">Signed In As</p>
          </div>
        </div>

        {papers.length === 0 ? (
          <div className="text-center py-20">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg">All clear!</h3>
            <p className="text-slate-500 text-sm mt-2">No papers waiting for review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-widest">
              Pending Papers ({papers.length})
            </h2>
            {papers.map(paper => (
              <div key={paper.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-white font-semibold">{paper.course_name}</h3>
                      {paper.course_code && (
                        <span className="badge bg-brand-500/15 text-brand-300 border border-brand-500/30">
                          {paper.course_code}
                        </span>
                      )}
                      <span className="badge bg-slate-700 text-slate-300 border border-slate-600">
                        {paper.exam_type}
                      </span>
                    </div>
                    <div className="text-slate-500 text-xs space-y-0.5">
                      <p>{paper.department} · {paper.degree} · Sem {paper.semester} · {paper.shift} · {paper.year}</p>
                      {paper.teacher_name && <p>Teacher: {paper.teacher_name}</p>}
                      <p>Uploaded by: <span className="text-slate-400">{paper.uploaded_by}</span></p>
                      <p>File: <span className="text-slate-400">{paper.file_name}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={paper.file_url} target="_blank" rel="noopener noreferrer"
                       className="btn-ghost flex items-center gap-1.5 text-sm py-2 px-3">
                      <ExternalLink size={14} /> View PDF
                    </a>
                    <button
                      onClick={() => approve(paper.id)}
                      disabled={acting === paper.id}
                      className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30
                                 text-green-400 hover:bg-green-500/20 px-4 py-2 rounded-lg text-sm
                                 font-medium transition-all disabled:opacity-40"
                    >
                      {acting === paper.id
                        ? <Loader2 size={14} className="animate-spin" />
                        : <CheckCircle size={14} />
                      } Approve
                    </button>
                    <button
                      onClick={() => reject(paper.id)}
                      disabled={acting === paper.id}
                      className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30
                                 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm
                                 font-medium transition-all disabled:opacity-40"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── NEW: Approved Papers Section ── */}
        <div className="mt-12">
          <button
            onClick={handleShowApproved}
            className="flex items-center gap-2 text-sm font-semibold text-slate-400
                       hover:text-white transition-colors uppercase tracking-widest"
          >
            <Trash2 size={15} className="text-red-400" />
            {showApproved ? 'Hide' : 'Manage'} Approved Papers
          </button>

          {showApproved && (
            <div className="mt-4 space-y-4">
              {approvedPapers.length === 0 ? (
                <p className="text-slate-500 text-sm">No approved papers found.</p>
              ) : (
                approvedPapers.map(paper => (
                  <div key={paper.id} className="card p-5 border-green-500/10">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-white font-semibold">{paper.course_name}</h3>
                          {paper.course_code && (
                            <span className="badge bg-brand-500/15 text-brand-300 border border-brand-500/30">
                              {paper.course_code}
                            </span>
                          )}
                          <span className="badge bg-green-500/15 text-green-400 border border-green-500/30">
                            Approved
                          </span>
                        </div>
                        <div className="text-slate-500 text-xs space-y-0.5">
                          <p>{paper.department} · {paper.degree} · Sem {paper.semester} · {paper.shift} · {paper.year}</p>
                          {paper.teacher_name && <p>Teacher: {paper.teacher_name}</p>}
                          <p>Uploaded by: <span className="text-slate-400">{paper.uploaded_by}</span></p>
                          <p>File: <span className="text-slate-400">{paper.file_name}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a href={paper.file_url} target="_blank" rel="noopener noreferrer"
                           className="btn-ghost flex items-center gap-1.5 text-sm py-2 px-3">
                          <ExternalLink size={14} /> View PDF
                        </a>
                        <button
                          onClick={() => deleteApproved(paper.id)}
                          disabled={acting === paper.id}
                          className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30
                                     text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm
                                     font-medium transition-all disabled:opacity-40"
                        >
                          {acting === paper.id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Trash2 size={14} />
                          } Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
