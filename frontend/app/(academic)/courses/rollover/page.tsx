'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Copy,
  Home,
  LayoutDashboard,
  RefreshCw,
  XCircle
} from 'lucide-react';

interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  department: string;
  level: string;
  semester: string;
  credits: number;
  lecturer: string;
  selected: boolean;
}

export default function CourseRolloverPage() {
  const router = useRouter();
  const [sourceYear, setSourceYear] = useState('2024/2025');
  const [targetYear, setTargetYear] = useState('2025/2026');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      faculty: 'Engineering',
      department: 'Computer Science',
      level: '100',
      semester: 'First Semester',
      credits: 3,
      lecturer: 'Dr. James Koroma',
      selected: false
    },
    {
      id: '2',
      courseCode: 'CS102',
      courseName: 'Programming Fundamentals',
      faculty: 'Engineering',
      department: 'Computer Science',
      level: '100',
      semester: 'First Semester',
      credits: 4,
      lecturer: 'Prof. Sarah Bangura',
      selected: false
    },
    {
      id: '3',
      courseCode: 'BA201',
      courseName: 'Business Management',
      faculty: 'Business',
      department: 'Business Administration',
      level: '200',
      semester: 'First Semester',
      credits: 3,
      lecturer: 'Dr. Mohamed Sesay',
      selected: false
    },
    {
      id: '4',
      courseCode: 'CE301',
      courseName: 'Structural Engineering',
      faculty: 'Engineering',
      department: 'Civil Engineering',
      level: '300',
      semester: 'Second Semester',
      credits: 4,
      lecturer: 'Eng. Aminata Kamara',
      selected: false
    },
    {
      id: '5',
      courseCode: 'MD401',
      courseName: 'Clinical Medicine',
      faculty: 'Medical Sciences',
      department: 'Medicine',
      level: '400',
      semester: 'First Semester',
      credits: 5,
      lecturer: 'Dr. Ibrahim Conteh',
      selected: false
    }
  ]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rolloverProgress, setRolloverProgress] = useState<{
    isRunning: boolean;
    current: number;
    total: number;
    completed: string[];
    failed: string[];
  }>({
    isRunning: false,
    current: 0,
    total: 0,
    completed: [],
    failed: []
  });

  // Memoized filtering for performance - must be defined before callbacks that use it
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesFaculty = selectedFaculty === 'all' || course.faculty === selectedFaculty;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      return matchesFaculty && matchesLevel;
    });
  }, [courses, selectedFaculty, selectedLevel]);

  const selectedCount = useMemo(() => {
    return courses.filter(c => c.selected).length;
  }, [courses]);

  const handleRefresh = useCallback(() => {
    console.log('Refreshing data...');
  }, []);

  const handleSelectAll = useCallback(() => {
    const allSelected = filteredCourses.every(c => c.selected);
    setCourses(prevCourses => prevCourses.map(course => {
      if (filteredCourses.find(fc => fc.id === course.id)) {
        return { ...course, selected: !allSelected };
      }
      return course;
    }));
  }, [filteredCourses]);

  const handleSelectCourse = useCallback((id: string) => {
    setCourses(prevCourses => prevCourses.map(course =>
      course.id === id ? { ...course, selected: !course.selected } : course
    ));
  }, []);

  const handleStartRollover = () => {
    const selectedCourses = courses.filter(c => c.selected);
    if (selectedCourses.length === 0) {
      alert('Please select at least one course to rollover.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmRollover = () => {
    const selectedCourses = courses.filter(c => c.selected);
    setShowConfirmModal(false);

    // Simulate rollover process
    setRolloverProgress({
      isRunning: true,
      current: 0,
      total: selectedCourses.length,
      completed: [],
      failed: []
    });

    // Simulate async rollover
    let current = 0;
    const interval = setInterval(() => {
      current++;
      const course = selectedCourses[current - 1];

      // Randomly simulate success/failure (90% success rate)
      const success = Math.random() > 0.1;

      setRolloverProgress(prev => ({
        ...prev,
        current,
        completed: success ? [...prev.completed, course.courseCode] : prev.completed,
        failed: success ? prev.failed : [...prev.failed, course.courseCode]
      }));

      if (current >= selectedCourses.length) {
        clearInterval(interval);
        setRolloverProgress(prev => ({ ...prev, isRunning: false }));

        // Clear selections after completion
        setCourses(courses.map(c => ({ ...c, selected: false })));
      }
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Action Buttons Bar */}
        <div className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
            >
              <Home className="h-4 w-4" />
              HOME
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              DASHBOARD
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              REFRESH
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-portal-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Course Rollover</h1>
              <p className="mt-2 text-base text-gray-600">
                Copy courses from one academic year to the next
              </p>
            </div>
            <div className="flex gap-3">
              <ExportMenu data={courses} filename="courses" />
            </div>
          </div>
        </div>

        {/* Rollover Progress */}
        {(rolloverProgress.isRunning || rolloverProgress.completed.length > 0 || rolloverProgress.failed.length > 0) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Rollover Progress</h3>

            {rolloverProgress.isRunning && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Processing: {rolloverProgress.current} of {rolloverProgress.total} courses
                  </span>
                  <span className="text-sm font-medium text-portal-teal-600">
                    {Math.round((rolloverProgress.current / rolloverProgress.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-portal-teal-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(rolloverProgress.current / rolloverProgress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rolloverProgress.completed.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-bold text-green-900">Successfully Rolled Over ({rolloverProgress.completed.length})</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rolloverProgress.completed.map(code => (
                      <span key={code} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {rolloverProgress.failed.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <h4 className="font-bold text-red-900">Failed ({rolloverProgress.failed.length})</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rolloverProgress.failed.map(code => (
                      <span key={code} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Academic Year Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Select Academic Years</h3>

          <div className="flex items-center gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Year (Copy From)
              </label>
              <select
                value={sourceYear}
                onChange={(e) => setSourceYear(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
              >
                <option>2024/2025</option>
                <option>2023/2024</option>
                <option>2022/2023</option>
              </select>
            </div>

            <div className="flex items-center justify-center pt-6">
              <ArrowRight className="h-8 w-8 text-portal-teal-500" />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Year (Copy To)
              </label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
              >
                <option>2025/2026</option>
                <option>2024/2025</option>
                <option>2023/2024</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Filters */}
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faculty
                </label>
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                >
                  <option value="all">All Faculties</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Medical Sciences">Medical Sciences</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-portal-teal-500"
                >
                  <option value="all">All Levels</option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                {filteredCourses.every(c => c.selected) ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={handleStartRollover}
                disabled={selectedCount === 0 || rolloverProgress.isRunning}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCount === 0 || rolloverProgress.isRunning
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-portal-teal-600 hover:bg-portal-teal-700 text-white'
                }`}
              >
                <Copy className="h-4 w-4" />
                Rollover Selected ({selectedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-gray-400">
                  <th className="px-6 py-3 text-left border-r border-gray-300">
                    <input
                      type="checkbox"
                      checked={filteredCourses.length > 0 && filteredCourses.every(c => c.selected)}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-portal-teal-600 rounded focus:ring-portal-teal-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Faculty
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase border-r border-gray-300">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase">
                    Lecturer
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border-r border-gray-200">
                      <input
                        type="checkbox"
                        checked={course.selected}
                        onChange={() => handleSelectCourse(course.id)}
                        className="w-4 h-4 text-portal-teal-600 rounded focus:ring-portal-teal-500"
                      />
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">{course.courseCode}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-900">{course.courseName}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">{course.faculty}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">{course.level}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm text-gray-600">{course.semester}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-900">{course.credits}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{course.lecturer}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No courses found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowConfirmModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-portal-teal-600 to-portal-teal-700 text-white p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Copy className="h-6 w-6" />
                    <h2 className="text-2xl font-bold">Confirm Course Rollover</h2>
                  </div>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      You are about to rollover <strong>{selectedCount} courses</strong> from{' '}
                      <strong>{sourceYear}</strong> to <strong>{targetYear}</strong>.
                    </p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-bold text-gray-800 mb-2">Selected Courses:</h4>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      <div className="space-y-1">
                        {courses.filter(c => c.selected).map(course => (
                          <div key={course.id} className="text-sm text-gray-700">
                            <strong>{course.courseCode}</strong> - {course.courseName}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> This action will copy the selected courses to the target academic year.
                          Course codes, names, credits, and lecturer assignments will be duplicated.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRollover}
                    className="flex items-center gap-2 px-4 py-2 bg-portal-teal-600 hover:bg-portal-teal-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Start Rollover
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
