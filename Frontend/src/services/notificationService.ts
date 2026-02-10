import apiClient from './api';

export interface Notification {
  id: string;
  userId: string;
  actorId: string;
  actorUsername: string;
  type: 'COMMENT' | 'POST_LIKE' | 'COMMENT_LIKE' | 'NEW_POST' | 'POST_UPDATE' | 'REPORT' | 'WELCOME' | 'SYSTEM';
  message: string;
  postId?: string;
  commentId?: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface EmailVerification {
  email: string;
  token: string;
  verified: boolean;
}

export const notificationService = {
  getNotifications: async (userId: string, unreadOnly = false): Promise<Notification[]> => {
    const response = await apiClient.get<any[]>('/notifications', {
      params: { userId, unreadOnly },
    });

    return response.data.map(n => ({
      ...n,
      actorId: n.actorId || n.data?.actor_id || n.data?.actorId,
      actorUsername: n.actorUsername || n.data?.actor_username || n.data?.actorUsername,
      postId: n.postId || n.data?.post_id || n.data?.postId,
      commentId: n.commentId || n.data?.comment_id || n.data?.commentId,
      metadata: n.metadata || (n.data?.metadata ? JSON.parse(n.data.metadata) : n.metadata)
    }));
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

  verifyEmail: async (email: string, code: string): Promise<any> => {
    const response = await apiClient.post<any>(
      '/auth/verify-email',
      { email, code }
    );
    return response.data;
  },

  resendVerificationEmail: async (email: string): Promise<void> => {
    await apiClient.post('/auth/resend-code', { email });
  },
};
