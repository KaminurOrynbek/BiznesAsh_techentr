import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Handshake } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `relative px-1 py-2 text-sm font-semibold transition-colors ${isActive ? "text-brand-700" : "text-slate-500 hover:text-slate-900"
  }`;

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-4 flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-brand-600 p-2 rounded-xl shadow-sm group-hover:scale-[1.02] transition">
            <Handshake className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            BiznesAsh
          </span>
        </Link>

        <nav className="flex items-center gap-4 md:gap-8">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                <NavLink to="/feed" className={itemClass}>
                  {t('community')}
                </NavLink>
                <NavLink to="/handbook" className={itemClass}>
                  {t('handbook')}
                </NavLink>
                <NavLink to="/subscriptions" className={itemClass}>
                  {t('plans')}
                </NavLink>
                <NavLink to="/experts" className={itemClass}>
                  {t('experts')}
                </NavLink>
                <NavLink to="/notifications" className={itemClass}>
                  {t('notifications')}
                </NavLink>
              </div>

              <div className="flex items-center gap-2">
                <LanguageSwitcher />

                <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden md:block" />

                <Link
                  to={`/profile/${user?.id}`}
                  className="flex items-center gap-2 group"
                  title={t('profile')}
                >
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 text-xs font-bold border border-brand-100">
                    {(user?.username?.charAt(0) || "U").toUpperCase()}
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors hidden md:block"
                >
                  {t('logout')}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link to="/login" className="btn-primary py-2 px-6 text-sm">
                {t('signIn')}
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
