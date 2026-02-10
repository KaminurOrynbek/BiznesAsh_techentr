import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import apiClient from '../services/api';
import { Button } from '../components';

const experts = [
    {
        id: '11111111-1111-1111-1111-111111111111',
        nameKey: 'almasName',
        specializationKey: 'almasSpecialization',
        bioKey: 'almasBio',
        price: '25,000 KZT',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
    },
    {
        id: '22222222-2222-2222-2222-222222222222',
        nameKey: 'zhibekName',
        specializationKey: 'zhibekSpecialization',
        bioKey: 'zhibekBio',
        price: '25,000 KZT',
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    },
];

const mockSlots = ["09:00", "10:30", "14:00", "16:30"];
// Generate next 7 days for the "calendar"
const calendarDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    d.setHours(0, 0, 0, 0);
    return d;
});

export const ExpertListingPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const [userBookings, setUserBookings] = useState<any[]>([]);
    const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    // Dynamic slot names based on language if needed, but here slots are times.
    // Locale for date display
    const currentLocale = i18n.language === 'en' ? 'en-US' : (i18n.language === 'kk' ? 'kk-KZ' : 'ru-RU');

    useEffect(() => {
        if (user) fetchUserBookings();
    }, [user]);

    const fetchUserBookings = async () => {
        try {
            const resp = await apiClient.get(`/api/v1/consultations/user/${user?.id}`);
            setUserBookings(resp.data || []);
        } catch (e) {
            console.error("Failed to fetch bookings");
        }
    };

    const hasActiveBooking = (expertId: string) => {
        return userBookings.some(b => b.expert_id === expertId && (b.status === 'PENDING' || b.status === 'PAID'));
    };

    const handleBook = async (expert: any) => {
        if (!user || !selectedSlot || !selectedDate) return;

        setIsSubmitting(expert.id);

        const bookingDate = new Date(selectedDate);
        const [hours, minutes] = selectedSlot.split(':');
        bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        try {
            await apiClient.post('/api/v1/consultations/book', {
                userId: user.id,
                expertId: expert.id,
                expertName: t(expert.nameKey),
                scheduledAt: bookingDate.toISOString(),
            });
            alert(t('successBooking', {
                name: t(expert.nameKey),
                time: selectedSlot,
                date: bookingDate.toLocaleDateString(currentLocale)
            }));
            navigate('/profile');
        } catch (error: any) {
            console.error('Booking error:', error);
            alert(t('failedBooking', { error: error.response?.data?.error || 'Unknown error' }));
        } finally {
            setIsSubmitting(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12 flex flex-col gap-6">
                    <button
                        onClick={() => navigate('/feed')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group self-start"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold">{t('backToFeed')}</span>
                    </button>

                    <div>
                        <h1 className="text-4xl font-extrabold mb-2">{t('expertConsultations')}</h1>
                        <p className="text-slate-400 text-lg">
                            {t('expertConsultationsSubtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {experts.map((expert) => {
                            const active = hasActiveBooking(expert.id);
                            const current = selectedExpert === expert.id;

                            return (
                                <div
                                    key={expert.id}
                                    className={`bg-white/5 border rounded-3xl p-8 transition-all relative overflow-hidden ${current ? 'border-blue-500 shadow-xl shadow-blue-500/10' : 'border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <img
                                            src={expert.image}
                                            alt={t(expert.nameKey)}
                                            className="w-32 h-32 rounded-2xl object-cover ring-4 ring-white/5"
                                        />

                                        <div className="flex-grow">
                                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                                                <h3 className="text-2xl font-bold">{t(expert.nameKey)}</h3>
                                                <div className="flex items-center text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg text-sm">
                                                    ★ <span>{expert.rating}</span>
                                                </div>
                                            </div>

                                            <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                                {t(expert.specializationKey)}
                                            </div>

                                            <p className="text-slate-400 leading-relaxed max-w-2xl mb-6">
                                                {t(expert.bioKey)}
                                            </p>

                                            {/* Booking Section */}
                                            {active ? (
                                                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 w-fit px-4 py-3 rounded-xl border border-green-400/20">
                                                    <CheckCircle2 size={20} />
                                                    <span className="font-bold">{t('activeBookingNotice')}</span>
                                                </div>
                                            ) : current ? (
                                                <div className="space-y-6 pt-4 border-t border-white/5">
                                                    <div>
                                                        <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-3">
                                                            <Calendar size={16} /> {t('selectDate')}
                                                        </label>
                                                        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                                                            {calendarDays.map((date) => (
                                                                <button
                                                                    key={date.toISOString()}
                                                                    onClick={() => setSelectedDate(date)}
                                                                    className={`flex flex-col items-center p-2 rounded-xl transition-all border ${selectedDate?.toDateString() === date.toDateString()
                                                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                                        }`}
                                                                >
                                                                    <span className="text-[10px] uppercase font-bold opacity-60">
                                                                        {date.toLocaleDateString(currentLocale, { weekday: 'short' })}
                                                                    </span>
                                                                    <span className="text-lg font-black">
                                                                        {date.getDate()}
                                                                    </span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-3">
                                                            <Clock size={16} /> {t('availableSlots')}
                                                        </label>
                                                        <div className="flex flex-wrap gap-3">
                                                            {mockSlots.map((slot) => (
                                                                <button
                                                                    key={slot}
                                                                    onClick={() => setSelectedSlot(slot)}
                                                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${selectedSlot === slot
                                                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                                        }`}
                                                                >
                                                                    {slot}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4 pt-2">
                                                        <Button
                                                            onClick={() => handleBook(expert)}
                                                            disabled={!selectedSlot || !selectedDate || isSubmitting !== null}
                                                            className="flex-grow md:flex-none md:w-48"
                                                        >
                                                            {isSubmitting === expert.id ? t('confirming') : t('confirmBooking')}
                                                        </Button>
                                                        <Button variant="secondary" onClick={() => {
                                                            setSelectedExpert(null);
                                                            setSelectedDate(null);
                                                            setSelectedSlot(null);
                                                        }}>{t('cancel')}</Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                                                    <div>
                                                        <p className="text-slate-500 text-xs font-bold uppercase mb-1">{t('sessionPrice')}</p>
                                                        <p className="text-2xl font-black">{expert.price}</p>
                                                    </div>
                                                    <Button onClick={() => {
                                                        setSelectedExpert(expert.id);
                                                        setSelectedSlot(null);
                                                        setSelectedDate(null);
                                                    }}>
                                                        {t('bookSession')}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
