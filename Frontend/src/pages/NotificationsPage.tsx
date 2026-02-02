import React from "react";
import { Bell, MessageCircle, Star, Info } from "lucide-react";
import { Card, Button, Navbar } from "../components";

type Notif = {
  id: number;
  type: "reply" | "system" | "like";
  title: string;
  message: string;
  time: string;
  read: boolean;
  Icon: React.ElementType;
  badgeClass: string;
};

const NOTIFICATIONS: Notif[] = [
  {
    id: 1,
    type: "reply",
    Icon: MessageCircle,
    badgeClass: "text-blue-600 bg-blue-100",
    title: "New Reply",
    message:
      "Dana S. replied to your question about banking: 'Kaspi Business is great for IEs...'",
    time: "10 mins ago",
    read: false,
  },
  {
    id: 2,
    type: "system",
    Icon: Info,
    badgeClass: "text-slate-600 bg-slate-100",
    title: "Platform Update",
    message: "We've updated the Tax Guide with new 2026 regulations.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 3,
    type: "like",
    Icon: Star,
    badgeClass: "text-yellow-700 bg-yellow-100",
    title: "New Like",
    message: "Your post 'Looking for a co-founder' received 5 new likes.",
    time: "3 days ago",
    read: true,
  },
];

export const NotificationsPage: React.FC = () => {
  return (
    <>
      <Navbar />

      <div className="bg-slate-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
            <Button variant="ghost" className="text-sm">
              Mark all as read
            </Button>
          </div>

          <div className="space-y-4">
            {NOTIFICATIONS.map((notif) => (
              <Card
                key={notif.id}
                className={`border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow ${
                  !notif.read ? "border-l-4 border-l-blue-600" : ""
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notif.badgeClass}`}
                  >
                    <notif.Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-semibold ${
                          !notif.read ? "text-slate-900" : "text-slate-600"
                        }`}
                      >
                        {notif.title}
                      </h3>
                      <span className="text-xs text-slate-400">{notif.time}</span>
                    </div>

                    <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                  </div>
                </div>
              </Card>
            ))}

            {NOTIFICATIONS.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
