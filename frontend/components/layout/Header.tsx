'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import {
  Bell,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  GraduationCap,
  Home,
} from 'lucide-react';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  Notification,
} from '@/lib/services/notifications';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications on mount and periodically
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications(false);
      // Get only the latest 5 notifications for the dropdown
      setNotifications(data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      try {
        await markAsRead(notification.id);
        // Update local state
        setNotifications(notifications.map(n =>
          n.id === notification.id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }

    // Navigate to action URL if exists
    if (notification.action_url) {
      router.push(notification.action_url);
      setShowNotifications(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    router.push('/notifications');
  };

  return (
    <header className="h-16 bg-portal-header border-b border-gray-700 flex items-center justify-between px-4 lg:px-6">
      {/* Left section */}
      <div className="flex items-center space-x-4 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        {/* EBKUST Portal Branding */}
        <div className="hidden lg:flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-portal-teal-500 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">EBKUST Portal</h1>
            <p className="text-xs text-gray-300">University Management System</p>
          </div>
        </div>

        {/* HOME Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-2 px-4 py-2 bg-portal-teal-600 hover:bg-portal-teal-700 rounded-lg transition-colors ml-4"
          title="Go to Home"
        >
          <Home className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-sm hidden sm:inline">HOME</span>
        </button>

        {/* Advanced Search */}
        <div className="ml-8">
          <AdvancedSearch />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-gray-300" />
          ) : (
            <Moon className="w-5 h-5 text-gray-300" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) {
                fetchNotifications();
              }
            }}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                  </h3>
                  <button
                    onClick={() => router.push('/notifications/preferences')}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Notification Settings"
                  >
                    <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                          !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {notification.title}
                              </h4>
                              {notification.priority === 'URGENT' && (
                                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                                  URGENT
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleViewAllNotifications}
                    className="text-sm text-portal-teal-600 dark:text-portal-teal-400 hover:text-portal-teal-700 dark:hover:text-portal-teal-300 font-medium"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 bg-portal-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-300">
                {user?.role}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-300 hidden md:block" />
          </button>

          {/* User dropdown menu */}
          {showUserMenu && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      router.push('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="w-4 h-4 mr-3" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      router.push('/settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
