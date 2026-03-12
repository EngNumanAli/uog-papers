export interface Paper {
  id:          string
  course_name: string
  course_code: string
  faculty:     string
  department:  string
  degree:      string
  semester:    number
  shift:       'Morning' | 'Evening'
  exam_type:   'Mid Term' | 'Final Term' | 'Quiz' | 'Assignment'
  year:        number
  file_url:    string
  file_name:   string
  teacher_name:string
  uploaded_by: string
  is_approved: boolean
  created_at:  string
}

export interface UploadFormData {
  course_name:  string
  course_code:  string
  faculty:      string
  department:   string
  degree:       string
  semester:     number
  shift:        string
  exam_type:    string
  year:         number
  teacher_name: string
  file:         File | null
}

export interface FilterState {
  faculty:    string
  department: string
  degree:     string
  semester:   string
  shift:      string
  exam_type:  string
  year:       string
  search:     string
}
