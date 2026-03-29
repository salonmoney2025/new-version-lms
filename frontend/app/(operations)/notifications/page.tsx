'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  Bell,
  Calendar,
  Check,
  CheckCheck,
  DollarSign,
  Home,
  Info,
  Trash2,
  Settings,
  BookOpen,
  GraduationCap,
  FileCheck,
} from 'lucide-react';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  Notification,
} from '@/lib/services/notifications';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications(filter === 'unread');
      setNotifications(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load notifications';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
      toast.success('Marked as read');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark as read';
      toast.error(errorMessage);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      const now = new Date().toISOString();
      setNotifications(notifications.map((n) => ({ ...n, is_read: true, read_at: now })));
      toast.success('All notifications marked as read');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark all as read';
      toast.error(errorMessage);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete notification';
      toast.error(errorMessage);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.action_url) {
      router.push(notification.action_url);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fee_payment':
      case 'fee_reminder':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'admission':
      case 'course_registration':
        return <GraduationCap className="h-5 w-5 text-blue-600" />;
      case 'exam_schedule':
      case 'result_published':
        return <FileCheck className="h-5 w-5 text-purple-600" />;
      case 'library_due':
      case 'library_overdue':
        return <BookOpen className="h-5 w-5 text-orange-600" />;
      case 'hostel_allocation':
      case 'maintenance_update':
        return <Home className="h-5 w-5 text-indigo-600" />;
      case 'general_announcement':
      case 'event_reminder':
        return <Bell className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-indigo-600" />;
    }
  };

  const getNotificationBgColor = (priority: string, read: boolean) => {
    if (read) return 'bg-white';

    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'medium':
        return 'bg-blue-50 border-blue-200';
      case 'low':
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">Notifications</h1>
              <p className="text-sm text-gray-600">
                {notifications.length} total, {unreadCount} unread
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/notifications/preferences"
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Preferences</span>
            </Link>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === 'unread'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Unread Only {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-600">
              {filter === 'unread'
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl border shadow-sm transition-all hover:shadow-md ${getNotificationBgColor(
                  notification.priority,
                  notification.is_read
                )} ${notification.action_url ? 'cursor-pointer' : ''}`}
                onClick={() =>
                  notification.action_url && handleNotificationClick(notification)
                }
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {notification.title}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              notification.priority === 'URGENT'
                                ? 'bg-red-100 text-red-700'
                                : notification.priority === 'HIGH'
                                ? 'bg-orange-100 text-orange-700'
                                : notification.priority === 'MEDIUM'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {notification.priority_display}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <p className="text-xs text-gray-500">
                                {formatDate(notification.created_at)}
                              </p>
                            </div>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-500">
                              {notification.notification_type_display}
                            </p>
                          </div>
                          {notification.action_text && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-indigo-600">
                                {notification.action_text} →
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.is_read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
