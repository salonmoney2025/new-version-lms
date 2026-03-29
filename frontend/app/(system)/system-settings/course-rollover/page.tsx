'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { RefreshCw, AlertCircle, CheckCircle, Building2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface Campus {
  id: number;
  name: string;
  code: string;
}

export default function CourseRolloverPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [formData, setFormData] = useState({
    source_semester: '',
    source_academic_year: '',
    target_semester: '',
    target_academic_year: '',
    campus_id: '',
    copy_instructors: true,
    copy_schedules: true,
    copy_rooms: false,
  });
  const [rolloverResult, setRolloverResult] = useState<any>(null);

  const semesters = [
    { value: 'FALL', label: 'Fall Semester' },
    { value: 'SPRING', label: 'Spring Semester' },
    { value: 'SUMMER', label: 'Summer Semester' },
  ];

  const currentYear = new Date().getFullYear();
  const academicYears = [
    `${currentYear - 2}-${currentYear - 1}`,
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`,
    `${currentYear + 1}-${currentYear + 2}`,
  ];

  useEffect(() => {
    fetchCampuses();
  }, []);

  const fetchCampuses = async () => {
    try {
      const response = await api.get('/campuses/');
      setCampuses(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching campuses:', error);
      toast.error('Failed to load campuses');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.source_semester === formData.target_semester &&
        formData.source_academic_year === formData.target_academic_year) {
      toast.error('Source and target semesters must be different');
      return;
    }

    if (!confirm(
      `Are you sure you want to rollover courses from ${formData.source_semester} ${formData.source_academic_year} to ${formData.target_semester} ${formData.target_academic_year}?\n\n` +
      `This will create new course offerings in the target semester.`
    )) {
      return;
    }

    setLoading(true);
    setRolloverResult(null);

    try {
      const payload: any = {
        source_semester: formData.source_semester,
        source_academic_year: formData.source_academic_year,
        target_semester: formData.target_semester,
        target_academic_year: formData.target_academic_year,
        copy_instructors: formData.copy_instructors,
        copy_schedules: formData.copy_schedules,
        copy_rooms: formData.copy_rooms,
      };

      if (formData.campus_id) {
        payload.campus_id = parseInt(formData.campus_id);
      }

      const response = await api.post('/courses/course-offerings/rollover/', payload);
      setRolloverResult(response.data);
      toast.success(response.data.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Rollover failed';
      toast.error(errorMessage);
      console.error('Error during rollover:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-portal-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <RefreshCw className="h-8 w-8 text-portal-teal-600" />
                Course Rollover
              </h1>
              <p className="mt-2 text-base text-gray-600">
                Copy course offerings from one semester to another
              </p>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">About Course Rollover</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Rollover creates copies of course offerings from one semester to another</li>
                <li>All course details (course code, credits, etc.) will be copied</li>
                <li>Enrollment counts will be reset to zero for the new semester</li>
                <li>You can choose whether to copy instructors, schedules, and room assignments</li>
                <li>The target semester must not already have course offerings</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Rollover Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Source Semester */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-portal-teal-600" />
                Source Semester (Copy From)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="source_semester"
                    value={formData.source_semester}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map(sem => (
                      <option key={sem.value} value={sem.value}>{sem.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="source_academic_year"
                    value={formData.source_academic_year}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Target Semester */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Target Semester (Copy To)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="target_semester"
                    value={formData.target_semester}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map(sem => (
                      <option key={sem.value} value={sem.value}>{sem.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="target_academic_year"
                    value={formData.target_academic_year}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-portal-teal-600" />
                Rollover Options
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campus (Optional)
                  </label>
                  <select
                    name="campus_id"
                    value={formData.campus_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                  >
                    <option value="">All Campuses</option>
                    {campuses.map(campus => (
                      <option key={campus.id} value={campus.id}>
                        {campus.name} ({campus.code})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Leave blank to rollover all campuses</p>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">What to copy:</h3>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="copy_instructors"
                      id="copy_instructors"
                      checked={formData.copy_instructors}
                      onChange={handleChange}
                      className="w-4 h-4 text-portal-teal-600 border-gray-300 rounded focus:ring-portal-teal-500"
                    />
                    <label htmlFor="copy_instructors" className="text-sm font-medium text-gray-700">
                      Copy Instructor Assignments
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="copy_schedules"
                      id="copy_schedules"
                      checked={formData.copy_schedules}
                      onChange={handleChange}
                      className="w-4 h-4 text-portal-teal-600 border-gray-300 rounded focus:ring-portal-teal-500"
                    />
                    <label htmlFor="copy_schedules" className="text-sm font-medium text-gray-700">
                      Copy Class Schedules
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="copy_rooms"
                      id="copy_rooms"
                      checked={formData.copy_rooms}
                      onChange={handleChange}
                      className="w-4 h-4 text-portal-teal-600 border-gray-300 rounded focus:ring-portal-teal-500"
                    />
                    <label htmlFor="copy_rooms" className="text-sm font-medium text-gray-700">
                      Copy Room Assignments
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Processing Rollover...' : 'Start Rollover'}
              </button>
            </div>
          </form>
        </div>

        {/* Rollover Result */}
        {rolloverResult && (
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-green-900 text-lg mb-2">Rollover Completed Successfully!</h3>
                <p className="text-green-800 mb-3">{rolloverResult.message}</p>
                <div className="bg-white p-4 rounded border border-green-200">
                  <p className="font-semibold text-gray-800">Summary:</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    <li>• <strong>{rolloverResult.count}</strong> course offerings created</li>
                    <li>• From: <strong>{formData.source_semester} {formData.source_academic_year}</strong></li>
                    <li>• To: <strong>{formData.target_semester} {formData.target_academic_year}</strong></li>
                    {formData.campus_id && (
                      <li>• Campus: <strong>{campuses.find(c => c.id.toString() === formData.campus_id)?.name}</strong></li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
