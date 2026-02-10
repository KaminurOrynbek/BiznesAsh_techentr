import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Navbar } from "../components";
import logo from "../assets/logo.jpeg";
import { useTranslation } from "react-i18next";

import {
  ArrowRight,
  CheckCircle,
  Users,
  FileText,
  Shield,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

// shadcn/ui
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const howItWorksSteps = [
    {
      icon: FileText,
      title: t('step1Title'),
      desc: t('step1Desc'),
    },
    {
      icon: CheckCircle,
      title: t('step2Title'),
      desc: t('step2Desc'),
    },
    {
      icon: Shield,
      title: t('step3Title'),
      desc: t('step3Desc'),
    },
    {
      icon: Users,
      title: t('step4Title'),
      desc: t('step4Desc'),
    },
  ];

  const audienceCards = [
    { title: t('audience1'), icon: Lightbulb },
    { title: t('audience2'), icon: TrendingUp },
    { title: t('audience3'), icon: Users },
    { title: t('audience4'), icon: FileText },
  ];

  return (
    <>
      <Navbar />

      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background image + gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1683334087142-3036da3628dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
              alt="Modern office"
              className="w-full h-full object-cover opacity-10"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-slate-50" />
          </div>

          <div className="container-page relative z-10 text-center">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2" />
              {t('nowAvailable')}
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl mb-6">
              {t('heroTitle')}{" "}
              <span className="text-blue-600">{t('heroTitleHighlight')}</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-slate-600 mb-10">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base"
                    >
                      {t('startJourney')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Link to="/login" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto h-12 text-base border-slate-300 hover:bg-slate-50"
                    >
                      {t('exploreGuide')}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/feed" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base">
                      {t('goToCommunity')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Link to="/handbook" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-transparent border border-slate-300 text-slate-900 hover:bg-slate-50 px-8 h-12 text-base">
                      {t('exploreGuide')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="container-page">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {t('howItWorks')}
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                {t('howItWorksSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, i) => (
                <div
                  key={i}
                  className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-20 bg-slate-50">
          <div className="container-page">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white flex items-center justify-center min-h-[420px]">
                  <img
                    src={logo}
                    alt="BiznesAsh logo"
                    className="max-h-[320px] w-auto object-contain"
                    loading="lazy"
                  />
                </div>

              </div>

              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
                  {t('whyChoose')}
                </h2>

                <ul className="space-y-4">
                  {[
                    t('reason1'),
                    t('reason2'),
                    t('reason3'),
                    t('reason4'),
                    t('reason5'),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-teal-500 mr-3 flex-shrink-0" />
                      <span className="text-lg text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link to={isAuthenticated ? "/feed" : "/register"}>
                    <Button className="bg-slate-900 text-white hover:bg-slate-800">
                      {t('getStartedNow')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-20 bg-white">
          <div className="container-page text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-12">
              {t('whoIsThisFor')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {audienceCards.map((audience, i) => (
                <Card
                  key={i}
                  className="border-none shadow-md hover:shadow-lg transition-all bg-slate-50"
                >
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <audience.icon className="h-10 w-10 text-blue-600 mb-4" />
                    <h3 className="font-semibold text-lg text-slate-900">
                      {audience.title}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Future Vision Banner */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container-page text-center">
            <h2 className="text-2xl font-bold mb-4">
              {t('futureVisionTitle')}
            </h2>

            <p className="max-w-2xl mx-auto text-blue-100 mb-8">
              {t('futureVisionDesc')}
            </p>

            <div className="flex justify-center flex-wrap gap-3 text-sm font-medium text-blue-200">
              <span>Expert Consultations</span>
              <span>•</span>
              <span>Partner Integrations</span>
              <span>•</span>
              <span>Advanced Tools</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
