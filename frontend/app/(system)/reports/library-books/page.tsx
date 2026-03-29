'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExportMenu from '@/components/export/ExportMenu';
import {
  BookOpen,
  CheckCircle,
  Eye,
  Filter,
  Home,
  Library,
  RefreshCw,
  Search,
  User
} from 'lucide-react';
import Link from 'next/link';
interface LibraryBook {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publicationYear: string;
  edition: string;
  category: string;
  subject: string;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  status: 'available' | 'limited' | 'unavailable';
  language: string;
  pages: number;
  dateAdded: string;
}

export default function LibraryBooksReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Mock data - replace with API call
  const libraryBooks: LibraryBook[] = [
    {
      id: 1,
      isbn: '978-0-13-468599-1',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen, Charles E. Leiserson',
      publisher: 'MIT Press',
      publicationYear: '2022',
      edition: '4th Edition',
      category: 'Reference',
      subject: 'Computer Science',
      shelfLocation: 'CS-A-101',
      totalCopies: 10,
      availableCopies: 6,
      borrowedCopies: 4,
      status: 'available',
      language: 'English',
      pages: 1312,
      dateAdded: '2023-01-15',
    },
    {
      id: 2,
      isbn: '978-0-07-352641-0',
      title: 'Engineering Mechanics: Statics',
      author: 'J.L. Meriam, L.G. Kraige',
      publisher: 'Wiley',
      publicationYear: '2021',
      edition: '9th Edition',
      category: 'Textbook',
      subject: 'Engineering',
      shelfLocation: 'ENG-B-205',
      totalCopies: 8,
      availableCopies: 2,
      borrowedCopies: 6,
      status: 'limited',
      language: 'English',
      pages: 736,
      dateAdded: '2023-02-20',
    },
    {
      id: 3,
      isbn: '978-0-13-449508-4',
      title: 'Calculus: Early Transcendentals',
      author: 'James Stewart',
      publisher: 'Cengage Learning',
      publicationYear: '2020',
      edition: '8th Edition',
      category: 'Textbook',
      subject: 'Mathematics',
      shelfLocation: 'MATH-C-310',
      totalCopies: 15,
      availableCopies: 10,
      borrowedCopies: 5,
      status: 'available',
      language: 'English',
      pages: 1368,
      dateAdded: '2022-09-10',
    },
    {
      id: 4,
      isbn: '978-0-13-444432-9',
      title: 'Principles of Management',
      author: 'Stephen P. Robbins, Mary Coulter',
      publisher: 'Pearson',
      publicationYear: '2021',
      edition: '14th Edition',
      category: 'Textbook',
      subject: 'Business Administration',
      shelfLocation: 'BUS-D-415',
      totalCopies: 12,
      availableCopies: 0,
      borrowedCopies: 12,
      status: 'unavailable',
      language: 'English',
      pages: 672,
      dateAdded: '2023-03-05',
    },
    {
      id: 5,
      isbn: '978-0-321-97361-0',
      title: 'Physics for Scientists and Engineers',
      author: 'Douglas C. Giancoli',
      publisher: 'Pearson',
      publicationYear: '2022',
      edition: '5th Edition',
      category: 'Textbook',
      subject: 'Physics',
      shelfLocation: 'PHY-E-520',
      totalCopies: 10,
      availableCopies: 7,
      borrowedCopies: 3,
      status: 'available',
      language: 'English',
      pages: 1344,
      dateAdded: '2023-01-25',
    },
  ];

  const stats = {
    totalBooks: 8547,
    availableBooks: 5234,
    borrowedBooks: 3123,
    categories: 45,
  };

  const categories = ['All', 'Textbook', 'Reference', 'Journal', 'Magazine', 'Research Paper'];
  const subjects = ['All', 'Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Business Administration', 'Chemistry'];
  const statuses = ['All', 'Available', 'Limited', 'Unavailable'];

  const getStatusBadge = (status: string) => {
    const badges = {
      available: 'bg-green-100 text-green-800',
      limited: 'bg-yellow-100 text-yellow-800',
      unavailable: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.available;
  };

  const getAvailabilityPercentage = (available: number, total: number) => {
    return Math.round((available / total) * 100);
  };

  const filteredBooks = libraryBooks.filter((book) => {
    const matchesSearch =
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
    const matchesSubject = subjectFilter === 'All' || book.subject === subjectFilter;
    const matchesStatus = statusFilter === 'All' || book.status === statusFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesSubject && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice(
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
              <h1 className="text-3xl font-bold text-gray-900">Library Books</h1>
              <p className="mt-2 text-base text-gray-600">
                Complete catalog of all library books and their availability
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
              <ExportMenu data={filteredBooks} filename="library-books-report" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Books</p>
                <p className="text-4xl font-bold mt-2">{stats.totalBooks.toLocaleString()}</p>
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
                <p className="text-4xl font-bold mt-2">{stats.availableBooks.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <CheckCircle className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">Borrowed</p>
                <p className="text-4xl font-bold mt-2">{stats.borrowedBooks.toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <User className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">Categories</p>
                <p className="text-4xl font-bold mt-2">{stats.categories}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Library className="h-10 w-10" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
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

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ISBN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Book Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category/Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Shelf Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Copies</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Availability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedBooks.map((book) => {
                  const availabilityPercent = getAvailabilityPercentage(book.availableCopies, book.totalCopies);
                  return (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">{book.isbn}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        <div className="text-sm text-gray-500">{book.author}</div>
                        <div className="text-sm text-gray-500">{book.publisher}, {book.publicationYear}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{book.category}</div>
                        <div className="text-sm text-gray-500">{book.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Library className="w-4 h-4 mr-1 text-gray-400" />
                          {book.shelfLocation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Total: <span className="font-semibold">{book.totalCopies}</span></div>
                        <div className="text-sm text-green-600">Available: <span className="font-semibold">{book.availableCopies}</span></div>
                        <div className="text-sm text-orange-600">Borrowed: <span className="font-semibold">{book.borrowedCopies}</span></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{availabilityPercent}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                availabilityPercent === 0 ? 'bg-red-500' : availabilityPercent < 30 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${availabilityPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(book.status)}`}>
                          {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
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
              <span className="font-medium">{Math.min(currentPage * itemsPerPageedBooks.length)}</span> of{' '}
              <span className="font-medium">{filteredBooks.length}</span> results
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
