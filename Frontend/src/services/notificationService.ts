import apiClient from './api';

export interface Notification {
  id: string;
  userId: string;
  type: 'comment' | 'like' | 'mention' | 'subscription';
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface EmailVerification {
  email: string;
  token: string;
  verified: boolean;
}

export const notificationService = {
  getNotifications: async (unreadOnly = false): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>('/notifications', {
      params: { unreadOnly },
    });
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await apiClient.put<Notification>(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/read-all');
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`);
  },

  subscribeToNotifications: async (subscriptionData: {
    endpoint: string;
    p256dh: string;
    auth: string;
  }): Promise<void> => {
    await apiClient.post('/notifications/subscribe', subscriptionData);
  },

  verifyEmail: async (email: string, token: string): Promise<EmailVerification> => {
    const response = await apiClient.post<EmailVerification>(
      '/verify-email',
      { email, token }
    );
    return response.data;
  },

  resendVerificationEmail: async (email: string): Promise<void> => {
    await apiClient.post('/resend-verification', { email });
  },
};
