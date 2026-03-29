'use client';

import { useState } from 'react';
import {
  FileText,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  FileCheck,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface Application {
  applicationId: string;
  applicationDate: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Incomplete';

  // Personal Information
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  nationality: string;
  email: string;
  phone: string;
  alternatePhone?: string;

  // Address
  permanentAddress: string;
  city: string;
  district: string;
  country: string;

  // Academic Information
  programApplied: string;
  faculty: string;
  entryLevel: 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Certificate';
  previousSchool: string;
  previousQualification: string;
  yearCompleted: string;
  aggregateScore?: string;

  // Guardian Information
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail?: string;

  // Documents
  documents: {
    name: string;
    status: 'Uploaded' | 'Pending' | 'Verified' | 'Rejected';
    uploadedDate?: string;
  }[];

  // Payment
  applicationFee: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
  paymentDate?: string;
  receiptNumber?: string;

  // Additional
  specialNeeds?: string;
  remarks?: string;
  reviewedBy?: string;
  reviewDate?: string;
}

export default function ViewApplicationDetailsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'email' | 'phone'>('id');
  const [application, setApplication] = useState<Application | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Sample application data
  const sampleApplications: Application[] = [
    {
      applicationId: 'APP-2025-00123',
      applicationDate: '2025-03-10 10:30 AM',
      status: 'Under Review',
      firstName: 'Mohamed',
      middleName: 'Ali',
      lastName: 'Kamara',
      dateOfBirth: '2005-05-15',
      gender: 'Male',
      nationality: 'Sierra Leonean',
      email: 'mkamara@example.com',
      phone: '+232 76 123 456',
      alternatePhone: '+232 88 654 321',
      permanentAddress: '25 Main Street, Congo Cross',
      city: 'Freetown',
      district: 'Western Area Urban',
      country: 'Sierra Leone',
      programApplied: 'BSc Computer Science',
      faculty: 'Faculty of Engineering and Technology',
      entryLevel: 'Undergraduate',
      previousSchool: 'Freetown Secondary School',
      previousQualification: 'WASSCE',
      yearCompleted: '2024',
      aggregateScore: '12',
      guardianName: 'Hawa Kamara',
      guardianRelationship: 'Mother',
      guardianPhone: '+232 77 987 654',
      guardianEmail: 'hkamara@example.com',
      documents: [
        { name: 'Birth Certificate', status: 'Verified', uploadedDate: '2025-03-10' },
        { name: 'WASSCE Certificate', status: 'Verified', uploadedDate: '2025-03-10' },
        { name: 'Passport Photo', status: 'Verified', uploadedDate: '2025-03-10' },
        { name: 'Recommendation Letter', status: 'Uploaded', uploadedDate: '2025-03-11' },
      ],
      applicationFee: 500000,
      paymentStatus: 'Paid',
      paymentDate: '2025-03-10',
      receiptNumber: 'RCP-2025-00789',
      specialNeeds: 'None',
      remarks: 'Strong academic background. All documents verified.',
      reviewedBy: 'Admin Staff',
      reviewDate: '2025-03-12',
    },
    {
      applicationId: 'APP-2025-00124',
      applicationDate: '2025-03-11 02:15 PM',
      status: 'Approved',
      firstName: 'Fatmata',
      middleName: 'Marie',
      lastName: 'Sesay',
      dateOfBirth: '2004-08-22',
      gender: 'Female',
      nationality: 'Sierra Leonean',
      email: 'fsesay@example.com',
      phone: '+232 79 234 567',
      permanentAddress: '12 Wilkinson Road, Bo',
      city: 'Bo',
      district: 'Bo District',
      country: 'Sierra Leone',
      programApplied: 'BSc Nursing',
      faculty: 'Faculty of Health Sciences',
      entryLevel: 'Undergraduate',
      previousSchool: 'Bo Government Secondary School',
      previousQualification: 'WASSCE',
      yearCompleted: '2023',
      aggregateScore: '10',
      guardianName: 'Ibrahim Sesay',
      guardianRelationship: 'Father',
      guardianPhone: '+232 76 345 678',
      documents: [
        { name: 'Birth Certificate', status: 'Verified', uploadedDate: '2025-03-11' },
        { name: 'WASSCE Certificate', status: 'Verified', uploadedDate: '2025-03-11' },
        { name: 'Passport Photo', status: 'Verified', uploadedDate: '2025-03-11' },
        { name: 'Medical Certificate', status: 'Verified', uploadedDate: '2025-03-11' },
      ],
      applicationFee: 500000,
      paymentStatus: 'Paid',
      paymentDate: '2025-03-11',
      receiptNumber: 'RCP-2025-00790',
      remarks: 'Excellent candidate. Admission approved.',
      reviewedBy: 'Faculty Dean',
      reviewDate: '2025-03-13',
    },
  ];

  const handleSearch = () => {
    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      const found = sampleApplications.find((app) => {
        if (searchType === 'id') return app.applicationId.toLowerCase().includes(searchQuery.toLowerCase());
        if (searchType === 'email') return app.email.toLowerCase().includes(searchQuery.toLowerCase());
        if (searchType === 'phone') return app.phone.includes(searchQuery);
        return false;
      });

      setApplication(found || null);
      setIsSearching(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800  text-green-600';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800  text-yellow-600';
      case 'Pending':
        return 'bg-blue-100 text-blue-800  text-blue-600';
      case 'Rejected':
        return 'bg-red-100 text-red-800  text-red-600';
      case 'Incomplete':
        return 'bg-gray-100 text-gray-800 bg-white text-black';
      default:
        return 'bg-gray-100 text-gray-800 bg-white text-black';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'text-green-600 text-green-600';
      case 'Uploaded':
        return 'text-blue-600 text-blue-600';
      case 'Rejected':
        return 'text-red-600 text-red-600';
      default:
        return 'text-gray-600 text-black';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/help-desk"
          className="inline-flex items-center space-x-2 text-portal-teal-600 text-portal-teal-600 hover:text-portal-teal-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Help Desk</span>
        </Link>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-portal-teal-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-portal-teal-600 text-portal-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 text-black">View Application Details</h1>
            <p className="text-sm text-gray-500 text-black">
              Search and view student application information
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 text-black mb-4">Search Application</h2>
        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 text-black mb-2">
              Search By
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'id' | 'email' | 'phone')}
              className="w-full px-4 py-2 border border-gray-300 border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent bg-white text-black"
            >
              <option value="id">Application ID</option>
              <option value="email">Email Address</option>
              <option value="phone">Phone Number</option>
            </select>
          </div>
          <div className="flex-[2]">
            <label className="block text-sm font-medium text-gray-700 text-black mb-2">
              Search Query
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={
                  searchType === 'id'
                    ? 'Enter Application ID (e.g., APP-2025-00123)'
                    : searchType === 'email'
                    ? 'Enter Email Address'
                    : 'Enter Phone Number'
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 focus:border-transparent bg-white text-black"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery}
            className="px-6 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{isSearching ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </div>

      {/* No Results */}
      {!application && searchQuery && !isSearching && (
        <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-black">No application found matching your search criteria</p>
        </div>
      )}

      {/* Application Details */}
      {application && (
        <div className="space-y-6">
          {/* Status Banner */}
          <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 text-black mb-2">
                  {application.firstName} {application.middleName} {application.lastName}
                </h2>
                <p className="text-sm text-gray-500 text-black">
                  Application ID: <span className="font-medium text-portal-teal-600 text-portal-teal-600">{application.applicationId}</span>
                </p>
                <p className="text-sm text-gray-500 text-black">
                  Submitted: {application.applicationDate}
                </p>
              </div>
              <span
                className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(
                  application.status
                )}`}
              >
                {getStatusIcon(application.status)}
                <span>{application.status}</span>
              </span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Personal & Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
                <h3 className="text-lg font-semibold text-gray-900 text-black mb-4 flex items-center space-x-2">
                  <User className="w-5 h-5 text-portal-teal-600" />
                  <span>Personal Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 text-black">First Name</label>
                    <p className="text-gray-900 text-black font-medium">{application.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Middle Name</label>
                    <p className="text-gray-900 text-black font-medium">{application.middleName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Last Name</label>
                    <p className="text-gray-900 text-black font-medium">{application.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Date of Birth</label>
                    <p className="text-gray-900 text-black font-medium">{application.dateOfBirth}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Gender</label>
                    <p className="text-gray-900 text-black font-medium">{application.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Nationality</label>
                    <p className="text-gray-900 text-black font-medium">{application.nationality}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
                <h3 className="text-lg font-semibold text-gray-900 text-black mb-4 flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-portal-teal-600" />
                  <span>Contact Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 text-black">Email</label>
                    <p className="text-gray-900 text-black font-medium flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{application.email}</span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Phone</label>
                    <p className="text-gray-900 text-black font-medium flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{application.phone}</span>
                    </p>
                  </div>
                  {application.alternatePhone && (
                    <div>
                      <label className="text-sm text-gray-500 text-black">Alternate Phone</label>
                      <p className="text-gray-900 text-black font-medium">{application.alternatePhone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
                <h3 className="text-lg font-semibold text-gray-900 text-black mb-4 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-portal-teal-600" />
                  <span>Address Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-500 text-black">Permanent Address</label>
                    <p className="text-gray-900 text-black font-medium">{application.permanentAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">City</label>
                    <p className="text-gray-900 text-black font-medium">{application.city}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">District</label>
                    <p className="text-gray-900 text-black font-medium">{application.district}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Country</label>
                    <p className="text-gray-900 text-black font-medium">{application.country}</p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
                <h3 className="text-lg font-semibold text-gray-900 text-black mb-4 flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-portal-teal-600" />
                  <span>Academic Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-500 text-black">Program Applied</label>
                    <p className="text-gray-900 text-black font-medium">{application.programApplied}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Faculty</label>
                    <p className="text-gray-900 text-black font-medium">{application.faculty}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Entry Level</label>
                    <p className="text-gray-900 text-black font-medium">{application.entryLevel}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Previous School</label>
                    <p className="text-gray-900 text-black font-medium">{application.previousSchool}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Previous Qualification</label>
                    <p className="text-gray-900 text-black font-medium">{application.previousQualification}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Year Completed</label>
                    <p className="text-gray-900 text-black font-medium">{application.yearCompleted}</p>
                  </div>
                  {application.aggregateScore && (
                    <div>
                      <label className="text-sm text-gray-500 text-black">Aggregate Score</label>
                      <p className="text-gray-900 text-black font-medium">{application.aggregateScore}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Guardian Information */}
              <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
                <h3 className="text-lg font-semibold text-gray-900 text-black mb-4 flex items-center space-x-2">
                  <User className="w-5 h-5 text-portal-teal-600" />
                  <span>Guardian Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 text-black">Guardian Name</label>
                    <p className="text-gray-900 text-black font-medium">{application.guardianName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Relationship</label>
                    <p className="text-gray-900 text-black font-medium">{application.guardianRelationship}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Guardian Phone</label>
                    <p className="text-gray-900 text-black font-medium">{application.guardianPhone}</p>
                  </div>
                  {application.guardianEmail && (
                    <div>
                      <label className="text-sm text-gray-500 text-black">Guardian Email</label>
                      <p className="text-gray-900 text-black font-medium">{application.guardianEmail}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Documents & Payment */}
            <div className="space-y-6">
              {/* Documents */}
              <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
                <h3 className="text-lg font-semibold text-gray-900 text-black mb-4 flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-portal-teal-600" />
                  <span>Documents</span>
                </h3>
                <div className="space-y-3">
                  {application.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 bg-white rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 text-black">{doc.name}</p>
                        {doc.uploadedDate && (
                          <p className="text-xs text-gray-500 text-black">
                            Uploaded: {doc.uploadedDate}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${getDocumentStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                        {doc.status !== 'Pending' && (
                          <button className="text-portal-teal-600 text-portal-teal-600 hover:text-portal-teal-700">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
                <h3 className="text-lg font-semibold text-gray-900 text-black mb-4 flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-portal-teal-600" />
                  <span>Payment Information</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500 text-black">Application Fee</label>
                    <p className="text-lg font-bold text-gray-900 text-black">
                      Le {application.applicationFee.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 text-black">Payment Status</label>
                    <p
                      className={`text-sm font-medium ${
                        application.paymentStatus === 'Paid'
                          ? 'text-green-600 text-green-600'
                          : 'text-red-600 text-red-600'
                      }`}
                    >
                      {application.paymentStatus}
                    </p>
                  </div>
                  {application.paymentDate && (
                    <div>
                      <label className="text-sm text-gray-500 text-black">Payment Date</label>
                      <p className="text-sm text-gray-900 text-black">{application.paymentDate}</p>
                    </div>
                  )}
                  {application.receiptNumber && (
                    <div>
                      <label className="text-sm text-gray-500 text-black">Receipt Number</label>
                      <p className="text-sm font-medium text-portal-teal-600 text-portal-teal-600">
                        {application.receiptNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Information */}
              {application.reviewedBy && (
                <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 text-black mb-4 flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-portal-teal-600" />
                    <span>Review Information</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500 text-black">Reviewed By</label>
                      <p className="text-sm text-gray-900 text-black">{application.reviewedBy}</p>
                    </div>
                    {application.reviewDate && (
                      <div>
                        <label className="text-sm text-gray-500 text-black">Review Date</label>
                        <p className="text-sm text-gray-900 text-black">{application.reviewDate}</p>
                      </div>
                    )}
                    {application.remarks && (
                      <div>
                        <label className="text-sm text-gray-500 text-black">Remarks</label>
                        <p className="text-sm text-gray-900 text-black bg-gray-50 bg-white p-3 rounded">
                          {application.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
                <h3 className="text-lg font-semibold text-gray-900 text-black mb-4">Actions</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 transition-colors flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download Application</span>
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 border-gray-300 text-gray-700 text-black rounded-lg hover:bg-gray-100 hover:bg-gray-50 transition-colors">
                    Print Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
