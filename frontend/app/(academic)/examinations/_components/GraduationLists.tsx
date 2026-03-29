'use client'

import { useState, useEffect } from 'react'
import { graduationListAPI, type GraduationList } from '@/lib/api/examinations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, CheckCircle, GraduationCap, Users, Calendar } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'

export default function GraduationLists() {
  const [lists, setLists] = useState<GraduationList[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    program_id: '',
    academic_year: '',
    min_cgpa: '1.5',
    min_credits: '120',
  })

  useEffect(() => {
    loadLists()
  }, [])

  const loadLists = async () => {
    setLoading(true)
    try {
      const data = await graduationListAPI.list()
      setLists(data.results || data)
    } catch (error) {
      console.error('Failed to load graduation lists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!formData.program_id || !formData.academic_year) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setGenerating(true)
    try {
      await graduationListAPI.generate({
        program_id: parseInt(formData.program_id),
        academic_year: formData.academic_year,
        min_cgpa: parseFloat(formData.min_cgpa),
        min_credits: parseInt(formData.min_credits),
      })

      toast({
        title: 'Success',
        description: 'Graduation list generated successfully',
      })

      setDialogOpen(false)
      setFormData({
        program_id: '',
        academic_year: '',
        min_cgpa: '1.5',
        min_credits: '120',
      })
      loadLists()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate graduation list',
        variant: 'destructive',
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await graduationListAPI.approve(id)
      toast({
        title: 'Success',
        description: 'Graduation list approved successfully',
      })
      loadLists()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve graduation list',
        variant: 'destructive',
      })
    }
  }

  const getStatusBadge = (list: GraduationList) => {
    if (list.is_approved) {
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>
    }
    return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Graduation Lists</h2>
          <p className="text-muted-foreground">Manage student graduations</p>
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
              <DialogTitle>Generate Graduation List</DialogTitle>
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
                <Label htmlFor="academic_year">Academic Year</Label>
                <Input
                  id="academic_year"
                  placeholder="e.g., 2023/2024"
                  value={formData.academic_year}
                  onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="min_cgpa">Minimum CGPA</Label>
                <Input
                  id="min_cgpa"
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  value={formData.min_cgpa}
                  onChange={(e) => setFormData({ ...formData, min_cgpa: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Default: 1.5 (Pass degree classification)
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="min_credits">Minimum Credits</Label>
                <Input
                  id="min_credits"
                  type="number"
                  min="0"
                  value={formData.min_credits}
                  onChange={(e) => setFormData({ ...formData, min_credits: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Typical requirement: 120 credits for bachelor's degree
                </p>
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
            <div className="text-2xl font-bold text-green-600">
              {lists.filter(l => l.is_approved).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Graduates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {lists.reduce((sum, l) => sum + l.student_count, 0)}
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
              No graduation lists found. Generate your first list to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Generated Date</TableHead>
                  <TableHead>Ceremony Date</TableHead>
                  <TableHead className="text-center">Graduates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lists.map((list) => (
                  <TableRow key={list.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        {list.program_code} - {list.program_name}
                      </div>
                    </TableCell>
                    <TableCell>{list.academic_year}</TableCell>
                    <TableCell>
                      {format(new Date(list.generated_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {list.ceremony_date ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(list.ceremony_date), 'MMM dd, yyyy')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not set</span>
                      )}
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
                        <Button
                          size="sm"
                          variant="ghost"
                          title="View Students"
                        >
                          <Users className="h-4 w-4" />
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

      {/* Degree Classifications Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Degree Classifications (Sierra Leone System)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-semibold text-green-800">First Class</p>
              <p className="text-muted-foreground">CGPA ≥ 3.70</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-semibold text-blue-800">Second Upper</p>
              <p className="text-muted-foreground">CGPA 3.00 - 3.69</p>
            </div>
            <div className="p-3 bg-cyan-50 rounded-lg">
              <p className="font-semibold text-cyan-800">Second Lower</p>
              <p className="text-muted-foreground">CGPA 2.50 - 2.99</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-semibold text-yellow-800">Third Class</p>
              <p className="text-muted-foreground">CGPA 2.00 - 2.49</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="font-semibold text-orange-800">Pass</p>
              <p className="text-muted-foreground">CGPA 1.50 - 1.99</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
