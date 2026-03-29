'use client';

import { useState } from 'react';
import { Search, X, User, BookOpen, Receipt, FileText } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'student' | 'course' | 'payment' | 'application';
  title: string;
  subtitle: string;
  link: string;
}

export default function AdvancedSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filter, setFilter] = useState('all');

  const mockResults: SearchResult[] = [
    { id: '1', type: 'student', title: 'John Doe', subtitle: 'STU-2024-001 - Computer Science', link: '/students/1' },
    { id: '2', type: 'course', title: 'CS101', subtitle: 'Introduction to Programming', link: '/courses/1' },
    { id: '3', type: 'payment', title: 'Payment #12345', subtitle: 'Le 50,000 - Tuition Fee', link: '/payments/1' },
    { id: '4', type: 'application', title: 'Application #APP-2024-156', subtitle: 'Engineering Program', link: '/applications/1' },
  ];

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length > 2) {
      const filtered = mockResults.filter(result =>
        (filter === 'all' || result.type === filter) &&
        (result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         result.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'student': return <User className="h-5 w-5 text-blue-600" />;
      case 'course': return <BookOpen className="h-5 w-5 text-purple-600" />;
      case 'payment': return <Receipt className="h-5 w-5 text-green-600" />;
      case 'application': return <FileText className="h-5 w-5 text-orange-600" />;
      default: return <Search className="h-5 w-5 text-gray-600" />;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Advanced Search...</span>
      </button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-lg shadow-2xl z-50 overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search students, courses, payments, applications..."
              className="flex-1 text-lg outline-none"
              autoFocus
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-portal-teal-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('student')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'student'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setFilter('course')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'course'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setFilter('payment')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'payment'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setFilter('application')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'application'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Applications
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.length > 0 && results.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No results found for &quot;{query}&quot;
            </div>
          )}
          {results.map((result) => (
            <a
              key={result.id}
              href={result.link}
              className="flex items-start gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
            >
              <div className="bg-gray-100 p-2 rounded-lg">
                {getIcon(result.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{result.title}</p>
                <p className="text-sm text-gray-600 mt-1">{result.subtitle}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                {result.type}
              </span>
            </a>
          ))}
        </div>

        {/* Footer with keyboard shortcuts */}
        {query.length === 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Enter</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
