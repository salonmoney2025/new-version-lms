'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  Award,
  BookOpen,
  Building2,
  Clock,
  Eye,
  Filter,
  GraduationCap,
  Home,
  RefreshCw,
  Search,
  Users
} from 'lucide-react';
import Link from 'next/link';
interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  department: string;
  faculty: string;
  level: string;
  semester: string;
  creditHours: number;
  courseType: string;
  lecturer: string;
  enrolledStudents: number;
  maxCapacity: number;
  status: 'active' | 'inactive';
  description: string;
}

export default function CoursesReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [courseTypeFilter, setCourseTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const courses: Course[] = [
    {
      id: 1,
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      department: 'Computer Science',
      faculty: 'Faculty of Basic Sciences',
      level: 'Year 1',
      semester: 'Semester 1',
      creditHours: 3,
      courseType: 'Core',
      lecturer: 'Dr. Samuel Kargbo',
      enrolledStudents: 89,
      maxCapacity: 100,
      status: 'active',
      description: 'Fundamental concepts of computer science and programming',
    },
    {
      id: 2,
      courseCode: 'MATH201',
      courseName: 'Calculus II',
      department: 'Mathematics',
      faculty: 'Faculty of Basic Sciences',
      level: 'Year 2',
      semester: 'Semester 1',
      creditHours: 4,
      courseType: 'Core',
      lecturer: 'Prof. Mary Williams',
      enrolledStudents: 67,
      maxCapacity: 80,
      status: 'active',
      description: 'Advanced calculus including integration and differential equations',
    },
    {
      id: 3,
      courseCode: 'CE301',
      courseName: 'Structural Analysis',
      department: 'Civil Engineering',
      faculty: 'Faculty of Engineering',
      level: 'Year 3',
      semester: 'Semester 1',
      creditHours: 4,
      courseType: 'Core',
      lecturer: 'Dr. Ibrahim Conteh',
      enrolledStudents: 54,
      maxCapacity: 60,
      status: 'active',
      description: 'Analysis of structures under various loading conditions',
    },
    {
      id: 4,
      courseCode: 'EE202',
      courseName: 'Circuit Theory',
      department: 'Electrical Engineering',
      faculty: 'Faculty of Engineering',
      level: 'Year 2',
      semester: 'Semester 2',
      creditHours: 3,
      courseType: 'Core',
      lecturer: 'Prof. Fatmata Sesay',
      enrolledStudents: 72,
      maxCapacity: 75,
      status: 'active',
      description: 'Principles of electrical circuits and network analysis',
    },
    {
      id: 5,
      courseCode: 'BA101',
      courseName: 'Principles of Management',
      department: 'Business Administration',
      faculty: 'Faculty of Business Administration',
      level: 'Year 1',
      semester: 'Semester 1',
      creditHours: 3,
      courseType: 'Core',
      lecturer: 'Dr. Joseph Koroma',
      enrolledStudents: 95,
      maxCapacity: 100,
      status: 'active',
      description: 'Fundamentals of business management and organizational behavior',
    },
    {
      id: 6,
      courseCode: 'ACC301',
      courseName: 'Advanced Financial Accounting',
      department: 'Accounting and Finance',
      faculty: 'Faculty of Business Administration',
      level: 'Year 3',
      semester: 'Semester 1',
      creditHours: 4,
      courseType: 'Core',
      lecturer: 'Dr. Aminata Bangura',
      enrolledStudents: 48,
      maxCapacity: 50,
      status: 'active',
      description: 'Advanced accounting principles and financial statement analysis',
    },
  ];

  const stats = {
    totalCourses: 247,
    activeCourses: 235,
    totalEnrollments: 8956,
    averageEnrollment: 36,
  };

  const faculties = ['All', 'Faculty of Basic Sciences', 'Faculty of Engineering', 'Faculty of Business Administration'];
  const levels = ['All', 'Year 1', 'Year 2', 'Year 3', 'Year 4'];
  const semesters = ['All', 'Semester 1', 'Semester 2'];
  const courseTypes = ['All', 'Core', 'Elective', 'General'];

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getCourseTypeBadge = (type: string) => {
    const badges: { [key: string]: string } = {
      'Core': 'bg-blue-100 text-blue-800',
      'Elective': 'bg-purple-100 text-purple-800',
      'General': 'bg-gray-100 text-gray-800',
    };
    return badges[type] || 'bg-gray-100 text-gray-800';
  };

  const getEnrollmentPercentage = (enrolled: number, max: number) => {
    return Math.round((enrolled / max) * 100);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.lecturer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = facultyFilter === 'All' || course.faculty === facultyFilter;
    const matchesLevel = levelFilter === 'All' || course.level === levelFilter;
    const matchesSemester = semesterFilter === 'All' || course.semester === semesterFilter;
    const matchesType = courseTypeFilter === 'All' || course.courseType === courseTypeFilter;

    return matchesSearch && matchesFaculty && matchesLevel && matchesSemester && matchesType;
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
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
              <h1 className="text-3xl font-bold text-gray-900">View Courses</h1>
              <p className="mt-2 text-base text-gray-600">
                Complete catalog of all courses offered across the university
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
              <ExportMenu data={filteredCourses} filename="courses-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Courses</p>
                <p className="text-4xl font-bold mt-2">{stats.totalCourses}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <BookOpen className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Active Courses</p>
                <p className="text-4xl font-bold mt-2">{stats.activeCourses}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <GraduationCap className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Total Enrollments</p>
                <p className="text-4xl font-bold mt-2">{stats.totalEnrollments.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Users className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Avg Enrollment</p>
                <p className="text-4xl font-bold mt-2">{stats.averageEnrollment}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Award className="h-10 w-10" />
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
                  placeholder="Search courses..."
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
              <select
                value={courseTypeFilter}
                onChange={(e) => setCourseTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {courseTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Course Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Course Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Department/Faculty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Level/Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Lecturer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Enrollment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCourses.map((course) => {
                  const enrollmentPercent = getEnrollmentPercentage(course.enrolledStudents, course.maxCapacity);
                  return (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">{course.courseCode}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                        <div className="text-sm text-gray-500">{course.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{course.department}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                          {course.faculty}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{course.level}</div>
                        <div className="text-sm text-gray-500">{course.semester}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="text-sm font-bold text-gray-900">{course.creditHours}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCourseTypeBadge(course.courseType)}`}>
                          {course.courseType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{course.lecturer}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{course.enrolledStudents}/{course.maxCapacity}</span>
                            <span>{enrollmentPercent}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                enrollmentPercent >= 90 ? 'bg-red-500' : enrollmentPercent >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${enrollmentPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(course.status)}`}>
                          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPageedCourses.length)}</span> of{' '}
              <span className="font-medium">{filteredCourses.length}</span> results
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
