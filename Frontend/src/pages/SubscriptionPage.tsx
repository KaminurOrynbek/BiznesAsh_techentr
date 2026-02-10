import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import apiClient from '../services/api';

const plans = [
  {
    nameKey: 'planFree',
    price: '0 KZT',
    descriptionKey: 'planFreeDesc',
    featuresKeys: [
      'planFreeF1',
      'planFreeF2',
      'planFreeF3',
    ],
    buttonTextKey: 'currentPlan',
    highlight: false,
  },
  {
    nameKey: 'planBasic',
    price: '5,000 KZT',
    priceDetailKey: 'perMonth',
    descriptionKey: 'planBasicDesc',
    featuresKeys: [
      'planBasicF1',
      'planBasicF2',
      'planBasicF3',
      'planBasicF4',
    ],
    buttonTextKey: 'chooseBasic',
    highlight: false,
  },
  {
    nameKey: 'planPro',
    price: '10,000 KZT',
    priceDetailKey: 'perMonth',
    descriptionKey: 'planProDesc',
    featuresKeys: [
      'planProF1',
      'planProF2',
      'planProF3',
      'planProF4',
    ],
    buttonTextKey: 'goPro',
    highlight: true,
  },
];

export const SubscriptionPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState<string | null>(null);

  const handleSelectPlan = async (planKey: string) => {
    const planName = t(planKey);
    if (planKey === 'planFree' || !user) return;

    setIsSubmitting(planKey);
    try {
      await apiClient.post('/api/v1/subscriptions/subscribe', {
        userId: user.id,
        planType: planName,
        durationMonths: 1, // Defaulting to 1 month for demo
      });
      alert(t('subscriptionSuccess', { plan: planName }));
      navigate('/feed');
    } catch (error: any) {
      console.error('Subscription error:', error);
      alert(t('subscriptionFailed', { error: error.response?.data?.error || 'Unknown error' }));
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-20 px-4 transition-colors">
      <div className="max-w-6xl mx-auto mb-12">
        <button
          onClick={() => navigate('/feed')}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors group px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-white/5 shadow-sm hover:shadow border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">{t('backToFeed')}</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
          {t('choosePathTitle')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xl max-w-2xl mx-auto">
          {t('choosePathSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.nameKey}
            className={`relative p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-xl ${plan.highlight
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/5 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] dark:shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50'
              } backdrop-blur-xl`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide shadow-lg">
                {t('mostPopular')}
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{t(plan.nameKey)}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                {plan.priceDetailKey && (
                  <span className="text-slate-500 dark:text-slate-400">{t(plan.priceDetailKey)}</span>
                )}
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(plan.descriptionKey)}
              </p>
            </div>

            <div className="space-y-4 mb-10">
              {plan.featuresKeys.map((fKey, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{t(fKey)}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan(plan.nameKey)}
              disabled={plan.nameKey === 'planFree' || isSubmitting !== null}
              className={`w-full py-4 rounded-2xl font-bold transition-all shadow-md active:scale-95 ${plan.highlight
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : plan.nameKey === 'planFree'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                  : 'bg-white dark:bg-slate-100 hover:bg-slate-50 dark:hover:bg-white text-slate-900 dark:text-[#0f172a] border border-slate-200 dark:border-transparent'
                } ${isSubmitting === plan.nameKey ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isSubmitting === plan.nameKey ? t('processing') : t(plan.buttonTextKey)}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center text-slate-500 text-sm max-w-md mx-auto">
        <p>{t('plansNotice')}</p>
      </div>
    </div>
  );
};
