/**
 * API utilities for Examinations module
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export interface Exam {
  id: number
  course_offering: number
  course_code: string
  course_title: string
  name: string
  exam_type: string
  date: string
  start_time: string
  end_time: string
  duration_minutes: number
  total_marks: number
  passing_marks: number
  instructions?: string
  venue?: string
  capacity?: number
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  invigilators: number[]
  created_at: string
  updated_at: string
}

export interface Grade {
  id: number
  student: number
  student_id: string
  student_name: string
  exam: number
  exam_name: string
  course_code: string
  marks_obtained: number
  graded_by?: number
  graded_by_name?: string
  graded_date: string
  remarks?: string
  percentage: number
  is_passing: boolean
  grade_letter?: string
  approval_status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PUBLISHED' | 'REJECTED'
  approved_by?: number
  approved_date?: string
  is_published: boolean
  published_by?: number
  published_date?: string
  created_at: string
  updated_at: string
}

export interface PromotionalList {
  id: number
  semester: string
  academic_year: string
  program: number
  program_code: string
  program_name: string
  level: number
  generated_date: string
  approved_by?: number
  approved_by_name?: string
  approved_date?: string
  is_approved: boolean
  is_executed: boolean
  executed_date?: string
  student_count: number
  created_at: string
  updated_at: string
}

export interface GraduationList {
  id: number
  academic_year: string
  program: number
  program_code: string
  program_name: string
  ceremony_date?: string
  generated_date: string
  approved_by?: number
  approved_by_name?: string
  approved_date?: string
  is_approved: boolean
  student_count: number
  created_at: string
  updated_at: string
}

// Exam API
export const examAPI = {
  list: async (params?: Record<string, any>) => {
    const query = new URLSearchParams(params).toString()
    const res = await fetch(`${BASE_URL}/exams/exams/${query ? `?${query}` : ''}`)
    return res.json()
  },

  get: async (id: number) => {
    const res = await fetch(`${BASE_URL}/exams/exams/${id}/`)
    return res.json()
  },

  create: async (data: Partial<Exam>) => {
    const res = await fetch(`${BASE_URL}/exams/exams/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  update: async (id: number, data: Partial<Exam>) => {
    const res = await fetch(`${BASE_URL}/exams/exams/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  delete: async (id: number) => {
    const res = await fetch(`${BASE_URL}/exams/exams/${id}/`, {
      method: 'DELETE',
    })
    return res.ok
  },

  exportPDF: (id: number) => {
    window.open(`${BASE_URL}/exams/exams/${id}/export_pdf/`, '_blank')
  },

  exportExcel: (id: number) => {
    window.open(`${BASE_URL}/exams/exams/${id}/export_excel/`, '_blank')
  },

  getStatistics: async (id: number) => {
    const res = await fetch(`${BASE_URL}/exams/exams/${id}/statistics/`)
    return res.json()
  },
}

// Grade API
export const gradeAPI = {
  list: async (params?: Record<string, any>) => {
    const query = new URLSearchParams(params).toString()
    const res = await fetch(`${BASE_URL}/exams/grades/${query ? `?${query}` : ''}`)
    return res.json()
  },

  get: async (id: number) => {
    const res = await fetch(`${BASE_URL}/exams/grades/${id}/`)
    return res.json()
  },

  create: async (data: Partial<Grade>) => {
    const res = await fetch(`${BASE_URL}/exams/grades/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  update: async (id: number, data: Partial<Grade>) => {
    const res = await fetch(`${BASE_URL}/exams/grades/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  bulkGrade: async (grades: Array<{student_id: number, exam_id: number, marks_obtained: number, remarks?: string}>) => {
    const res = await fetch(`${BASE_URL}/exams/grades/bulk_grade/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grades }),
    })
    return res.json()
  },

  approve: async (id: number) => {
    const res = await fetch(`${BASE_URL}/exams/grades/${id}/approve/`, {
      method: 'POST',
    })
    return res.json()
  },

  reject: async (id: number, reason?: string) => {
    const res = await fetch(`${BASE_URL}/exams/grades/${id}/reject/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    })
    return res.json()
  },

  publish: async (id: number) => {
    const res = await fetch(`${BASE_URL}/exams/grades/${id}/publish/`, {
      method: 'POST',
    })
    return res.json()
  },

  unpublish: async (id: number) => {
    const res = await fetch(`${BASE_URL}/exams/grades/${id}/unpublish/`, {
      method: 'POST',
    })
    return res.json()
  },

  bulkApprove: async (grade_ids: number[]) => {
    const res = await fetch(`${BASE_URL}/exams/grades/bulk_approve/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade_ids }),
    })
    return res.json()
  },

  bulkPublish: async (grade_ids: number[]) => {
    const res = await fetch(`${BASE_URL}/exams/grades/bulk_publish/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade_ids }),
    })
    return res.json()
  },
}

// Promotional List API
export const promotionalListAPI = {
  list: async (params?: Record<string, any>) => {
    const query = new URLSearchParams(params).toString()
    const res = await fetch(`${BASE_URL}/exams/promotional-lists/${query ? `?${query}` : ''}`)
    return res.json()
  },

  get: async (id: number) => {
    const res = await fetch(`${BASE_URL}/exams/promotional-lists/${id}/`)
    return res.json()
  },

  generate: async (data: {
    program_id: number
    level: number
    semester: string
    academic_year: string
    min_cgpa?: number
  }) => {
    const res = await fetch(`${BASE_URL}/exams/promotional-lists/generate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  approve: async (id: number) => {
    const res = await fetch(`${BASE_URL}/exams/promotional-lists/${id}/approve/`, {
      method: 'POST',
    })
    return res.json()
  },

  execute: async (id: number) => {
    const res = await fetch(`${BASE_URL}/exams/promotional-lists/${id}/execute/`, {
      method: 'POST',
    })
    return res.json()
  },

  exportExcel: (id: number) => {
    window.open(`${BASE_URL}/exams/promotional-lists/${id}/export_excel/`, '_blank')
  },
}

// Graduation List API
export const graduationListAPI = {
  list: async (params?: Record<string, any>) => {
    const query = new URLSearchParams(params).toString()
    const res = await fetch(`${BASE_URL}/exams/graduation-lists/${query ? `?${query}` : ''}`)
    return res.json()
  },

  get: async (id: number) => {
    const res = await fetch(`${BASE_URL}/exams/graduation-lists/${id}/`)
    return res.json()
  },

  generate: async (data: {
    program_id: number
    academic_year: string
    min_cgpa?: number
    min_credits?: number
  }) => {
    const res = await fetch(`${BASE_URL}/exams/graduation-lists/generate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  approve: async (id: number) => {
    const res = await fetch(`${BASE_URL}/exams/graduation-lists/${id}/approve/`, {
      method: 'POST',
    })
    return res.json()
  },
}
