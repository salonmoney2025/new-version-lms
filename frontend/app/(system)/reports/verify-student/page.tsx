'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  CreditCard,
  Home,
  Search,
  User,
  UserCheck,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
interface StudentVerification {
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  faculty: string;
  program: string;
  level: string;
  enrollmentYear: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  feesStatus: 'paid' | 'partial' | 'unpaid';
  gpa: number;
  campus: string;
  photoUrl?: string;
}

export default function VerifyStudentReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('studentId');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<StudentVerification | null>(null);
  const [searchError, setSearchError] = useState('');

  // Mock verification function - replace with API call
  const verifyStudent = () => {
    setIsSearching(true);
    setSearchError('');
    setSearchResult(null);

    // Simulate API call
    setTimeout(() => {
      if (searchTerm.toLowerCase() === 'stu-2024-001' || searchTerm.toLowerCase() === 'mohamed kamara') {
        setSearchResult({
          studentId: 'STU-2024-001',
          fullName: 'Mohamed Kamara',
          email: 'mkamara@ebkust.edu.sl',
          phone: '+232 76 123 456',
          faculty: 'Faculty of Basic Sciences',
          program: 'BSc Computer Science',
          level: 'Year 2',
          enrollmentYear: '2024',
          status: 'active',
          feesStatus: 'paid',
          gpa: 3.45,
          campus: 'Main Campus',
        });
      } else if (searchTerm) {
        setSearchError('Student not found. Please check the ID/Name and try again.');
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      verifyStudent();
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
      graduated: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      suspended: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  const getFeesStatusBadge = (status: string) => {
    const badges = {
      paid: { color: 'bg-green-100 text-green-800', text: 'Fully Paid' },
      partial: { color: 'bg-yellow-100 text-yellow-800', text: 'Partially Paid' },
      unpaid: { color: 'bg-red-100 text-red-800', text: 'Unpaid' },
    };
    return badges[status as keyof typeof badges] || badges.unpaid;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Verify Student</h1>
              <p className="mt-2 text-base text-gray-600">
                Verify student enrollment status and information
              </p>
            
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <UserCheck className="h-10 w-10 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Student Verification System
            </h2>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search By
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="studentId">Student ID</option>
                  <option value="name">Full Name</option>
                  <option value="email">Email Address</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {searchType === 'studentId' && 'Enter Student ID'}
                  {searchType === 'name' && 'Enter Full Name'}
                  {searchType === 'email' && 'Enter Email Address'}
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      searchType === 'studentId' ? 'e.g., STU-2024-001' :
                      searchType === 'name' ? 'e.g., Mohamed Kamara' :
                      'e.g., student@ebkust.edu.sl'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSearching || !searchTerm.trim()}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5" />
                    <span>Verify Student</span>
                  </>
                )}
              </button>
            </form>

            {/* Search Error */}
            {searchError && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <p className="text-red-800">{searchError}</p>
                </div>
              </div>
            )}

            {/* Demo Info */}
            {!searchResult && !searchError && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Demo Mode</p>
                    <p>Try searching for: <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">STU-2024-001</span> or <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">Mohamed Kamara</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verification Result */}
        {searchResult && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <div className="flex items-center justify-center space-x-3 text-white">
                <CheckCircle className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Student Verified Successfully</h2>
              </div>
            </div>

            {/* Student Information */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Student ID:</span>
                        <span className="font-semibold text-gray-900">{searchResult.studentId}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-semibold text-gray-900">{searchResult.fullName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold text-gray-900">{searchResult.email}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-semibold text-gray-900">{searchResult.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                      Academic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Faculty:</span>
                        <span className="font-semibold text-gray-900">{searchResult.faculty}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Program:</span>
                        <span className="font-semibold text-gray-900">{searchResult.program}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Level:</span>
                        <span className="font-semibold text-gray-900">{searchResult.level}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Campus:</span>
                        <span className="font-semibold text-gray-900">{searchResult.campus}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Enrollment Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Enrollment Year:</span>
                        <span className="font-semibold text-gray-900">{searchResult.enrollmentYear}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(searchResult.status).color}`}>
                          {searchResult.status.charAt(0).toUpperCase() + searchResult.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">GPA:</span>
                        <span className="font-semibold text-gray-900">{searchResult.gpa.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                      Financial Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Fees Status:</span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getFeesStatusBadge(searchResult.feesStatus).color}`}>
                          {getFeesStatusBadge(searchResult.feesStatus).text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-green-900 mb-2">Verified Student</h4>
                    <p className="text-sm text-green-700">
                      This student is currently enrolled and in good standing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setSearchResult(null);
                    setSearchTerm('');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Verify Another Student
                </button>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  Print Verification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
