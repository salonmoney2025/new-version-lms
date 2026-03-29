'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ExamManagement from './_components/ExamManagement'
import GradeEntry from './_components/GradeEntry'
import GradeApproval from './_components/GradeApproval'
import PromotionalLists from './_components/PromotionalLists'
import GraduationLists from './_components/GraduationLists'

export default function ExaminationsPage() {
  const [activeTab, setActiveTab] = useState('exams')

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Examinations Management</h1>
          <p className="text-muted-foreground">
            Complete examination system - Manage exams, grades, approvals, promotions, and graduations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="grades">Grade Entry</TabsTrigger>
            <TabsTrigger value="approval">Approval</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="graduations">Graduations</TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="space-y-4">
            <ExamManagement />
          </TabsContent>

          <TabsContent value="grades" className="space-y-4">
            <GradeEntry />
          </TabsContent>

          <TabsContent value="approval" className="space-y-4">
            <GradeApproval />
          </TabsContent>

          <TabsContent value="promotions" className="space-y-4">
            <PromotionalLists />
          </TabsContent>

          <TabsContent value="graduations" className="space-y-4">
            <GraduationLists />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
