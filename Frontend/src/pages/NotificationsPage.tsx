import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    } catch  {
      setError(t('failedLoadNotifications'));
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
        {n.actorUsername || t('someone')}
      </Link>
    );

    switch (n.type) {
      case 'POST_LIKE':
        return <>{actor} {t('likedYourPost')}</>;
      case 'COMMENT_LIKE':
        return <>{actor} {t('likedYourComment')}</>;
      case 'COMMENT':
        return (
          <div>
            <p>{actor} {t('commented')}: "{n.metadata?.content || '...'}"</p>
          </div>
        );
      case 'NEW_POST':
        return <>{actor} {t('createdNewPost')}</>;
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
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-2xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 transition-colors">
              <Bell className="w-8 h-8 text-blue-600" />
              {t('notificationsTitle')}
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2 border border-red-100 dark:border-red-900/30">
              <Info className="w-5 h-5" />
              {error}
            </div>
          )}

          {notifications.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-12 text-center transition-colors">
              <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t('noNotificationsYet')}</h2>
              <p className="text-slate-500 dark:text-slate-400">{t('letYouKnow')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${notification.isRead
                      ? 'border-transparent opacity-80'
                      : 'border-blue-500 dark:border-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/20'
                    } hover:border-blue-100 dark:hover:border-blue-900/50 flex items-start gap-4`}
                >
                  <div className={`p-3 rounded-xl transition-colors ${notification.isRead ? 'bg-slate-100 dark:bg-slate-800' : 'bg-blue-600 shadow-lg shadow-blue-200 dark:shadow-blue-900/30'
                    }`}>
                    {React.cloneElement(getNotificationIcon(notification.type) as React.ReactElement<any>, {
                      className: `w-6 h-6 ${notification.isRead ? 'text-slate-500 dark:text-slate-400' : 'text-white'}`
                    })}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-slate-900 dark:text-slate-100 leading-snug mb-1 text-lg transition-colors">
                      {getNotificationMessage(notification)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(notification.createdAt), 'dd.MM.yyyy HH:mm')}
                    </div>
                  </div>

                  {!notification.isRead && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2" />
                  )}

                  <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors mt-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
