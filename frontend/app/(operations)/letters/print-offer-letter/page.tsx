'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentRecord {
  id: string;
  appId: string;
  name: string;
  course: string;
  year: string;
  level: number;
  campus: string;
}

// Sample student data
const SAMPLE_STUDENTS: StudentRecord[] = [
  // 2024-2025 Academic Year
  {
    id: '1',
    appId: 'APP001',
    name: 'LOVETTA MANSARAY',
    course: 'Bachelor of Science in Nursing',
    year: '2024-2025',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '2',
    appId: 'APP002',
    name: 'ELIZABETH KAMBAIMA',
    course: 'Bachelor of Science in Nursing',
    year: '2024-2025',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '3',
    appId: 'APP003',
    name: 'AMARA KOROMA',
    course: 'Bachelor of Science in Computer Science',
    year: '2024-2025',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '4',
    appId: 'APP004',
    name: 'ISATA JALLOH',
    course: 'Bachelor of Science in Microbiology',
    year: '2024-2025',
    level: 2,
    campus: 'Main Campus',
  },
  {
    id: '5',
    appId: 'APP005',
    name: 'FATIMA BANGURA',
    course: 'Master of Science in Nursing',
    year: '2024-2025',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '6',
    appId: 'APP006',
    name: 'MUSTAPHA SESAY',
    course: 'Bachelor of Science in Computer Science',
    year: '2024-2025',
    level: 2,
    campus: 'Main Campus',
  },
  {
    id: '7',
    appId: 'APP007',
    name: 'ZAINAB CONTEH',
    course: 'Bachelor of Science in Nursing',
    year: '2024-2025',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '8',
    appId: 'APP008',
    name: 'IBRAHIM MANSARAY',
    course: 'Master of Business Administration',
    year: '2024-2025',
    level: 1,
    campus: 'Main Campus',
  },
  // 2025-2026 Academic Year
  {
    id: '9',
    appId: 'APP101',
    name: 'MARIAMA KAMARA',
    course: 'Bachelor of Science in Nursing',
    year: '2025-2026',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '10',
    appId: 'APP102',
    name: 'MOHAMED TURAY',
    course: 'Bachelor of Science in Nursing',
    year: '2025-2026',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '11',
    appId: 'APP103',
    name: 'HAWA KOROMA',
    course: 'Bachelor of Science in Nursing',
    year: '2025-2026',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '12',
    appId: 'APP104',
    name: 'JOSEPH BANGURA',
    course: 'Bachelor of Science in Nursing',
    year: '2025-2026',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '13',
    appId: 'APP105',
    name: 'KADIATU SESAY',
    course: 'Bachelor of Science in Computer Science',
    year: '2025-2026',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '14',
    appId: 'APP106',
    name: 'ABDUL CONTEH',
    course: 'Bachelor of Science in Microbiology',
    year: '2025-2026',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '15',
    appId: 'APP107',
    name: 'TENNEH JALLOH',
    course: 'Bachelor of Science in Mathematics',
    year: '2025-2026',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '16',
    appId: 'APP108',
    name: 'SAHR MANSARAY',
    course: 'Bachelor of Science in Physics',
    year: '2025-2026',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '17',
    appId: 'APP109',
    name: 'FATU KARGBO',
    course: 'Bachelor of Science in Nursing',
    year: '2025-2026',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '18',
    appId: 'APP110',
    name: 'JAMES KOROMA',
    course: 'Bachelor of Science in Nursing',
    year: '2025-2026',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '19',
    appId: 'APP111',
    name: 'ADAMA KAMARA',
    course: 'Master of Science in Nursing',
    year: '2025-2026',
    level: 1,
    campus: 'Main Campus',
  },
  {
    id: '20',
    appId: 'APP112',
    name: 'SORIE BANGURA',
    course: 'Master of Business Administration',
    year: '2025-2026',
    level: 1,
    campus: 'Main Campus',
  },
];

const CLASS_TYPES = ['UnderGraduate', 'PostGraduate', 'Certificate', 'HD'];
const ACADEMIC_YEARS = ['2024-2025', '2025-2026', '2026-2027'];
const LEVELS = ['1', '2', '3', '4', '5', '6', '7'];

const PROGRAMS: Record<string, string[]> = {
  UnderGraduate: [
    'Bachelor of Science in Nursing',
    'Bachelor of Science in Microbiology',
    'Bachelor of Science in Computer Science',
    'Bachelor of Arts in English',
    'Bachelor of Science in Mathematics',
    'Bachelor of Science in Physics',
    'Bachelor of Science in Chemistry',
  ],
  PostGraduate: [
    'Master of Science in Nursing',
    'Master of Business Administration',
    'Master of Science in Computer Science',
    'Master of Science in Environmental Science',
  ],
  Certificate: [
    'Certificate in Business Administration',
    'Certificate in Nursing',
    'Certificate in Information Technology',
  ],
  HD: [
    'Higher Diploma in Nursing',
    'Higher Diploma in Business',
    'Higher Diploma in Computer Science',
  ],
};

export default function PrintOfferLetterPage() {
  const [classType, setClassType] = useState('UnderGraduate');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [level, setLevel] = useState('1');
  const [selectedProgram, setSelectedProgram] = useState(
    PROGRAMS.UnderGraduate[0]
  );
  const [showResults, setShowResults] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Update program options when class type changes
  React.useEffect(() => {
    const availablePrograms = PROGRAMS[classType] || [];
    setSelectedProgram(availablePrograms[0] || '');
  }, [classType]);

  // Filter and search students
  const filteredStudents = useMemo(() => {
    return SAMPLE_STUDENTS.filter((student) => {
      const matchesYear = student.year === academicYear;
      const matchesLevel = student.level === parseInt(level);
      const matchesProgram = student.course.toLowerCase().includes(
        selectedProgram.toLowerCase()
      );
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.appId.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesYear && matchesLevel && matchesProgram && matchesSearch;
    });
  }, [academicYear, level, selectedProgram, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  const handleShow = () => {
    setShowResults(true);
    setCurrentPage(1);
    toast.success(`Found ${filteredStudents.length} student(s)`);
  };

  const handlePrintOfferLetter = (appId: string, studentName: string) => {
    toast.success(`Printing offer letter for ${studentName}`);
    // Implement actual print functionality here
  };

  const currentPrograms = PROGRAMS[classType] || [];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <span className="text-slate-400">Print Offer Letter Here</span>
            <span className="text-slate-400">/</span>
            <a href="/" className="text-blue-600 hover:text-blue-700">
              Home
            </a>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              PRINT OFFER LETTER
            </h1>
          </div>
          <p className="text-slate-600">
            Select filters to view and print student offer letters
          </p>
        </div>

        {/* Filter Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Filter Criteria
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Class Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Class Type
              </label>
              <select
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                {CLASS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                {ACADEMIC_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Level */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                {LEVELS.map((lv) => (
                  <option key={lv} value={lv}>
                    {lv}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Class */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Class
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                {currentPrograms.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Show Button */}
          <div className="mt-6">
            <button
              onClick={handleShow}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Show
            </button>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Table Controls */}
            <div className="border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">
                  Show
                </label>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <label className="text-sm font-medium text-slate-700">
                  entries
                </label>
              </div>

              <div className="w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search by name or App ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      APPID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Campus
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((student, index) => (
                      <tr
                        key={student.id}
                        className={`border-b border-slate-100 hover:bg-blue-50 transition ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                          {student.appId}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {student.course}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {student.year}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {student.level}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {student.campus}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() =>
                              handlePrintOfferLetter(student.appId, student.name)
                            }
                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
                            title="Print Offer Letter"
                          >
                            <Printer className="w-4 h-4" />
                            Print
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        <p className="text-lg font-medium">
                          No records found matching the selected criteria
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredStudents.length > 0 && (
              <div className="border-t border-slate-200 px-6 py-4 flex justify-between items-center">
                <p className="text-sm text-slate-600">
                  Showing {startIndex + 1} to{' '}
                  {Math.min(startIndex + entriesPerPage, filteredStudents.length)}{' '}
                  of {filteredStudents.length} entries
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!showResults && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Results Yet
            </h3>
            <p className="text-slate-600">
              Select your filters and click the "Show" button to view student
              offer letters
            </p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
