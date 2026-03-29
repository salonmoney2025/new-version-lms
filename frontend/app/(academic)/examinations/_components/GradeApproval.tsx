'use client'

import { useState, useEffect } from 'react'
import { gradeAPI, type Grade } from '@/lib/api/examinations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, Eye, Send } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function GradeApproval() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [selectedGrades, setSelectedGrades] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('PENDING_APPROVAL')
  const { toast } = useToast()

  useEffect(() => {
    loadGrades()
  }, [statusFilter])

  const loadGrades = async () => {
    setLoading(true)
    try {
      const data = await gradeAPI.list({ approval_status: statusFilter })
      setGrades(data.results || data)
      setSelectedGrades([])
    } catch (error) {
      console.error('Failed to load grades:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectGrade = (gradeId: number, checked: boolean) => {
    if (checked) {
      setSelectedGrades([...selectedGrades, gradeId])
    } else {
      setSelectedGrades(selectedGrades.filter(id => id !== gradeId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGrades(grades.map(g => g.id))
    } else {
      setSelectedGrades([])
    }
  }

  const handleApproveSelected = async () => {
    if (selectedGrades.length === 0) return

    try {
      await gradeAPI.bulkApprove(selectedGrades)
      toast({
        title: 'Success',
        description: `${selectedGrades.length} grades approved successfully`,
      })
      loadGrades()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve grades',
        variant: 'destructive',
      })
    }
  }

  const handlePublishSelected = async () => {
    if (selectedGrades.length === 0) return

    try {
      await gradeAPI.bulkPublish(selectedGrades)
      toast({
        title: 'Success',
        description: `${selectedGrades.length} grades published successfully`,
      })
      loadGrades()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish grades',
        variant: 'destructive',
      })
    }
  }

  const handleApproveOne = async (gradeId: number) => {
    try {
      await gradeAPI.approve(gradeId)
      toast({
        title: 'Success',
        description: 'Grade approved successfully',
      })
      loadGrades()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve grade',
        variant: 'destructive',
      })
    }
  }

  const handleRejectOne = async (gradeId: number) => {
    try {
      await gradeAPI.reject(gradeId, 'Rejected by administrator')
      toast({
        title: 'Success',
        description: 'Grade rejected',
      })
      loadGrades()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject grade',
        variant: 'destructive',
      })
    }
  }

  const handlePublishOne = async (gradeId: number) => {
    try {
      await gradeAPI.publish(gradeId)
      toast({
        title: 'Success',
        description: 'Grade published successfully',
      })
      loadGrades()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish grade',
        variant: 'destructive',
      })
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-blue-100 text-blue-800',
      PUBLISHED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getGradeColor = (letter: string | undefined) => {
    if (!letter) return ''
    const colors: Record<string, string> = {
      'A': 'text-green-600 font-bold',
      'B+': 'text-green-500 font-bold',
      'B': 'text-blue-600 font-semibold',
      'C+': 'text-blue-500',
      'C': 'text-yellow-600',
      'D': 'text-orange-600',
      'F': 'text-red-600 font-bold',
    }
    return colors[letter] || ''
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Grade Approval & Publishing</h2>
          <p className="text-muted-foreground">Review and approve student grades</p>
        </div>
      </div>

      {/* Tabs for different statuses */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="PENDING_APPROVAL">Pending Approval</TabsTrigger>
          <TabsTrigger value="APPROVED">Approved</TabsTrigger>
          <TabsTrigger value="PUBLISHED">Published</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="space-y-4">
          {/* Bulk Actions */}
          {selectedGrades.length > 0 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedGrades.length} grade(s) selected
                  </span>
                  <div className="flex gap-2">
                    {statusFilter === 'PENDING_APPROVAL' && (
                      <Button
                        onClick={handleApproveSelected}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve Selected
                      </Button>
                    )}
                    {statusFilter === 'APPROVED' && (
                      <Button
                        onClick={handlePublishSelected}
                        className="flex items-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Publish Selected
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{grades.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {grades.length > 0
                    ? ((grades.filter(g => g.is_passing).length / grades.length) * 100).toFixed(1)
                    : 0}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Percentage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {grades.length > 0
                    ? (grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length).toFixed(1)
                    : 0}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Highest Mark</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {grades.length > 0 ? Math.max(...grades.map(g => g.marks_obtained)) : 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grades Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : grades.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No grades found with status: {statusFilter}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedGrades.length === grades.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead className="text-right">Marks</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedGrades.includes(grade.id)}
                            onCheckedChange={(checked) =>
                              handleSelectGrade(grade.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">{grade.student_id}</TableCell>
                        <TableCell>{grade.student_name}</TableCell>
                        <TableCell>{grade.exam_name}</TableCell>
                        <TableCell className="text-sm">{grade.course_code}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {grade.marks_obtained}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={grade.is_passing ? 'text-green-600' : 'text-red-600'}>
                            {grade.percentage.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getGradeColor(grade.grade_letter)}>
                            {grade.grade_letter || '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(grade.approval_status)}>
                            {grade.approval_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {grade.approval_status === 'PENDING_APPROVAL' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleApproveOne(grade.id)}
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRejectOne(grade.id)}
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                            {grade.approval_status === 'APPROVED' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handlePublishOne(grade.id)}
                                title="Publish"
                              >
                                <Send className="h-4 w-4 text-blue-600" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
