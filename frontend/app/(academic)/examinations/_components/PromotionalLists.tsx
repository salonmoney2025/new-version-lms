'use client'

import { useState, useEffect } from 'react'
import { promotionalListAPI, type PromotionalList } from '@/lib/api/examinations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, CheckCircle, Play, FileSpreadsheet, Users, TrendingUp } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'

export default function PromotionalLists() {
  const [lists, setLists] = useState<PromotionalList[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    program_id: '',
    level: '',
    semester: '',
    academic_year: '',
    min_cgpa: '2.0',
  })

  useEffect(() => {
    loadLists()
  }, [])

  const loadLists = async () => {
    setLoading(true)
    try {
      const data = await promotionalListAPI.list()
      setLists(data.results || data)
    } catch (error) {
      console.error('Failed to load promotional lists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!formData.program_id || !formData.level || !formData.semester || !formData.academic_year) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setGenerating(true)
    try {
      await promotionalListAPI.generate({
        program_id: parseInt(formData.program_id),
        level: parseInt(formData.level),
        semester: formData.semester,
        academic_year: formData.academic_year,
        min_cgpa: parseFloat(formData.min_cgpa),
      })

      toast({
        title: 'Success',
        description: 'Promotional list generated successfully',
      })

      setDialogOpen(false)
      setFormData({
        program_id: '',
        level: '',
        semester: '',
        academic_year: '',
        min_cgpa: '2.0',
      })
      loadLists()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate promotional list',
        variant: 'destructive',
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await promotionalListAPI.approve(id)
      toast({
        title: 'Success',
        description: 'Promotional list approved successfully',
      })
      loadLists()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve promotional list',
        variant: 'destructive',
      })
    }
  }

  const handleExecute = async (id: number) => {
    try {
      await promotionalListAPI.execute(id)
      toast({
        title: 'Success',
        description: 'Promotions executed successfully',
      })
      loadLists()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to execute promotions',
        variant: 'destructive',
      })
    }
  }

  const handleExportExcel = (id: number) => {
    promotionalListAPI.exportExcel(id)
  }

  const getStatusBadge = (list: PromotionalList) => {
    if (list.is_executed) {
      return <Badge className="bg-green-100 text-green-800">Executed</Badge>
    }
    if (list.is_approved) {
      return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>
    }
    return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Promotional Lists</h2>
          <p className="text-muted-foreground">Manage student promotions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Generate List
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Generate Promotional List</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="program">Program</Label>
                <Select
                  value={formData.program_id}
                  onValueChange={(value) => setFormData({ ...formData, program_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Computer Science</SelectItem>
                    <SelectItem value="2">Business Administration</SelectItem>
                    <SelectItem value="3">Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) => setFormData({ ...formData, semester: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semester 1">Semester 1</SelectItem>
                    <SelectItem value="Semester 2">Semester 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="academic_year">Academic Year</Label>
                <Input
                  id="academic_year"
                  placeholder="e.g., 2023/2024"
                  value={formData.academic_year}
                  onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="min_cgpa">Minimum CGPA for Promotion</Label>
                <Input
                  id="min_cgpa"
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  value={formData.min_cgpa}
                  onChange={(e) => setFormData({ ...formData, min_cgpa: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={generating}>
                {generating ? 'Generating...' : 'Generate List'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Lists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lists.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {lists.filter(l => !l.is_approved).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {lists.filter(l => l.is_approved && !l.is_executed).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Executed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {lists.filter(l => l.is_executed).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lists Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : lists.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No promotional lists found. Generate your first list to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Generated Date</TableHead>
                  <TableHead className="text-center">Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lists.map((list) => (
                  <TableRow key={list.id}>
                    <TableCell className="font-medium">
                      {list.program_code} - {list.program_name}
                    </TableCell>
                    <TableCell>Level {list.level}</TableCell>
                    <TableCell>{list.semester}</TableCell>
                    <TableCell>{list.academic_year}</TableCell>
                    <TableCell>
                      {format(new Date(list.generated_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{list.student_count}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(list)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {!list.is_approved && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleApprove(list.id)}
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        {list.is_approved && !list.is_executed && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleExecute(list.id)}
                            title="Execute Promotions"
                          >
                            <Play className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleExportExcel(list.id)}
                          title="Export to Excel"
                        >
                          <FileSpreadsheet className="h-4 w-4" />
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
    </div>
  )
}
