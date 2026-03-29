'use client'

import { useState, useEffect } from 'react'
import { examAPI, type Exam } from '@/lib/api/examinations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Users, Download, FileSpreadsheet, Plus, Edit, Trash2, BarChart3 } from 'lucide-react'
import { format } from 'date-fns'

export default function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadExams()
  }, [statusFilter])

  const loadExams = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (statusFilter !== 'all') params.status = statusFilter
      const data = await examAPI.list(params)
      setExams(data.results || data)
    } catch (error) {
      console.error('Failed to load exams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = (examId: number) => {
    examAPI.exportPDF(examId)
  }

  const handleExportExcel = (examId: number) => {
    examAPI.exportExcel(examId)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      ONGOING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const filteredExams = exams.filter(exam =>
    exam.name.toLowerCase().includes(search.toLowerCase()) ||
    exam.course_code.toLowerCase().includes(search.toLowerCase()) ||
    exam.course_title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Exam Management</h2>
          <p className="text-muted-foreground">Schedule and manage examinations</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Exam
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search exams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'SCHEDULED' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('SCHEDULED')}
            size="sm"
          >
            Scheduled
          </Button>
          <Button
            variant={statusFilter === 'ONGOING' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('ONGOING')}
            size="sm"
          >
            Ongoing
          </Button>
          <Button
            variant={statusFilter === 'COMPLETED' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('COMPLETED')}
            size="sm"
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {exams.filter(e => e.status === 'SCHEDULED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {exams.filter(e => e.status === 'ONGOING').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {exams.filter(e => e.status === 'COMPLETED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exams List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredExams.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No exams found. Create your first exam to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredExams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{exam.name}</h3>
                      <Badge className={getStatusColor(exam.status)}>
                        {exam.status}
                      </Badge>
                      <Badge variant="outline">{exam.exam_type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {exam.course_code} - {exam.course_title}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(exam.date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.start_time} - {exam.end_time}</span>
                      </div>
                      {exam.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{exam.venue}</span>
                        </div>
                      )}
                      {exam.capacity && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Capacity: {exam.capacity}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2 text-sm">
                      <span className="font-medium">Total Marks:</span>
                      <span>{exam.total_marks}</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">Passing Marks:</span>
                      <span>{exam.passing_marks}</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">Duration:</span>
                      <span>{exam.duration_minutes} mins</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportPDF(exam.id)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportExcel(exam.id)}
                      className="flex items-center gap-2"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Stats
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
