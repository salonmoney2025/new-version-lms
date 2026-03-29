'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  BookOpen,
  Building2,
  Clock,
  Eye,
  Filter,
  GraduationCap,
  Home,
  RefreshCw,
  Search,
  User,
  Users
} from 'lucide-react';
import Link from 'next/link';
interface ModuleAssignment {
  id: number;
  courseCode: string;
  courseName: string;
  faculty: string;
  department: string;
  level: string;
  semester: string;
  creditHours: number;
  lecturerName: string;
  lecturerId: string;
  lecturerEmail: string;
  lecturerPhone: string;
  assignmentDate: string;
  academicYear: string;
  enrolledStudents: number;
  classSchedule: string;
  venue: string;
  status: 'active' | 'completed' | 'pending';
}

export default function ModuleAssignmentsReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const moduleAssignments: ModuleAssignment[] = [
    {
      id: 1,
      courseCode: 'CS301',
      courseName: 'Data Structures and Algorithms',
      faculty: 'Faculty of Basic Sciences',
      department: 'Computer Science',
      level: 'Year 3',
      semester: 'Semester 1',
      creditHours: 4,
      lecturerName: 'Dr. Samuel Kargbo',
      lecturerId: 'LEC-001',
      lecturerEmail: 'skargbo@ebkust.edu.sl',
      lecturerPhone: '+232 76 111 222',
      assignmentDate: '2025-09-01',
      academicYear: '2025/2026',
      enrolledStudents: 78,
      classSchedule: 'Mon 9:00-11:00, Wed 14:00-16:00',
      venue: 'CS Lab 1',
      status: 'active',
    },
    {
      id: 2,
      courseCode: 'CE401',
      courseName: 'Structural Design',
      faculty: 'Faculty of Engineering',
      department: 'Civil Engineering',
      level: 'Year 4',
      semester: 'Semester 1',
      creditHours: 4,
      lecturerName: 'Prof. Mary Williams',
      lecturerId: 'LEC-002',
      lecturerEmail: 'mwilliams@ebkust.edu.sl',
      lecturerPhone: '+232 77 222 333',
      assignmentDate: '2025-09-01',
      academicYear: '2025/2026',
      enrolledStudents: 54,
      classSchedule: 'Tue 10:00-12:00, Thu 13:00-15:00',
      venue: 'Engineering Hall A',
      status: 'active',
    },
    {
      id: 3,
      courseCode: 'BA201',
      courseName: 'Financial Accounting',
      faculty: 'Faculty of Business Administration',
      department: 'Accounting',
      level: 'Year 2',
      semester: 'Semester 1',
      creditHours: 3,
      lecturerName: 'Dr. Ibrahim Conteh',
      lecturerId: 'LEC-003',
      lecturerEmail: 'iconteh@ebkust.edu.sl',
      lecturerPhone: '+232 78 333 444',
      assignmentDate: '2025-09-01',
      academicYear: '2025/2026',
      enrolledStudents: 92,
      classSchedule: 'Mon 14:00-17:00',
      venue: 'Business Hall 201',
      status: 'active',
    },
    {
      id: 4,
      courseCode: 'MATH101',
      courseName: 'Calculus I',
      faculty: 'Faculty of Basic Sciences',
      department: 'Mathematics',
      level: 'Year 1',
      semester: 'Semester 1',
      creditHours: 4,
      lecturerName: 'Dr. Fatmata Sesay',
      lecturerId: 'LEC-004',
      lecturerEmail: 'fsesay@ebkust.edu.sl',
      lecturerPhone: '+232 79 444 555',
      assignmentDate: '2025-09-01',
      academicYear: '2025/2026',
      enrolledStudents: 145,
      classSchedule: 'Tue 8:00-10:00, Thu 8:00-10:00',
      venue: 'Lecture Hall 3',
      status: 'active',
    },
    {
      id: 5,
      courseCode: 'EE302',
      courseName: 'Power Systems',
      faculty: 'Faculty of Engineering',
      department: 'Electrical Engineering',
      level: 'Year 3',
      semester: 'Semester 2',
      creditHours: 4,
      lecturerName: 'Prof. Joseph Koroma',
      lecturerId: 'LEC-005',
      lecturerEmail: 'jkoroma@ebkust.edu.sl',
      lecturerPhone: '+232 76 555 666',
      assignmentDate: '2026-01-15',
      academicYear: '2025/2026',
      enrolledStudents: 0,
      classSchedule: 'TBD',
      venue: 'TBD',
      status: 'pending',
    },
  ];

  const stats = {
    totalAssignments: 247,
    activeAssignments: 235,
    totalLecturers: 89,
    totalEnrollments: 8956,
  };

  const faculties = ['All', 'Faculty of Basic Sciences', 'Faculty of Engineering', 'Faculty of Business Administration'];
  const levels = ['All', 'Year 1', 'Year 2', 'Year 3', 'Year 4'];
  const semesters = ['All', 'Semester 1', 'Semester 2'];
  const statuses = ['All', 'Active', 'Completed', 'Pending'];

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  const filteredAssignments = moduleAssignments.filter((assignment) => {
    const matchesSearch =
      assignment.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.lecturerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = facultyFilter === 'All' || assignment.faculty === facultyFilter;
    const matchesLevel = levelFilter === 'All' || assignment.level === levelFilter;
    const matchesSemester = semesterFilter === 'All' || assignment.semester === semesterFilter;
    const matchesStatus = statusFilter === 'All' || assignment.status === statusFilter.toLowerCase();

    return matchesSearch && matchesFaculty && matchesLevel && matchesSemester && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">View Module Assignments</h1>
              <p className="mt-2 text-base text-gray-600">
                Track all course-to-lecturer assignments and teaching schedules
              </p>
            
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <ExportMenu data={filteredAssignments} filename="module-assignments-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Assignments</p>
                <p className="text-4xl font-bold mt-2">{stats.totalAssignments}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <BookOpen className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Active</p>
                <p className="text-4xl font-bold mt-2">{stats.activeAssignments}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Clock className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Total Lecturers</p>
                <p className="text-4xl font-bold mt-2">{stats.totalLecturers}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Users className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Total Enrollments</p>
                <p className="text-4xl font-bold mt-2">{stats.totalEnrollments.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <GraduationCap className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Faculty</label>
              <select
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {faculties.map((faculty) => (
                  <option key={faculty} value={faculty}>{faculty}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Faculty/Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Level/Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Assigned Lecturer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-blue-600">{assignment.courseCode}</div>
                      <div className="text-sm text-gray-900">{assignment.courseName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                        {assignment.faculty}
                      </div>
                      <div className="text-sm text-gray-500">{assignment.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{assignment.level}</div>
                      <div className="text-sm text-gray-500">{assignment.semester}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-bold text-gray-900">{assignment.creditHours}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{assignment.lecturerName}</div>
                          <div className="text-sm text-gray-500">{assignment.lecturerId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900 mb-1">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {assignment.classSchedule}
                      </div>
                      <div className="text-sm text-gray-500">{assignment.venue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-bold text-purple-600">{assignment.enrolledStudents}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(assignment.status)}`}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPageedAssignments.length)}</span> of{' '}
              <span className="font-medium">{filteredAssignments.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
