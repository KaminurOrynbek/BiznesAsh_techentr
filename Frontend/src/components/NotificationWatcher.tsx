import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { notificationService, type Notification } from '../services/notificationService';
import { useAuth } from '../context/useAuth';

export const NotificationWatcher: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const processedIds = useRef<Set<string>>(new Set());

    const getToastMessage = (n: Notification) => {
        const actor = n.actorUsername || 'Someone';
        switch (n.type) {
            case 'POST_LIKE': return `${actor} liked your post`;
            case 'COMMENT_LIKE': return `${actor} liked your comment`;
            case 'COMMENT': return `${actor} commented on your post`;
            default: return n.message;
        }
    };

    const handleToastClick = (n: Notification) => {
        toast.dismiss(n.id);
        if (n.postId) {
            navigate(`/post/${n.postId}${n.commentId ? `#comment-${n.commentId}` : ''}`);
        }
    };

    const pollNotifications = async () => {
        if (!user) return;

        try {
            const notifications = await notificationService.getNotifications(user.id, true);

            if (notifications && notifications.length > 0) {
                const sorted = [...notifications].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                for (const n of sorted) {
                    if (!processedIds.current.has(n.id)) {
                        toast(
                            (t) => (
                                <div
                                    onClick={() => {
                                        toast.dismiss(t.id);
                                        handleToastClick(n);
                                    }}
                                    className="flex items-center gap-3 cursor-pointer"
                                >
                                    <span className="text-xl group-hover:scale-110 transition-transform">
                                        {n.type === 'COMMENT' ? '💬' : n.type.includes('LIKE') ? '❤️' : '🔔'}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 leading-tight">
                                            {getToastMessage(n)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">Click to view</p>
                                    </div>
                                </div>
                            ),
                            {
                                id: n.id,
                                duration: 5000,
                                position: 'bottom-right',
                                style: {
                                    borderRadius: '16px',
                                    background: '#ffffff',
                                    color: '#1f2937',
                                    border: '1px solid #f1f5f9',
                                    padding: '12px 16px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                },
                            }
                        );
                        processedIds.current.add(n.id);
                    }
                }
            }
        } catch (error) {
            console.error('Error polling notifications:', error);
        }
    };

    useEffect(() => {
        if (!user) {
            processedIds.current.clear();
            return;
        }

        pollNotifications();
        const interval = setInterval(pollNotifications, 15000);
        return () => clearInterval(interval);
    }, [user]);

    return null;
};
