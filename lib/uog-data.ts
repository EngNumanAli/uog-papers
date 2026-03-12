// ── Complete Hafiz Hayat Campus Data ─────────────────────────────────────
// Pre-populated so no user can make typos in dropdowns

export const UOG_DATA = {
  faculties: [
    {
      id: 'cs-it',
      name: 'Computing & Information Technology',
      departments: [
        {
          id: 'cs',
          name: 'Computer Science',
          degrees: ['BS Computer Science', 'MS Computer Science', 'PhD Computer Science'],
        },
        {
          id: 'se',
          name: 'Software Engineering',
          degrees: ['BS Software Engineering'],
        },
        {
          id: 'it',
          name: 'Information Technology',
          degrees: ['BS Information Technology'],
        },
      ],
    },
    {
      id: 'engineering',
      name: 'Engineering & Technology',
      departments: [
        {
          id: 'ee',
          name: 'Electrical Engineering',
          degrees: ['BS Electrical Engineering'],
        },
        {
          id: 'me',
          name: 'Mechanical Engineering',
          degrees: ['BS Mechanical Engineering'],
        },
        {
          id: 'civil',
          name: 'Civil Engineering',
          degrees: ['BS Civil Engineering'],
        },
      ],
    },
    {
      id: 'management',
      name: 'Management Sciences',
      departments: [
        {
          id: 'bba',
          name: 'Business Administration',
          degrees: ['BBA', 'MBA', 'MS Management Sciences'],
        },
        {
          id: 'commerce',
          name: 'Commerce',
          degrees: ['B.Com', 'M.Com'],
        },
      ],
    },
    {
      id: 'science',
      name: 'Science',
      departments: [
        {
          id: 'physics',
          name: 'Physics',
          degrees: ['BS Physics', 'MS Physics'],
        },
        {
          id: 'math',
          name: 'Mathematics',
          degrees: ['BS Mathematics', 'MS Mathematics'],
        },
        {
          id: 'chemistry',
          name: 'Chemistry',
          degrees: ['BS Chemistry', 'MS Chemistry'],
        },
        {
          id: 'bio',
          name: 'Bioinformatics',
          degrees: ['BS Bioinformatics'],
        },
      ],
    },
    {
      id: 'social',
      name: 'Social Sciences',
      departments: [
        {
          id: 'edu',
          name: 'Education',
          degrees: ['BS Education', 'M.Ed', 'MS Education'],
        },
        {
          id: 'english',
          name: 'English',
          degrees: ['BS English', 'MA English'],
        },
        {
          id: 'urdu',
          name: 'Urdu',
          degrees: ['BS Urdu', 'MA Urdu'],
        },
        {
          id: 'islamiat',
          name: 'Islamic Studies',
          degrees: ['BS Islamic Studies', 'MA Islamic Studies'],
        },
      ],
    },
  ],
}

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]
export const SHIFTS    = ['Morning', 'Evening']
export const EXAM_TYPES = ['Mid Term', 'Final Term', 'Quiz', 'Assignment']
export const YEARS     = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

// Helper — get all departments flat
export function getAllDepartments() {
  return UOG_DATA.faculties.flatMap(f =>
    f.departments.map(d => ({ ...d, faculty: f.name, facultyId: f.id }))
  )
}

// Helper — get degrees for a department
export function getDegreesForDept(deptId: string): string[] {
  for (const f of UOG_DATA.faculties) {
    const dept = f.departments.find(d => d.id === deptId)
    if (dept) return dept.degrees
  }
  return []
}

// Helper — get departments for a faculty
export function getDeptsByFaculty(facultyId: string) {
  return UOG_DATA.faculties.find(f => f.id === facultyId)?.departments ?? []
}
