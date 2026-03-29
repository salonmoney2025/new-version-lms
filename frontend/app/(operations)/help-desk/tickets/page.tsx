'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Ticket, Search, Eye, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';

interface TicketType {
  id: string;
  ticketNo: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdDate: string;
  lastUpdate: string;
  assignedTo: string;
  responses: number;
}

export default function ViewTicketsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Memoize tickets array to prevent useMemo dependency warnings
  const tickets: TicketType[] = useMemo(() => [
    {
      id: '1',
      ticketNo: 'TKT-2026-001',
      subject: 'Unable to access student portal',
      category: 'Portal Access',
      priority: 'high',
      status: 'in-progress',
      createdDate: '2026-03-15',
      lastUpdate: '2026-03-16',
      assignedTo: 'Support Team A',
      responses: 3,
    },
    {
      id: '2',
      ticketNo: 'TKT-2026-002',
      subject: 'Payment not reflecting in account',
      category: 'Payment Issues',
      priority: 'critical',
      status: 'open',
      createdDate: '2026-03-16',
      lastUpdate: '2026-03-16',
      assignedTo: 'Finance Team',
      responses: 1,
    },
    {
      id: '3',
      ticketNo: 'TKT-2026-003',
      subject: 'Request for transcript',
      category: 'Document Request',
      priority: 'low',
      status: 'resolved',
      createdDate: '2026-03-10',
      lastUpdate: '2026-03-14',
      assignedTo: 'Registrar Office',
      responses: 5,
    },
    {
      id: '4',
      ticketNo: 'TKT-2026-004',
      subject: 'Course enrollment error',
      category: 'Course Enrollment',
      priority: 'medium',
      status: 'closed',
      createdDate: '2026-03-08',
      lastUpdate: '2026-03-12',
      assignedTo: 'Academic Team',
      responses: 7,
    },
  ], []);

  // Memoized filtering for performance with large datasets
  const filteredTickets = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.ticketNo.toLowerCase().includes(lowerSearchTerm) ||
        ticket.subject.toLowerCase().includes(lowerSearchTerm) ||
        ticket.category.toLowerCase().includes(lowerSearchTerm);
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in-progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  }), [tickets]);

  const getPriorityBadge = (priority: string) => {
    const config = {
      low: { bg: 'bg-gray-100 bg-white', text: 'text-gray-700 text-black' },
      medium: { bg: 'bg-blue-100 ', text: 'text-blue-700 text-blue-600' },
      high: { bg: 'bg-orange-100 ', text: 'text-orange-700 text-orange-600' },
      critical: { bg: 'bg-red-100 ', text: 'text-red-700 text-red-600' },
    };
    return config[priority as keyof typeof config] || config.medium;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      open: { bg: 'bg-yellow-100 ', text: 'text-yellow-700 text-yellow-600', icon: AlertCircle },
      'in-progress': { bg: 'bg-blue-100 ', text: 'text-blue-700 text-blue-600', icon: Clock },
      resolved: { bg: 'bg-green-100 ', text: 'text-green-700 text-green-600', icon: CheckCircle },
      closed: { bg: 'bg-gray-100 bg-white', text: 'text-gray-700 text-black', icon: XCircle },
    };
    return config[status as keyof typeof config] || config.open;
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 bg-white min-h-screen">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100  rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-purple-600 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 text-black">Support Tickets</h1>
              <p className="text-sm text-gray-500 text-black">View and manage your support tickets</p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center space-x-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
          <a
            href="/help-desk/submit"
            className="px-4 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 flex items-center space-x-2"
          >
            <span>New Ticket</span>
          </a>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 text-black">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900 text-black mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-gray-500 rounded-lg"></div>
            </div>
          </div>
          <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 text-black">Open</p>
                <p className="text-2xl font-bold text-gray-900 text-black mt-1">{stats.open}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-500 rounded-lg"></div>
            </div>
          </div>
          <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 text-black">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 text-black mt-1">{stats.inProgress}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-lg"></div>
            </div>
          </div>
          <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 text-black">Resolved</p>
                <p className="text-2xl font-bold text-gray-900 text-black mt-1">{stats.resolved}</p>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-lg"></div>
            </div>
          </div>
          <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 text-black">Closed</p>
                <p className="text-2xl font-bold text-gray-900 text-black mt-1">{stats.closed}</p>
              </div>
              <div className="w-10 h-10 bg-gray-400 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by ticket number, subject, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 bg-white text-black"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 bg-white text-black"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-teal-500 bg-white text-black"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white bg-white rounded-lg shadow-sm border border-gray-200 border-gray-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-black uppercase">Ticket #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-black uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-black uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-black uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-black uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-black uppercase">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-black uppercase">Responses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 text-black uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTickets.map((ticket) => {
                  const priorityConfig = getPriorityBadge(ticket.priority);
                  const statusConfig = getStatusBadge(ticket.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-portal-teal-600">
                        {ticket.ticketNo}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 text-black">{ticket.subject}</div>
                        <div className="text-xs text-gray-500 text-black">
                          Created: {new Date(ticket.createdDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-black">
                        {ticket.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityConfig.bg} ${priorityConfig.text}`}>
                          {ticket.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex items-center space-x-1 text-xs leading-5 font-semibold rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span className="capitalize">{ticket.status.replace('-', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-black">
                        {ticket.assignedTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-sm text-gray-900 text-black">
                          <MessageSquare className="w-4 h-4" />
                          <span>{ticket.responses}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-700" title="View Details">
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
