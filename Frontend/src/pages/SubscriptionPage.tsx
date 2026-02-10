import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import apiClient from '../services/api';

const plans = [
  {
    name: 'Free',
    price: '0 KZT',
    description: 'Perfect for beginners starting their journey.',
    features: [
      'Basic educational content',
      'Community access (Public)',
      'Basic document templates',
    ],
    buttonText: 'Current Plan',
    highlight: false,
  },
  {
    name: 'Basic',
    price: '5,000 KZT',
    priceDetail: '/ month',
    description: 'For growing entrepreneurs needing more guidance.',
    features: [
      'Step-by-step registration guide',
      'Tax guidance & first report support',
      'Access to contract templates',
      'Private community (Discord/Telegram)',
    ],
    buttonText: 'Choose Basic',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '10,000 KZT',
    priceDetail: '/ month',
    description: 'Full access to expert tools and premium support.',
    features: [
      'Advanced legal templates (LLP Charter)',
      'Priority fast-track support',
      '20% discount on expert sessions',
      'Monthly webinars & workshops',
    ],
    buttonText: 'Go Pro',
    highlight: true,
  },
];

export const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState<string | null>(null);

  const handleSelectPlan = async (planName: string) => {
    if (planName === 'Free' || !user) return;

    setIsSubmitting(planName);
    try {
      await apiClient.post('/api/v1/subscriptions/subscribe', {
        userId: user.id,
        planType: planName,
        durationMonths: 1, // Defaulting to 1 month for demo
      });
      alert(`Success! You have successfully subscribed to the ${planName} plan.`);
      navigate('/feed');
    } catch (error: any) {
      console.error('Subscription error:', error);
      alert(`Failed to subscribe: ${error.response?.data?.error || 'Unknown error'}`);
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white py-20 px-4">
      <div className="max-w-6xl mx-auto mb-12">
        <button
          onClick={() => navigate('/feed')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-4 py-2 rounded-xl hover:bg-white/5"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Feed</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Choose Your Path to Success
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto">
          Scale your business with expert guidance and premium tools tailored for Kazakhstani entrepreneurs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative p-8 rounded-3xl border ${plan.highlight
              ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]'
              : 'border-slate-800 bg-slate-900/50'
              } backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                MOST POPULAR
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black">{plan.price}</span>
                {plan.priceDetail && (
                  <span className="text-slate-400">{plan.priceDetail}</span>
                )}
              </div>
              <p className="text-slate-400 leading-relaxed">
                {plan.description}
              </p>
            </div>

            <div className="space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-300 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan(plan.name)}
              disabled={plan.name === 'Free' || isSubmitting !== null}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.highlight
                ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                : plan.name === 'Free'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-100 text-[#0f172a]'
                } ${isSubmitting === plan.name ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isSubmitting === plan.name ? 'Processing...' : plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center text-slate-500 text-sm max-w-md mx-auto">
        <p>All plans include access to our basic support and monthly newsletter. Pricing in Kazakhstani Tenge (KZT).</p>
      </div>
    </div>
  );
};
