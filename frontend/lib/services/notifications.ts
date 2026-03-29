import api from '../api';

export interface Notification {
  id: number;
  recipient: number;
  recipient_name: string;
  template: number | null;
  title: string;
  message: string;
  html_content: string | null;
  notification_type: string;
  notification_type_display: string;
  priority: string;
  priority_display: string;
  status: string;
  status_display: string;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  is_read: boolean;
  action_url: string | null;
  action_text: string | null;
  related_object_type: string | null;
  related_object_id: number | null;
  created_at: string;
}

export interface NotificationPreference {
  id: number;
  user: number;
  user_name: string;
  enable_in_app: boolean;
  enable_email: boolean;
  enable_sms: boolean;
  enable_push: boolean;
  disabled_notification_types: string[];
  enable_quiet_hours: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  enable_daily_digest: boolean;
  daily_digest_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface SendNotificationData {
  recipient_ids: number[];
  title: string;
  message: string;
  notification_type: string;
  priority?: string;
  action_url?: string;
  action_text?: string;
}

// Get all notifications
export const getNotifications = async (unreadOnly: boolean = false) => {
  const endpoint = unreadOnly
    ? '/notifications/notifications/unread/'
    : '/notifications/notifications/';
  const response = await api.get<Notification[] | { results: Notification[] }>(endpoint);
  // Handle both array and paginated response
  if (Array.isArray(response.data)) {
    return response.data as Notification[];
  } else if (response.data.results) {
    return response.data.results as Notification[];
  }
  return [];
};

// Get unread notification count
export const getUnreadCount = async () => {
  const response = await api.get<{ count: number }>('/notifications/notifications/unread_count/');
  return response.data.count;
};

// Mark notification as read
export const markAsRead = async (id: number) => {
  const response = await api.post<Notification>(`/notifications/notifications/${id}/mark_as_read/`);
  return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  const response = await api.post('/notifications/notifications/mark_all_as_read/');
  return response.data;
};

// Delete notification
export const deleteNotification = async (id: number) => {
  await api.delete(`/notifications/notifications/${id}/`);
};

// Send notification (admin only)
export const sendNotification = async (data: SendNotificationData) => {
  const response = await api.post('/notifications/notifications/send_notification/', data);
  return response.data;
};

// Get notification preferences
export const getMyPreferences = async () => {
  const response = await api.get<NotificationPreference>('/notifications/preferences/my_preferences/');
  return response.data;
};

// Update notification preferences
export const updateMyPreferences = async (data: Partial<NotificationPreference>) => {
  const response = await api.patch<NotificationPreference>('/notifications/preferences/update_my_preferences/', data);
  return response.data;
};
