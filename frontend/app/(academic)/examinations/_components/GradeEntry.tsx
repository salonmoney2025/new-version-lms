'use client'

import { useState, useEffect } from 'react'
import { examAPI, gradeAPI, type Exam, type Grade } from '@/lib/api/examinations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Save, Upload, CheckCircle, XCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface GradeEntry {
  student_id: number
  student_name: string
  marks_obtained: number
  remarks?: string
}

export default function GradeEntry() {
  const [exams, setExams] = useState<Exam[]>([])
  const [selectedExam, setSelectedExam] = useState<number | null>(null)
  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadExams()
  }, [])

  const loadExams = async () => {
    try {
      const data = await examAPI.list({ status: 'COMPLETED' })
      setExams(data.results || data)
    } catch (error) {
      console.error('Failed to load exams:', error)
    }
  }

  const loadGrades = async (examId: number) => {
    setLoading(true)
    try {
      const data = await gradeAPI.list({ exam: examId })
      // Convert existing grades to entries format
      const entries = (data.results || data).map((grade: Grade) => ({
        student_id: grade.student,
        student_name: grade.student_name,
        marks_obtained: grade.marks_obtained,
        remarks: grade.remarks || '',
      }))
      setGradeEntries(entries)
    } catch (error) {
      console.error('Failed to load grades:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExamChange = (examId: string) => {
    const id = parseInt(examId)
    setSelectedExam(id)
    loadGrades(id)
  }

  const handleMarksChange = (index: number, marks: string) => {
    const newEntries = [...gradeEntries]
    newEntries[index].marks_obtained = parseFloat(marks) || 0
    setGradeEntries(newEntries)
  }

  const handleRemarksChange = (index: number, remarks: string) => {
    const newEntries = [...gradeEntries]
    newEntries[index].remarks = remarks
    setGradeEntries(newEntries)
  }

  const handleSaveGrades = async () => {
    if (!selectedExam) return

    setSaving(true)
    try {
      const grades = gradeEntries.map(entry => ({
        student_id: entry.student_id,
        exam_id: selectedExam,
        marks_obtained: entry.marks_obtained,
        remarks: entry.remarks || '',
      }))

      const result = await gradeAPI.bulkGrade(grades)

      toast({
        title: 'Success',
        description: `${result.total_graded} grades saved successfully`,
      })

      loadGrades(selectedExam)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save grades',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const selectedExamData = exams.find(e => e.id === selectedExam)

  const calculateStats = () => {
    if (gradeEntries.length === 0) return { average: 0, passed: 0, failed: 0, passRate: 0 }

    const total = gradeEntries.reduce((sum, entry) => sum + entry.marks_obtained, 0)
    const average = total / gradeEntries.length
    const passed = gradeEntries.filter(
      entry => selectedExamData && entry.marks_obtained >= selectedExamData.passing_marks
    ).length
    const failed = gradeEntries.length - passed
    const passRate = (passed / gradeEntries.length) * 100

    return { average, passed, failed, passRate }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Grade Entry</h2>
          <p className="text-muted-foreground">Enter and manage student grades</p>
        </div>
      </div>

      {/* Exam Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Exam</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={handleExamChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an exam to enter grades..." />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id.toString()}>
                  {exam.name} - {exam.course_code} ({exam.date})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedExamData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Total Marks</p>
                <p className="text-lg font-semibold">{selectedExamData.total_marks}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Passing Marks</p>
                <p className="text-lg font-semibold">{selectedExamData.passing_marks}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Venue</p>
                <p className="text-lg font-semibold">{selectedExamData.venue || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge>{selectedExamData.status}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {selectedExam && gradeEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Marks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.average.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Passed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.passRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grade Entry Table */}
      {selectedExam && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Enter Grades</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import from Excel
              </Button>
              <Button
                onClick={handleSaveGrades}
                disabled={saving || gradeEntries.length === 0}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save All Grades'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : gradeEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No students found for this exam
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="w-32">Marks Obtained</TableHead>
                    <TableHead className="w-20">Percentage</TableHead>
                    <TableHead className="w-20">Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradeEntries.map((entry, index) => {
                    const percentage = selectedExamData
                      ? (entry.marks_obtained / selectedExamData.total_marks) * 100
                      : 0
                    const isPassing = selectedExamData
                      ? entry.marks_obtained >= selectedExamData.passing_marks
                      : false

                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{entry.student_id}</TableCell>
                        <TableCell>{entry.student_name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max={selectedExamData?.total_marks}
                            value={entry.marks_obtained}
                            onChange={(e) => handleMarksChange(index, e.target.value)}
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <span className={percentage >= 50 ? 'text-green-600' : 'text-red-600'}>
                            {percentage.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          {isPassing ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Optional remarks..."
                            value={entry.remarks || ''}
                            onChange={(e) => handleRemarksChange(index, e.target.value)}
                            className="w-full"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
