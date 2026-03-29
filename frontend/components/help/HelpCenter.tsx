'use client';

import { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Video,
  FileText,
  X,
  Search,
  ChevronRight
} from 'lucide-react';

interface HelpTopic {
  id: string;
  title: string;
  description: string;
  category: 'getting-started' | 'students' | 'finance' | 'technical';
  icon: React.ElementType;
}

export default function HelpCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const helpTopics: HelpTopic[] = [
    {
      id: '1',
      title: 'How to Add a New Student',
      description: 'Step-by-step guide on registering new students in the system',
      category: 'students',
      icon: BookOpen
    },
    {
      id: '2',
      title: 'Generate Receipt for Payment',
      description: 'Learn how to create and print receipts for student payments',
      category: 'finance',
      icon: FileText
    },
    {
      id: '3',
      title: 'Managing User Accounts',
      description: 'Create, edit, and manage system user accounts and permissions',
      category: 'getting-started',
      icon: BookOpen
    },
    {
      id: '4',
      title: 'Troubleshooting Login Issues',
      description: 'Solutions for common login and authentication problems',
      category: 'technical',
      icon: BookOpen
    },
  ];

  const filteredTopics = helpTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'getting-started': return 'bg-blue-100 text-blue-700';
      case 'students': return 'bg-purple-100 text-purple-700';
      case 'finance': return 'bg-green-100 text-green-700';
      case 'technical': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-portal-teal-600 hover:bg-portal-teal-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-40"
        title="Help Center"
      >
        <HelpCircle className="h-6 w-6" />
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

      {/* Help Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-portal-teal-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Help Center</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Support</h3>
          <div className="grid grid-cols-3 gap-2">
            <button className="flex flex-col items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Video className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Video Guides</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <span className="text-xs font-medium text-gray-700">Live Chat</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <FileText className="h-5 w-5 text-orange-600" />
              <span className="text-xs font-medium text-gray-700">Documentation</span>
            </button>
          </div>
        </div>

        {/* Help Topics */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Popular Topics</h3>
          <div className="space-y-2">
            {filteredTopics.map((topic) => (
              <button
                key={topic.id}
                className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(topic.category)}`}>
                    <topic.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-portal-teal-600 transition-colors">
                      {topic.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(topic.category)}`}>
                      {topic.category.replace('-', ' ')}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-portal-teal-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Still need help?</p>
            <button className="w-full bg-portal-teal-600 hover:bg-portal-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
