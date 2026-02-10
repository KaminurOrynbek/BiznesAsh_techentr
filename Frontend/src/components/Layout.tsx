import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, BookOpen, Home, MessageSquare, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useTranslation } from "react-i18next";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              BiznesAsh
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-bold">
            <Link
              to="/handbook"
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${isActive("/handbook") ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
                }`}
            >
              Handbook
            </Link>

            <Link
              to="/feed"
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${isActive("/feed") ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
                }`}
            >
              Community
            </Link>

            <Link
              to="/notifications"
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${isActive("/notifications") ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
                }`}
            >
              Notifications
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/profile"
              className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <User className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 transition-colors">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                BiznesAsh
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                Step-by-step business platform and community for entrepreneurs in Kazakhstan.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 dark:text-white">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li>
                  <Link to="/handbook" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Guide
                  </Link>
                </li>
                <li>
                  <Link to="/feed" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/notifications" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Notifications
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 dark:text-white">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                    About
                  </a>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">
                    {t('contact', { defaultValue: 'Contact' })}
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 dark:text-white">Connect</h4>
              <div className="flex space-x-3">
                <div className="h-9 w-9 bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div className="h-9 w-9 bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div className="h-9 w-9 bg-slate-100 dark:bg-slate-800 rounded-full" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} BiznesAsh. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex justify-around z-50">
        <Link to="/" className={`flex flex-col items-center p-2 ${isActive("/") ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
          <Home className="h-5 w-5" />
          <span className="text-[10px] mt-1">Home</span>
        </Link>

        <Link to="/handbook" className={`flex flex-col items-center p-2 ${isActive("/handbook") ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
          <BookOpen className="h-5 w-5" />
          <span className="text-[10px] mt-1">Guide</span>
        </Link>

        <Link to="/feed" className={`flex flex-col items-center p-2 ${isActive("/feed") ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px] mt-1">Feed</span>
        </Link>

        <Link to="/notifications" className={`flex flex-col items-center p-2 ${isActive("/notifications") ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
          <Bell className="h-5 w-5" />
          <span className="text-[10px] mt-1">Alerts</span>
        </Link>

        <Link to="/profile" className={`flex flex-col items-center p-2 ${isActive("/profile") ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
          <User className="h-5 w-5" />
          <span className="text-[10px] mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};
