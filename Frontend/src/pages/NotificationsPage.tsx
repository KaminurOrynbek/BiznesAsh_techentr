import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { notificationService, type Notification } from '../services/notificationService';
import { useAuth } from '../context/useAuth';
import {
  Bell,
  Heart,
  MessageCircle,
  AlertTriangle,
  Info,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { Navbar } from '../components';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'POST_LIKE':
      case 'COMMENT_LIKE':
        return <Heart className="w-5 h-5 text-red-500 fill-current" />;
      case 'COMMENT':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'REPORT':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-purple-500" />;
    }
  };

  const getNotificationMessage = (n: Notification) => {
    const actor = (
      <Link
        to={`/profile/${n.actorId}`}
        className="font-bold hover:underline text-blue-600"
        onClick={(e) => e.stopPropagation()}
      >
        {n.actorUsername || 'Someone'}
      </Link>
    );

    switch (n.type) {
      case 'POST_LIKE':
        return <>{actor} liked your post</>;
      case 'COMMENT_LIKE':
        return <>{actor} liked your comment</>;
      case 'COMMENT':
        return (
          <div>
            <p>{actor} commented: "{n.metadata?.content || '...'}"</p>
          </div>
        );
      case 'NEW_POST':
        return <>{actor} created a new post</>;
      default:
        return n.message;
    }
  };

  const handleNotificationClick = async (n: Notification) => {
    // Navigate based on type
    if (n.postId) {
      navigate(`/post/${n.postId}${n.commentId ? `#comment-${n.commentId}` : ''}`);
    }

    if (!n.isRead) {
      try {
        await notificationService.markAsRead(n.id);
        setNotifications(prev =>
          prev.map(notif => notif.id === n.id ? { ...notif, isRead: true } : notif)
        );
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" />
            Notifications
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2 border border-red-100">
            <Info className="w-5 h-5" />
            {error}
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h2>
            <p className="text-gray-500">We'll let you know when something happens!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`group bg-white rounded-2xl p-4 shadow-sm border-2 transition-all cursor-pointer hover:shadow-md hover:border-blue-100 flex items-start gap-4 ${notification.isRead ? 'border-transparent opacity-80' : 'border-blue-500 ring-4 ring-blue-50'
                  }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${notification.isRead ? 'bg-gray-100' : 'bg-blue-600 shadow-lg shadow-blue-200'
                  }`}>
                  {React.cloneElement(getNotificationIcon(notification.type) as React.ReactElement<any>, {
                    className: `w-6 h-6 ${notification.isRead ? 'text-gray-500' : 'text-white'}`
                  })}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-gray-900 leading-snug mb-1 text-lg">
                    {getNotificationMessage(notification)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(notification.createdAt), 'dd.MM.yyyy HH:mm')}
                  </div>
                </div>

                {!notification.isRead && (
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2" />
                )}

                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors mt-2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
