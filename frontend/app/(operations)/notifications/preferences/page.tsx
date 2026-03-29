'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  Moon,
  Settings,
  Save,
  ArrowLeft,
  Check,
  X,
} from 'lucide-react';
import {
  getMyPreferences,
  updateMyPreferences,
} from '@/lib/services/notifications';

export default function NotificationPreferencesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [enableInApp, setEnableInApp] = useState(true);
  const [enableEmail, setEnableEmail] = useState(true);
  const [enableSms, setEnableSms] = useState(false);
  const [enablePush, setEnablePush] = useState(true);
  const [disabledTypes, setDisabledTypes] = useState<string[]>([]);
  const [enableQuietHours, setEnableQuietHours] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');
  const [enableDailyDigest, setEnableDailyDigest] = useState(false);
  const [dailyDigestTime, setDailyDigestTime] = useState('09:00');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const data = await getMyPreferences();

      // Populate form with existing preferences
      setEnableInApp(data.enable_in_app);
      setEnableEmail(data.enable_email);
      setEnableSms(data.enable_sms);
      setEnablePush(data.enable_push);
      setDisabledTypes(data.disabled_notification_types || []);
      setEnableQuietHours(data.enable_quiet_hours);
      setQuietHoursStart(data.quiet_hours_start || '22:00');
      setQuietHoursEnd(data.quiet_hours_end || '08:00');
      setEnableDailyDigest(data.enable_daily_digest);
      setDailyDigestTime(data.daily_digest_time || '09:00');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load preferences';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const data = {
        enable_in_app: enableInApp,
        enable_email: enableEmail,
        enable_sms: enableSms,
        enable_push: enablePush,
        disabled_notification_types: disabledTypes,
        enable_quiet_hours: enableQuietHours,
        quiet_hours_start: enableQuietHours ? quietHoursStart : null,
        quiet_hours_end: enableQuietHours ? quietHoursEnd : null,
        enable_daily_digest: enableDailyDigest,
        daily_digest_time: enableDailyDigest ? dailyDigestTime : null,
      };

      await updateMyPreferences(data);
      toast.success('Preferences saved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save preferences';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const notificationTypes = [
    { value: 'ADMISSION', label: 'Admission Notifications' },
    { value: 'COURSE_REGISTRATION', label: 'Course Registration' },
    { value: 'EXAM_SCHEDULE', label: 'Exam Schedules' },
    { value: 'RESULT_PUBLISHED', label: 'Results Published' },
    { value: 'FEE_PAYMENT', label: 'Fee Payments' },
    { value: 'FEE_REMINDER', label: 'Fee Reminders' },
    { value: 'LIBRARY_DUE', label: 'Library Due Dates' },
    { value: 'LIBRARY_OVERDUE', label: 'Library Overdue' },
    { value: 'HOSTEL_ALLOCATION', label: 'Hostel Allocation' },
    { value: 'MAINTENANCE_UPDATE', label: 'Maintenance Updates' },
    { value: 'GENERAL_ANNOUNCEMENT', label: 'General Announcements' },
    { value: 'EVENT_REMINDER', label: 'Event Reminders' },
  ];

  const toggleNotificationType = (type: string) => {
    setDisabledTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading preferences...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/notifications"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Notifications
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Notification Preferences</h1>
                <p className="text-sm text-gray-600">
                  Customize how you receive notifications
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notification Channels */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Notification Channels
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose how you want to receive notifications
            </p>
            <div className="space-y-4">
              {/* In-App Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">In-App Notifications</p>
                    <p className="text-sm text-gray-600">
                      Receive notifications within the application
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEnableInApp(!enableInApp)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enableInApp ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enableInApp ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">
                      Receive notifications via email
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEnableEmail(!enableEmail)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enableEmail ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enableEmail ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">
                      Receive notifications via text message
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEnableSms(!enableSms)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enableSms ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enableSms ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-600">
                      Receive push notifications on your device
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEnablePush(!enablePush)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enablePush ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enablePush ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Notification Types
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Select which types of notifications you want to receive
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {notificationTypes.map((type) => {
                const isEnabled = !disabledTypes.includes(type.value);
                return (
                  <button
                    key={type.value}
                    onClick={() => toggleNotificationType(type.value)}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      isEnabled
                        ? 'border-indigo-200 bg-indigo-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isEnabled ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {type.label}
                    </span>
                    {isEnabled ? (
                      <Check className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Moon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Quiet Hours</h2>
                  <p className="text-sm text-gray-600">
                    Disable notifications during specific hours
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEnableQuietHours(!enableQuietHours)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enableQuietHours ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enableQuietHours ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {enableQuietHours && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={quietHoursStart}
                    onChange={(e) => setQuietHoursStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={quietHoursEnd}
                    onChange={(e) => setQuietHoursEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Daily Digest */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Daily Digest</h2>
                  <p className="text-sm text-gray-600">
                    Receive a daily summary of notifications
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEnableDailyDigest(!enableDailyDigest)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enableDailyDigest ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enableDailyDigest ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {enableDailyDigest && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time
                </label>
                <input
                  type="time"
                  value={dailyDigestTime}
                  onChange={(e) => setDailyDigestTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Save Button (Bottom) */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
