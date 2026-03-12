'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { UOG_DATA, SEMESTERS, SHIFTS, EXAM_TYPES, YEARS, getDeptsByFaculty, getDegreesForDept } from '@/lib/uog-data'
import { Paper, FilterState } from '@/lib/types'
import Link from 'next/link'
import {
  Search, Filter, Download, FileText, Calendar,
  GraduationCap, ChevronDown, X, Loader2, Upload, SlidersHorizontal
} from 'lucide-react'

const EMPTY_FILTERS: FilterState = {
  faculty:'', department:'', degree:'', semester:'',
  shift:'', exam_type:'', year:'', search:''
}

export default function BrowsePage() {
  const [papers,   setPapers]   = useState<Paper[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filters,  setFilters]  = useState<FilterState>(EMPTY_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const [debounced,   setDebounced]   = useState('')

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(filters.search), 400)
    return () => clearTimeout(t)
  }, [filters.search])

  const fetchPapers = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase
      .from('papers')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (filters.faculty)    query = query.eq('faculty',    filters.faculty)
    if (filters.department) query = query.eq('department', filters.department)
    if (filters.degree)     query = query.eq('degree',     filters.degree)
    if (filters.semester)   query = query.eq('semester',   Number(filters.semester))
    if (filters.shift)      query = query.eq('shift',      filters.shift)
    if (filters.exam_type)  query = query.eq('exam_type',  filters.exam_type)
    if (filters.year)       query = query.eq('year',       Number(filters.year))
    if (debounced)          query = query.ilike('course_name', `%${debounced}%`)

    const { data } = await query.limit(50)
    setPapers(data ?? [])
    setLoading(false)
  }, [filters.faculty, filters.department, filters.degree, filters.semester,
      filters.shift, filters.exam_type, filters.year, debounced])

  useEffect(() => { fetchPapers() }, [fetchPapers])

  function set(key: keyof FilterState, val: string) {
    setFilters(prev => {
      const next = { ...prev, [key]: val }
      // Reset child filters when parent changes
      if (key === 'faculty')    { next.department = ''; next.degree = '' }
      if (key === 'department') { next.degree = '' }
      return next
    })
  }

  function clearFilters() { setFilters(EMPTY_FILTERS) }

  const depts   = filters.faculty    ? getDeptsByFaculty(filters.faculty)          : []
  const degrees = filters.department ? getDegreesForDept(filters.department)        : []
  const activeFilterCount = Object.entries(filters)
    .filter(([k, v]) => k !== 'search' && v !== '').length

  function examBadgeColor(type: string) {
    if (type === 'Mid Term')   return 'bg-blue-500/15 text-blue-300 border-blue-500/30'
    if (type === 'Final Term') return 'bg-red-500/15 text-red-300 border-red-500/30'
    return 'bg-slate-700 text-slate-300 border-slate-600'
  }

  return (
    <div className="min-h-screen bg-slate-950">

      {/* ── Header ── */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
                <GraduationCap size={15} className="text-white" />
              </div>
              <span className="font-display font-bold text-white text-sm">UOG Papers</span>
            </Link>
            <Link href="/upload" className="btn-primary flex items-center gap-2 text-sm py-2">
              <Upload size={14} /> Upload
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={filters.search}
                onChange={e => set('search', e.target.value)}
                placeholder="Search by course name..."
                className="input pl-9"
              />
            </div>
            <button
              onClick={() => setShowFilters(s => !s)}
              className={`btn-ghost flex items-center gap-2 text-sm py-2 px-4 relative
                          ${showFilters ? 'border-brand-500 text-brand-400' : ''}`}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
                                 bg-brand-500 text-white text-xs flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters}
                      className="flex items-center gap-1 text-slate-400 hover:text-red-400 text-sm transition-colors">
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="border-t border-slate-800 bg-slate-900/95 px-4 py-4">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">

              {/* Faculty */}
              <div>
                <label className="label">Faculty</label>
                <div className="relative">
                  <select className="select pr-8" value={filters.faculty} onChange={e => set('faculty', e.target.value)}>
                    <option value="">All</option>
                    {UOG_DATA.faculties.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="label">Department</label>
                <div className="relative">
                  <select className="select pr-8" value={filters.department} onChange={e => set('department', e.target.value)} disabled={!filters.faculty}>
                    <option value="">All</option>
                    {depts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Degree */}
              <div>
                <label className="label">Degree</label>
                <div className="relative">
                  <select className="select pr-8" value={filters.degree} onChange={e => set('degree', e.target.value)} disabled={!filters.department}>
                    <option value="">All</option>
                    {degrees.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Semester */}
              <div>
                <label className="label">Semester</label>
                <div className="relative">
                  <select className="select pr-8" value={filters.semester} onChange={e => set('semester', e.target.value)}>
                    <option value="">All</option>
                    {SEMESTERS.map(s => <option key={s} value={s}>{s === 1 ? '1st' : s === 2 ? '2nd' : s === 3 ? '3rd' : `${s}th`}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Shift */}
              <div>
                <label className="label">Shift</label>
                <div className="relative">
                  <select className="select pr-8" value={filters.shift} onChange={e => set('shift', e.target.value)}>
                    <option value="">All</option>
                    {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Exam Type */}
              <div>
                <label className="label">Exam Type</label>
                <div className="relative">
                  <select className="select pr-8" value={filters.exam_type} onChange={e => set('exam_type', e.target.value)}>
                    <option value="">All</option>
                    {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Year */}
              <div>
                <label className="label">Year</label>
                <div className="relative">
                  <select className="select pr-8" value={filters.year} onChange={e => set('year', e.target.value)}>
                    <option value="">All</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400 text-sm">
            {loading ? 'Loading...' : `${papers.length} paper${papers.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-brand-400" />
          </div>
        ) : papers.length === 0 ? (
          <div className="text-center py-24">
            <FileText size={48} className="text-slate-700 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">No papers found</h3>
            <p className="text-slate-500 text-sm mb-6">Try changing your filters or be the first to upload!</p>
            <Link href="/upload" className="btn-primary inline-flex items-center gap-2">
              <Upload size={16} /> Upload a Paper
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {papers.map(paper => (
              <PaperCard key={paper.id} paper={paper} examBadgeColor={examBadgeColor} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function PaperCard({ paper, examBadgeColor }: { paper: Paper; examBadgeColor: (t: string) => string }) {
  return (
    <div className="card p-5 hover:border-slate-600 transition-all duration-200 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 mb-1">
            {paper.course_name}
          </h3>
          {paper.course_code && (
            <span className="text-xs text-brand-400 font-mono">{paper.course_code}</span>
          )}
        </div>
        <div className={`badge border ${examBadgeColor(paper.exam_type)} shrink-0`}>
          {paper.exam_type}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <GraduationCap size={12} className="text-slate-600" />
          <span className="truncate">{paper.department}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-slate-600" />
          <span>{paper.year}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={12} className="text-slate-600" />
          <span>Sem {paper.semester} · {paper.shift}</span>
        </div>
        {paper.teacher_name && (
          <div className="flex items-center gap-1.5 col-span-2">
            <span className="text-slate-600">By:</span>
            <span className="truncate">{paper.teacher_name}</span>
          </div>
        )}
      </div>

      <a
        href={paper.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary flex items-center justify-center gap-2 text-sm py-2 mt-auto"
      >
        <Download size={14} /> Download PDF
      </a>
    </div>
  )
}
