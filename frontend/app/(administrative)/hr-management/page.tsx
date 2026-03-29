'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  AlertCircle,
  Award,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Home,
  LayoutDashboard,
  Phone,
  Plus,
  Printer,
  Search,
  Send,
  Trash2,
  Upload,
  UserPlus,
  Users,
  XCircle
} from 'lucide-react';

interface Position {
  id: number;
  title: string;
  department: string;
  grade: string;
  salary_min: number;
  salary_max: number;
  description: string;
  requirements: string;
  status: 'active' | 'inactive';
  vacancies: number;
  created_at: string;
}

interface Staff {
  id: number;
  staff_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  grade: string;
  salary: number;
  hire_date: string;
  status: 'active' | 'on_leave' | 'suspended' | 'terminated';
  contract_type: 'full_time' | 'part_time' | 'contract';
}

interface LeaveRequest {
  id: number;
  staff_name: string;
  staff_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_date: string;
}

interface PayrollRecord {
  id: number;
  staff_id: string;
  staff_name: string;
  department: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  month: string;
  status: 'pending' | 'processed' | 'paid';
}

interface PerformanceReview {
  id: number;
  staff_id: string;
  staff_name: string;
  reviewer: string;
  period: string;
  rating: number;
  strengths: string;
  improvements: string;
  status: 'draft' | 'completed' | 'acknowledged';
}

export default function HRManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [positions, setPositions] = useState<Position[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);

  const [searchTerm, setSearchTerm] = useState('');

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Civil Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Accounting',
    'Management',
    'Educational Psychology',
    'Curriculum Studies',
    'Administration',
    'Finance',
    'Human Resources',
    'Library',
    'Student Affairs',
  ];


  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock Positions
    const mockPositions: Position[] = [
      {
        id: 1,
        title: 'Senior Lecturer - Computer Science',
        department: 'Computer Science',
        grade: 'Senior Lecturer',
        salary_min: 80000,
        salary_max: 120000,
        description: 'Teaching and research in Computer Science',
        requirements: 'PhD in Computer Science, 5+ years teaching experience',
        status: 'active',
        vacancies: 2,
        created_at: '2024-01-15',
      },
      {
        id: 2,
        title: 'Professor - Mathematics',
        department: 'Mathematics',
        grade: 'Professor',
        salary_min: 150000,
        salary_max: 200000,
        description: 'Lead research and teaching in Mathematics department',
        requirements: 'PhD in Mathematics, 10+ years experience, published research',
        status: 'active',
        vacancies: 1,
        created_at: '2024-02-20',
      },
      {
        id: 3,
        title: 'Administrative Officer - Finance',
        department: 'Finance',
        grade: 'Administrative Officer',
        salary_min: 50000,
        salary_max: 70000,
        description: 'Handle financial operations and reporting',
        requirements: "Bachelor's degree in Accounting/Finance, 3+ years experience",
        status: 'active',
        vacancies: 3,
        created_at: '2024-03-10',
      },
    ];

    // Mock Staff
    const mockStaff: Staff[] = [
      {
        id: 1,
        staff_id: 'STF12001',
        name: 'Dr. John Kamara',
        email: 'john.kamara@ebkustsl.edu.sl',
        phone: '+23276123456',
        department: 'Computer Science',
        position: 'Senior Lecturer',
        grade: 'Senior Lecturer',
        salary: 100000,
        hire_date: '2020-01-15',
        status: 'active',
        contract_type: 'full_time',
      },
      {
        id: 2,
        staff_id: 'STF12002',
        name: 'Prof. Aminata Sesay',
        email: 'aminata.sesay@ebkustsl.edu.sl',
        phone: '+23276234567',
        department: 'Mathematics',
        position: 'Professor',
        grade: 'Professor',
        salary: 175000,
        hire_date: '2018-09-01',
        status: 'active',
        contract_type: 'full_time',
      },
      {
        id: 3,
        staff_id: 'STF12003',
        name: 'Mr. Ibrahim Conteh',
        email: 'ibrahim.conteh@ebkustsl.edu.sl',
        phone: '+23276345678',
        department: 'Finance',
        position: 'Administrative Officer',
        grade: 'Administrative Officer',
        salary: 60000,
        hire_date: '2021-03-20',
        status: 'active',
        contract_type: 'full_time',
      },
      {
        id: 4,
        staff_id: 'STF12004',
        name: 'Ms. Fatmata Bangura',
        email: 'fatmata.bangura@ebkustsl.edu.sl',
        phone: '+23276456789',
        department: 'Library',
        position: 'Librarian',
        grade: 'Senior Administrative Officer',
        salary: 75000,
        hire_date: '2019-06-10',
        status: 'on_leave',
        contract_type: 'full_time',
      },
    ];

    // Mock Leave Requests
    const mockLeaveRequests: LeaveRequest[] = [
      {
        id: 1,
        staff_name: 'Dr. John Kamara',
        staff_id: 'STF12001',
        leave_type: 'Annual Leave',
        start_date: '2024-04-01',
        end_date: '2024-04-15',
        days: 14,
        reason: 'Family vacation',
        status: 'pending',
        applied_date: '2024-03-15',
      },
      {
        id: 2,
        staff_name: 'Ms. Fatmata Bangura',
        staff_id: 'STF12004',
        leave_type: 'Maternity Leave',
        start_date: '2024-03-01',
        end_date: '2024-06-01',
        days: 90,
        reason: 'Maternity leave',
        status: 'approved',
        applied_date: '2024-02-01',
      },
      {
        id: 3,
        staff_name: 'Mr. Ibrahim Conteh',
        staff_id: 'STF12003',
        leave_type: 'Sick Leave',
        start_date: '2024-03-20',
        end_date: '2024-03-22',
        days: 3,
        reason: 'Medical treatment',
        status: 'approved',
        applied_date: '2024-03-19',
      },
    ];

    // Mock Payroll
    const mockPayroll: PayrollRecord[] = [
      {
        id: 1,
        staff_id: 'STF12001',
        staff_name: 'Dr. John Kamara',
        department: 'Computer Science',
        basic_salary: 100000,
        allowances: 25000,
        deductions: 15000,
        net_salary: 110000,
        month: 'March 2024',
        status: 'paid',
      },
      {
        id: 2,
        staff_id: 'STF12002',
        staff_name: 'Prof. Aminata Sesay',
        department: 'Mathematics',
        basic_salary: 175000,
        allowances: 40000,
        deductions: 25000,
        net_salary: 190000,
        month: 'March 2024',
        status: 'paid',
      },
      {
        id: 3,
        staff_id: 'STF12003',
        staff_name: 'Mr. Ibrahim Conteh',
        department: 'Finance',
        basic_salary: 60000,
        allowances: 15000,
        deductions: 8000,
        net_salary: 67000,
        month: 'March 2024',
        status: 'processed',
      },
    ];

    // Mock Performance Reviews
    const mockReviews: PerformanceReview[] = [
      {
        id: 1,
        staff_id: 'STF12001',
        staff_name: 'Dr. John Kamara',
        reviewer: 'Prof. Ahmed Hassan (HOD)',
        period: 'Jan-Dec 2023',
        rating: 4.5,
        strengths: 'Excellent teaching skills, strong research output',
        improvements: 'Could improve student engagement in online classes',
        status: 'completed',
      },
      {
        id: 2,
        staff_id: 'STF12003',
        staff_name: 'Mr. Ibrahim Conteh',
        reviewer: 'Dr. Sarah Williams (Finance Director)',
        period: 'Jan-Dec 2023',
        rating: 4.0,
        strengths: 'Accurate financial reporting, good time management',
        improvements: 'Should develop leadership skills for senior role',
        status: 'completed',
      },
    ];

    setPositions(mockPositions);
    setStaff(mockStaff);
    setLeaveRequests(mockLeaveRequests);
    setPayrollRecords(mockPayroll);
    setPerformanceReviews(mockReviews);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLE',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      on_leave: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      terminated: 'bg-gray-100 text-gray-800',
      pending: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      processed: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
      completed: 'bg-green-100 text-green-800',
      acknowledged: 'bg-teal-100 text-teal-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Overview Dashboard
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{staff.length}</p>
              <p className="text-xs text-green-600 mt-1">
                {staff.filter(s => s.status === 'active').length} active
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Positions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {positions.reduce((sum, p) => sum + p.vacancies, 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {positions.filter(p => p.status === 'active').length} active postings
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Leaves</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {leaveRequests.filter(l => l.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {leaveRequests.filter(l => l.status === 'approved').length} approved this month
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Payroll</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(payrollRecords.reduce((sum, p) => sum + p.net_salary, 0))}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {payrollRecords.filter(p => p.status === 'paid').length} of {payrollRecords.length} paid
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('staff')}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <UserPlus className="w-8 h-8 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Staff</span>
          </button>
          <button
            onClick={() => setActiveTab('leave')}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <Calendar className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Manage Leave</span>
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <DollarSign className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Process Payroll</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
          >
            <BarChart3 className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leave Requests</h3>
          <div className="space-y-3">
            {leaveRequests.slice(0, 3).map(leave => (
              <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{leave.staff_name}</p>
                  <p className="text-xs text-gray-600">{leave.leave_type} - {leave.days} days</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                  {leave.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
          <div className="space-y-3">
            {departments.slice(0, 5).map(dept => {
              const deptStaff = staff.filter(s => s.department === dept);
              return (
                <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{dept}</p>
                    <p className="text-xs text-gray-600">{deptStaff.length} staff members</p>
                  </div>
                  <Building2 className="w-5 h-5 text-gray-400" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // Staff Directory
  const renderStaff = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Upload className="w-5 h-5" />
              <span>Import</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <UserPlus className="w-5 h-5" />
              <span>Add Staff</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map(member => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {member.staff_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{member.name}</div>
                  <div className="text-xs text-gray-500">{member.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{member.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                    {member.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900" title="View">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900" title="Edit">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Leave Management
  const renderLeaveManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                {leaveRequests.filter(l => l.status === 'pending').length}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved This Month</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {leaveRequests.filter(l => l.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {leaveRequests.filter(l => l.status === 'rejected').length}
              </p>
            </div>
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Leave Requests</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaveRequests.map(leave => (
              <tr key={leave.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{leave.staff_name}</div>
                  <div className="text-xs text-gray-500">{leave.staff_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {leave.leave_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {leave.start_date} to {leave.end_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {leave.days} days
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {leave.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                    {leave.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {leave.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-900" title="Approve">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Reject">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Payroll Management
  const renderPayroll = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p className="text-sm font-medium text-gray-600">Total Payroll</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(payrollRecords.reduce((sum, p) => sum + p.net_salary, 0))}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-600">Paid</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {payrollRecords.filter(p => p.status === 'paid').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-600">Processed</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {payrollRecords.filter(p => p.status === 'processed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <p className="text-sm font-medium text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {payrollRecords.filter(p => p.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payroll Records - March 2024</h3>
          <div className="flex gap-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Send className="w-5 h-5" />
              <span>Process All</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payrollRecords.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{record.staff_name}</div>
                  <div className="text-xs text-gray-500">{record.staff_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(record.basic_salary)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  +{formatCurrency(record.allowances)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  -{formatCurrency(record.deductions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {formatCurrency(record.net_salary)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900" title="View Details">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="text-green-600 hover:text-green-900" title="Print Slip">
                      <Printer className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Performance Reviews
  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance Reviews</h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus className="w-5 h-5" />
            <span>New Review</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {performanceReviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{review.staff_name}</h4>
                    <p className="text-sm text-gray-600">{review.staff_id} • Reviewed by {review.reviewer}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-indigo-600">{review.rating}</span>
                  <span className="text-gray-400">/5.0</span>
                </div>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(review.status)}`}>
                  {review.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h5 className="text-sm font-semibold text-green-900 mb-2">Strengths</h5>
                <p className="text-sm text-green-700">{review.strengths}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h5 className="text-sm font-semibold text-orange-900 mb-2">Areas for Improvement</h5>
                <p className="text-sm text-orange-700">{review.improvements}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Review Period: {review.period}</span>
              <div className="flex space-x-2">
                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  View Full Report
                </button>
                <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Print
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Positions Management (similar to previous implementation but simplified for tabs)
  const renderPositions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Position Management</h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus className="w-5 h-5" />
            <span>Add Position</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-600">Total Positions</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{positions.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-600">Active Positions</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {positions.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <p className="text-sm font-medium text-gray-600">Total Vacancies</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">
            {positions.reduce((sum, p) => sum + p.vacancies, 0)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary Range</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vacancies</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {positions.map(position => (
              <tr key={position.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {position.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {position.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {position.grade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(position.salary_min)} - {formatCurrency(position.salary_max)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {position.vacancies}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(position.status)}`}>
                    {position.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900" title="Edit">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Reports Section
  const renderReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Staff Report</h4>
              <p className="text-sm text-gray-600">Complete staff directory</p>
            </div>
          </div>
          <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Payroll Report</h4>
              <p className="text-sm text-gray-600">Monthly payroll summary</p>
            </div>
          </div>
          <button className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Leave Report</h4>
              <p className="text-sm text-gray-600">Leave statistics</p>
            </div>
          </div>
          <button className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Performance Report</h4>
              <p className="text-sm text-gray-600">Staff performance analytics</p>
            </div>
          </div>
          <button className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Department Report</h4>
              <p className="text-sm text-gray-600">Department-wise analysis</p>
            </div>
          </div>
          <button className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Custom Report</h4>
              <p className="text-sm text-gray-600">Build your own report</p>
            </div>
          </div>
          <button className="mt-4 w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            Create Custom
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Human Resources Management</h1>
              <p className="mt-2 text-indigo-100">
                Comprehensive HR system for EBKUST - Manage staff, payroll, leave, and performance
              </p>
            
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-indigo-100">System Status</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'staff', label: 'Staff Directory', icon: Users },
                { id: 'positions', label: 'Positions', icon: Briefcase },
                { id: 'leave', label: 'Leave Management', icon: Calendar },
                { id: 'payroll', label: 'Payroll', icon: DollarSign },
                { id: 'performance', label: 'Performance', icon: Award },
                { id: 'reports', label: 'Reports', icon: BarChart3 },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'staff' && renderStaff()}
          {activeTab === 'positions' && renderPositions()}
          {activeTab === 'leave' && renderLeaveManagement()}
          {activeTab === 'payroll' && renderPayroll()}
          {activeTab === 'performance' && renderPerformance()}
          {activeTab === 'reports' && renderReports()}
        </div>
      </div>
    </DashboardLayout>
  );
}
