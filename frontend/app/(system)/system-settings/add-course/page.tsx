'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { BookOpen, Save, X, Building2, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

interface Campus {
  id: number;
  name: string;
  code: string;
}

interface Department {
  id: number;
  name: string;
  code: string;
  campus: number;
  campus_name: string;
}

export default function AddCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    campus: '',
    department: '',
    credits: '3',
    description: '',
    syllabus: '',
    is_elective: false,
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.campus) {
      const filtered = departments.filter(dept => dept.campus.toString() === formData.campus);
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments([]);
    }
  }, [formData.campus, departments]);

  const fetchData = async () => {
    try {
      const [campusesRes, departmentsRes] = await Promise.all([
        api.get('/campuses/'),
        api.get('/campuses/departments/')
      ]);
      setCampuses(campusesRes.data.results || campusesRes.data);
      setDepartments(departmentsRes.data.results || departmentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/courses/courses/', formData);
      toast.success('Course added successfully!');
      router.push('/courses/manage');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.code?.[0] || 'Failed to add course';
      toast.error(errorMessage);
      console.error('Error adding course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      code: '',
      title: '',
      campus: '',
      department: '',
      credits: '3',
      description: '',
      syllabus: '',
      is_elective: false,
      is_active: true,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-portal-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-portal-teal-600" />
                Add New Course
              </h1>
              <p className="mt-2 text-base text-gray-600">
                Create a new course for the university system
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent uppercase"
                    placeholder="e.g., CS101"
                    maxLength={20}
                  />
                  <p className="mt-1 text-xs text-gray-500">Unique course identifier</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                    placeholder="e.g., Introduction to Programming"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Hours <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    required
                    min="1"
                    max="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-6 pt-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="is_elective"
                      id="is_elective"
                      checked={formData.is_elective}
                      onChange={handleChange}
                      className="w-4 h-4 text-portal-teal-600 border-gray-300 rounded focus:ring-portal-teal-500"
                    />
                    <label htmlFor="is_elective" className="text-sm font-medium text-gray-700">
                      Elective Course
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="is_active"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="w-4 h-4 text-portal-teal-600 border-gray-300 rounded focus:ring-portal-teal-500"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                      Course is active
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-portal-teal-600" />
                Campus & Department
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campus <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="campus"
                    value={formData.campus}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                  >
                    <option value="">Select Campus</option>
                    {campuses.map(campus => (
                      <option key={campus.id} value={campus.id}>
                        {campus.name} ({campus.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    disabled={!formData.campus}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select Department</option>
                    {filteredDepartments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                  {!formData.campus && (
                    <p className="mt-1 text-xs text-gray-500">Please select a campus first</p>
                  )}
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Course Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                    placeholder="Brief description of the course objectives and content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Syllabus
                  </label>
                  <textarea
                    name="syllabus"
                    value={formData.syllabus}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent"
                    placeholder="Detailed syllabus including topics, learning outcomes, and assessment methods"
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional: Detailed course syllabus</p>
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
                <Save className="h-5 w-5" />
                {loading ? 'Saving...' : 'Save Course'}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium transition-colors"
              >
                <X className="h-5 w-5" />
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
