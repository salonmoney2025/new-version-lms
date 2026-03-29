'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { HelpCircle, ChevronDown, ChevronUp, Search, Home } from 'lucide-react';
import Link from 'next/link';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: '1',
      category: 'Account & Login',
      question: 'How do I reset my portal password?',
      answer: 'To reset your password, click on the "Forgot Password" link on the login page. Enter your student ID or email address, and follow the instructions sent to your registered email.',
    },
    {
      id: '2',
      category: 'Account & Login',
      question: 'I cannot access my student portal. What should I do?',
      answer: 'If you are unable to access your portal, first verify that you are using the correct credentials. If the problem persists, clear your browser cache and cookies, or try using a different browser. If you still cannot access your account, contact IT support.',
    },
    {
      id: '3',
      category: 'Payments & Fees',
      question: 'How do I make a payment for tuition fees?',
      answer: 'You can make payments through bank transfer, mobile money, or at any designated payment center. After payment, upload your receipt in the "Payments" section of the portal for verification.',
    },
    {
      id: '4',
      category: 'Payments & Fees',
      question: 'My payment is not showing on my account. What should I do?',
      answer: 'Payment verification can take 24-48 hours. If your payment still does not reflect after this period, submit a support ticket with your payment receipt attached.',
    },
    {
      id: '5',
      category: 'Registration & Enrollment',
      question: 'How do I register for courses?',
      answer: 'Course registration is done through the "Registration" section of the student portal. Select your courses for the semester, review your schedule, and submit your registration.',
    },
    {
      id: '6',
      category: 'Registration & Enrollment',
      question: 'Can I change my courses after registration?',
      answer: 'Course changes are allowed during the add/drop period, typically the first two weeks of the semester. After this period, course changes require special approval from the academic dean.',
    },
    {
      id: '7',
      category: 'Documents & Certificates',
      question: 'How do I request a transcript?',
      answer: 'To request a transcript, go to the "Documents" section and submit a transcript request. Official transcripts take 5-7 working days to process and can be collected from the registrar\'s office.',
    },
    {
      id: '8',
      category: 'Documents & Certificates',
      question: 'How long does it take to get my ID card?',
      answer: 'Student ID cards are typically issued within 2 weeks of enrollment. You can collect your ID card from the student services office with a valid form of identification.',
    },
    {
      id: '9',
      category: 'Technical Support',
      question: 'The portal is running slowly. What can I do?',
      answer: 'Portal performance can be affected by your internet connection or browser. Try clearing your browser cache, using a different browser, or accessing the portal during off-peak hours.',
    },
    {
      id: '10',
      category: 'Technical Support',
      question: 'I am getting an error when uploading documents. How do I fix this?',
      answer: 'Ensure your documents are in the correct format (PDF, JPG, or PNG) and do not exceed the maximum file size of 5MB. If the problem persists, try compressing your file or contact technical support.',
    },
  ];

  const categories = ['all', ...Array.from(new Set(faqs.map((faq) => faq.category)))];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 bg-white min-h-screen">
        <div className="mb-6 flex items-center space-x-3">
          <div className="w-12 h-12 bg-teal-100  rounded-lg flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-teal-600 text-teal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 text-black">Frequently Asked Questions</h1>
            <p className="text-sm text-gray-500 text-black">Find answers to common questions</p>
          
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 bg-white text-black"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-portal-teal-600 text-white'
                    : 'bg-gray-100 bg-white text-gray-700 text-black hover:bg-gray-200 hover:bg-gray-50'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-1 bg-portal-teal-100 text-portal-teal-700 text-portal-teal-600 text-xs font-semibold rounded">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 text-black">{faq.question}</h3>
                </div>
                <div className="ml-4">
                  {expandedId === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              {expandedId === faq.id && (
                <div className="px-6 pb-6 border-t border-gray-200 border-gray-300 pt-4">
                  <p className="text-gray-700 text-black leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-12 text-center">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 text-black mb-2">No FAQs Found</h3>
            <p className="text-gray-500 text-black">
              No FAQs match your search criteria. Try adjusting your search or category filter.
            </p>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-6 bg-portal-teal-50 border border-portal-teal-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-portal-teal-900 text-portal-teal-600 mb-2">
            Didn&apos;t find what you&apos;re looking for?
          </h3>
          <p className="text-portal-teal-700 text-portal-teal-600 mb-4">
            If you couldn&apos;t find an answer to your question, our support team is here to help.
          </p>
          <a
            href="/help-desk/submit"
            className="inline-block px-6 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700"
          >
            Submit a Support Ticket
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
