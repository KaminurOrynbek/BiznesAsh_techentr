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
        <section className="relative py-20 md:py-32 overflow-hidden transition-colors">
          {/* Background image + gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1683334087142-3036da3628dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
              alt="Modern office"
              className="w-full h-full object-cover opacity-10 dark:opacity-5"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-muted transition-colors" />
          </div>

          <div className="container-page relative z-10 text-center">
            <div className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-300 mb-6 transition-colors">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2" />
              {t('nowAvailable')}
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl mb-6 transition-colors">
              {t('heroTitle')}{" "}
              <span className="text-blue-600 dark:text-blue-400">{t('heroTitleHighlight')}</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 transition-colors">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-8 h-12 text-base transition-all"
                    >
                      {t('startJourney')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Link to="/login" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto h-12 text-base border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-foreground"
                    >
                      {t('exploreGuide')}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/feed" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-8 h-12 text-base transition-all">
                      {t('goToCommunity')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Link to="/handbook" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-transparent border border-slate-300 dark:border-slate-800 text-foreground hover:bg-slate-50 dark:hover:bg-slate-900 px-8 h-12 text-base transition-all">
                      {t('exploreGuide')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-background transition-colors">
          <div className="container-page">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl transition-colors">
                {t('howItWorks')}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground transition-colors">
                {t('howItWorksSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, i) => (
                <div
                  key={i}
                  className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-muted/50 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4 transition-colors">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground transition-colors">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-20 bg-muted/30 transition-colors">
          <div className="container-page">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 flex items-center justify-center min-h-[420px] transition-colors">
                  <img
                    src={logo}
                    alt="BiznesAsh logo"
                    className="max-h-[320px] w-auto object-contain dark:brightness-90"
                    loading="lazy"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6 transition-colors">
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
                      <CheckCircle className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-lg text-slate-700 dark:text-slate-300 transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link to={isAuthenticated ? "/feed" : "/register"}>
                    <Button className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-all">
                      {t('getStartedNow')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-20 bg-background transition-colors">
          <div className="container-page text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-12 transition-colors">
              {t('whoIsThisFor')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {audienceCards.map((audience, i) => (
                <Card
                  key={i}
                  className="border-none shadow-md hover:shadow-lg transition-all bg-muted/50"
                >
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <audience.icon className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4 transition-colors" />
                    <h3 className="font-semibold text-lg text-foreground transition-colors">
                      {audience.title}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Future Vision Banner */}
        <section className="py-16 bg-blue-600 dark:bg-blue-700 text-white transition-colors">
          <div className="container-page text-center">
            <h2 className="text-2xl font-bold mb-4">
              {t('futureVisionTitle')}
            </h2>

            <p className="max-w-2xl mx-auto text-blue-100 dark:text-blue-200 mb-8 transition-colors">
              {t('futureVisionDesc')}
            </p>

            <div className="flex justify-center flex-wrap gap-3 text-sm font-medium text-blue-200 dark:text-blue-300 transition-colors">
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
