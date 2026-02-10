import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar, Loading, Alert, Button, Input } from "../components";
import type { User as UserType } from "../services/authService";
import { authService } from "../services/authService";
import apiClient from "../services/api";
import { useAuth } from "../context/useAuth";
import {
  User,
  Settings,
  ShieldCheck,
  Calendar,
  CreditCard,
  Clock,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [user, setUser] = useState<UserType | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "subscription" | "bookings">("profile");

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [userId, authUser]);

  const fetchData = async () => {
    // If authUser is not loaded yet, wait or handle it? 
    // Actually authUser might be null if not logged in.
    // But this page is protected route usually.

    setIsLoading(true);
    setError("");
    try {
      // Determine if viewing own profile
      // If no userId param, it's own profile (default /profile route)
      // If userId param matches authUser.id, it's own profile
      const isOwnProfile = !userId || (authUser && userId === authUser.id);

      let targetUser: UserType;

      if (isOwnProfile) {
        if (!authUser) {
          // Should not happen in protected route, but safety check
          // Try to fetch current user if authUser is stale/null?
          targetUser = await authService.getCurrentUser();
        } else {
          targetUser = authUser;
        }
      } else {
        targetUser = await authService.getUserById(userId!);
      }

      setUser(targetUser);
      setUsername(targetUser.username ?? "");
      setEmail(targetUser.email ?? "");

      // Fetch Subscriptions & Bookings ONLY if it's own profile (these are private)
      if (isOwnProfile) {
        try {
          const subResp = await apiClient.get(`/api/v1/subscriptions/${targetUser.id}`);
          setSubscription(subResp.data);
        } catch (e) {
          console.log("No active subscription");
        }

        try {
          const bookResp = await apiClient.get(`/api/v1/consultations/user/${targetUser.id}`);
          setBookings(bookResp.data || []);
        } catch (e) {
          console.log("No bookings found");
        }
      } else {
        setSubscription(null);
        setBookings([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profileError', { defaultValue: 'Failed to load profile' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setError("");
    try {
      const updatedUser = await authService.updateProfile(user.id, {
        username,
        email,
      });
      setUser(updatedUser);
      setIsEditing(false);
      alert(t('profileUpdatedSuccess', { defaultValue: 'Profile updated successfully!' }));
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSubscription = async (id: string) => {
    if (!window.confirm(t('cancelSubscriptionConfirm'))) return;
    try {
      await apiClient.post("/api/v1/subscriptions/cancel", { id });
      alert("Subscription cancelled successfully.");
      fetchData(); // Refresh
    } catch (err) {
      alert(t('cancelSubscriptionError', { defaultValue: 'Failed to cancel subscription' }));
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm(t('cancelBookingConfirm'))) return;
    try {
      await apiClient.post("/api/v1/consultations/cancel", { bookingId });
      alert("Consultation cancelled successfully.");
      fetchData(); // Refresh
    } catch (err) {
      alert(t('cancelBookingError', { defaultValue: 'Failed to cancel booking' }));
    }
  };

  const getTimeRemaining = (expiry: string) => {
    const total = Date.parse(expiry) - Date.parse(new Date().toISOString());
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return days > 0 ? t('daysLeft', { count: days }) : t('expiredToday');
  };

  if (isLoading) return <><Navbar /><div className="min-h-screen bg-[#0f172a] pt-20"><Loading /></div></>;

  // Check if viewing own profile for render
  const isOwnProfile = !userId || (authUser && user?.id === authUser.id);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === "profile" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-gray-400 hover:bg-white/5"
                }`}
            >
              <User size={20} />
              <span className="font-medium">{t('profileDetails')}</span>
            </button>

            {/* Only show these if viewing own profile */}
            {isOwnProfile && (
              <>
                <button
                  onClick={() => setActiveTab("subscription")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === "subscription" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-gray-400 hover:bg-white/5"
                    }`}
                >
                  <CreditCard size={20} />
                  <span className="font-medium">{t('mySubscription')}</span>
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === "bookings" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-gray-400 hover:bg-white/5"
                    }`}
                >
                  <Calendar size={20} />
                  <span className="font-medium">{t('consultations')}</span>
                </button>
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Settings className="text-blue-400" /> {t('accountProfile')}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">{t('manageInfo')}</p>
                  </div>
                  {!isEditing && isOwnProfile && (
                    <Button variant="secondary" onClick={() => setIsEditing(true)}>
                      {t('editProfile')}
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-6 max-w-md">
                    <Input
                      label="Username"
                      value={username}
                      onChange={(e: any) => setUsername(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                    <div className="flex space-x-4 pt-4">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? t('saving') : t('saveChanges')}
                      </Button>
                      <Button variant="secondary" onClick={() => setIsEditing(false)}>{t('cancel')}</Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('usernameLabel')}</label>
                      <p className="text-lg font-medium">{user?.username || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('emailLabel')}</label>
                      <p className="text-lg font-medium">{user?.email || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('memberSince')}</label>
                      <p className="text-lg font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('security')}</label>
                      <p className="text-green-400 flex items-center gap-1 font-medium">
                        <ShieldCheck size={16} /> {t('verifiedAccount')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "subscription" && (
              <div className="space-y-6">
                {subscription ? (
                  <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="px-3 py-1 rounded-full bg-blue-500 text-xs font-bold uppercase tracking-widest text-white">
                          {t('activePlan')}
                        </span>
                        <h2 className="text-4xl font-extrabold mt-3">{subscription.plan_type}</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">{t('status')}</p>
                        <p className="text-green-400 font-bold uppercase tracking-tight">{subscription.status}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center space-x-4">
                        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                          <Clock size={24} />
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">{t('accessExpiresIn')}</p>
                          <p className="font-bold text-lg">{getTimeRemaining(subscription.ends_at)}</p>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center space-x-4">
                        <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">{t('billingDate')}</p>
                          <p className="font-bold text-lg">{new Date(subscription.starts_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="secondary" onClick={() => navigate("/subscriptions")}>{t('upgradePlan')}</Button>
                      <button
                        onClick={() => handleCancelSubscription(subscription.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors text-sm font-medium underline"
                      >
                        {t('cancelAutoRenewal')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <AlertCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t('noActivePlan')}</h3>
                    <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                      {t('unlockAccess')}
                    </p>
                    <Button onClick={() => navigate("/subscriptions")}>{t('explorePlans')}</Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{t('yourConsultations')}</h2>
                  <Button onClick={() => navigate("/experts")} size="sm" variant="secondary">{t('bookNew')}</Button>
                </div>

                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-600/20 p-3 rounded-full text-blue-400">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{t('consultationWith', { name: booking.expert_name || "Expert" })}</h4>
                            <div className="flex items-center text-sm text-gray-400 gap-3 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock size={14} /> {new Date(booking.scheduled_at).toLocaleDateString()} at {new Date(booking.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest ${booking.status === 'PAID' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <a
                            href={booking.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                          >
                            <ExternalLink size={16} /> {t('joinSession')}
                          </a>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="p-2 text-gray-500 hover:text-red-400 transition-all rounded-lg hover:bg-red-400/10" title={t('cancelBooking')}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-gray-400">
                    <p>{t('noBookings')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
