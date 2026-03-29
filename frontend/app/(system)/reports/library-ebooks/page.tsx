'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  Filter,
  Home,
  RefreshCw,
  Search
} from 'lucide-react';
import Link from 'next/link';
interface EBook {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publicationYear: string;
  edition: string;
  category: string;
  subject: string;
  format: string;
  fileSize: string;
  language: string;
  pages: number;
  downloads: number;
  views: number;
  dateAdded: string;
  accessUrl: string;
  status: 'available' | 'restricted' | 'unavailable';
}

export default function LibraryEBooksReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [formatFilter, setFormatFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const ebooks: EBook[] = [
    {
      id: 1,
      isbn: '978-0-13-468599-1',
      title: 'Introduction to Algorithms (Digital Edition)',
      author: 'Thomas H. Cormen, Charles E. Leiserson',
      publisher: 'MIT Press',
      publicationYear: '2022',
      edition: '4th Edition',
      category: 'eTextbook',
      subject: 'Computer Science',
      format: 'PDF',
      fileSize: '15.2 MB',
      language: 'English',
      pages: 1312,
      downloads: 456,
      views: 1234,
      dateAdded: '2023-01-15',
      accessUrl: '/library/ebooks/algorithms-4th.pdf',
      status: 'available',
    },
    {
      id: 2,
      isbn: '978-1-49-205105-8',
      title: 'Python for Data Analysis',
      author: 'Wes McKinney',
      publisher: "O'Reilly Media",
      publicationYear: '2022',
      edition: '3rd Edition',
      category: 'eTextbook',
      subject: 'Data Science',
      format: 'EPUB',
      fileSize: '8.7 MB',
      language: 'English',
      pages: 579,
      downloads: 892,
      views: 2345,
      dateAdded: '2023-02-20',
      accessUrl: '/library/ebooks/python-data-analysis.epub',
      status: 'available',
    },
    {
      id: 3,
      isbn: '978-0-262-04630-5',
      title: 'Deep Learning',
      author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
      publisher: 'MIT Press',
      publicationYear: '2021',
      edition: '1st Edition',
      category: 'eTextbook',
      subject: 'Artificial Intelligence',
      format: 'PDF',
      fileSize: '22.5 MB',
      language: 'English',
      pages: 775,
      downloads: 678,
      views: 1876,
      dateAdded: '2023-03-10',
      accessUrl: '/library/ebooks/deep-learning.pdf',
      status: 'available',
    },
    {
      id: 4,
      isbn: '978-0-12-374856-0',
      title: 'Fundamentals of Digital Image Processing',
      author: 'Chris Solomon, Toby Breckon',
      publisher: 'Wiley-Blackwell',
      publicationYear: '2020',
      edition: '1st Edition',
      category: 'eTextbook',
      subject: 'Computer Vision',
      format: 'PDF',
      fileSize: '12.3 MB',
      language: 'English',
      pages: 344,
      downloads: 234,
      views: 789,
      dateAdded: '2023-04-05',
      accessUrl: '/library/ebooks/image-processing.pdf',
      status: 'restricted',
    },
    {
      id: 5,
      isbn: '978-1-118-77400-9',
      title: 'Engineering Mathematics',
      author: 'K.A. Stroud, Dexter J. Booth',
      publisher: 'Palgrave',
      publicationYear: '2020',
      edition: '7th Edition',
      category: 'eTextbook',
      subject: 'Mathematics',
      format: 'PDF',
      fileSize: '18.9 MB',
      language: 'English',
      pages: 1216,
      downloads: 1023,
      views: 3456,
      dateAdded: '2023-01-25',
      accessUrl: '/library/ebooks/engineering-math.pdf',
      status: 'available',
    },
  ];

  const stats = {
    totalEBooks: 1247,
    availableEBooks: 1156,
    totalDownloads: 45678,
    totalViews: 123456,
  };

  const categories = ['All', 'eTextbook', 'eJournal', 'Research Paper', 'Reference'];
  const formats = ['All', 'PDF', 'EPUB', 'MOBI', 'AZW'];
  const subjects = ['All', 'Computer Science', 'Data Science', 'Artificial Intelligence', 'Mathematics', 'Engineering'];
  const statuses = ['All', 'Available', 'Restricted', 'Unavailable'];

  const getStatusBadge = (status: string) => {
    const badges = {
      available: 'bg-green-100 text-green-800',
      restricted: 'bg-yellow-100 text-yellow-800',
      unavailable: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.available;
  };

  const filteredEBooks = ebooks.filter((ebook) => {
    const matchesSearch =
      ebook.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || ebook.category === categoryFilter;
    const matchesFormat = formatFilter === 'All' || ebook.format === formatFilter;
    const matchesSubject = subjectFilter === 'All' || ebook.subject === subjectFilter;
    const matchesStatus = statusFilter === 'All' || ebook.status === statusFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesFormat && matchesSubject && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEBooks.length / itemsPerPage);
  const paginatedEBooks = filteredEBooks.slice(
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
              <h1 className="text-3xl font-bold text-gray-900">Library eBooks</h1>
              <p className="mt-2 text-base text-gray-600">
                Digital library catalog with downloadable electronic books
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
              <ExportMenu data={filteredEBooks} filename="library-ebooks-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total eBooks</p>
                <p className="text-4xl font-bold mt-2">{stats.totalEBooks.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <BookOpen className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Available</p>
                <p className="text-4xl font-bold mt-2">{stats.availableEBooks.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <FileText className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Total Downloads</p>
                <p className="text-4xl font-bold mt-2">{stats.totalDownloads.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Download className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Total Views</p>
                <p className="text-4xl font-bold mt-2">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Eye className="h-10 w-10" />
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
                  placeholder="Search eBooks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {formats.map((format) => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
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

        {/* eBooks Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ISBN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Book Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category/Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Format/Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Downloads</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedEBooks.map((ebook) => (
                  <tr key={ebook.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{ebook.isbn}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ebook.title}</div>
                      <div className="text-sm text-gray-500">{ebook.author}</div>
                      <div className="text-sm text-gray-500">{ebook.publisher}, {ebook.publicationYear}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{ebook.category}</div>
                      <div className="text-sm text-gray-500">{ebook.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ebook.format}</div>
                      <div className="text-sm text-gray-500">{ebook.fileSize}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center text-sm text-gray-900">
                        <Download className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="font-semibold">{ebook.downloads.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center text-sm text-gray-900">
                        <Eye className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="font-semibold">{ebook.views.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(ebook.status)}`}>
                        {ebook.status.charAt(0).toUpperCase() + ebook.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800" title="View eBook">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-green-600 hover:text-green-800" title="Download eBook">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
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
              <span className="font-medium">{Math.min(currentPage * itemsPerPageedEBooks.length)}</span> of{' '}
              <span className="font-medium">{filteredEBooks.length}</span> results
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
