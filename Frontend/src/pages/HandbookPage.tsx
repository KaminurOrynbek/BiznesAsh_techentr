import React, { useState } from "react";
import {
  Book, 
  Target, 
  FileText, 
  Briefcase, 
  DollarSign, 
  CreditCard, 
  Cpu, 
  GraduationCap, 
  Users, 
  Heart, 
  MapPin, 
  AlertTriangle,
  Lightbulb,
  CheckSquare,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";

// --------------------
// TYPES
// --------------------

type Language = "en" | "ru" | "kz";

interface ChapterContent {
  id: string;
  title: string;
  icon: React.ElementType;
  purpose?: string;
  description: string;
  actions: string[];
  examples?: string[];
  tip?: string;
  details?: React.ReactNode;
}

// --------------------
// DATA
// --------------------

const HANDBOOK_DATA: Record<Language, ChapterContent[]> = {
  en: [
    {
      id: "niche",
      title: "1. Define Your Business Niche",
      icon: Target,
      purpose: "Strategic thinking",
      description: "Before registering a business, it is essential to understand what you will sell and who your customers are. This decision affects taxation, registration form, and required licenses.",
      actions: [
        "Decide whether you will sell goods or services",
        "Identify your skills, experience, or resources",
        "Analyze demand in your area (competitors, customer needs)"
      ],
      examples: [
        "A teacher can open an educational center",
        "An accountant can provide accounting and audit services",
        "A barista can offer coffee-to-go services"
      ],
      tip: "Many successful small businesses in Kazakhstan start as home-based services to reduce costs in the first year."
    },
    {
      id: "plan",
      title: "2. Business Plan Draft",
      icon: FileText,
      purpose: "Financial and risk awareness",
      description: "You don't need a 100-page document, but you need to know your numbers. Failing to plan is planning to fail.",
      actions: [
        "Calculate startup costs (equipment, rent, licenses)",
        "Identify funding sources (savings, loans, grants)",
        "Draft a development strategy for the first 6-12 months",
        "List potential risks and how to mitigate them"
      ],
      tip: "At early stages, working from home can significantly reduce costs. Don't rent an office unless absolutely necessary."
    },
    {
      id: "types",
      title: "3. Types of Entrepreneurship",
      icon: Briefcase,
      purpose: "Legal structure",
      description: "Choosing the right legal form is crucial. In Kazakhstan, the two most common forms are Individual Entrepreneur (IE/IP) and Limited Liability Partnership (LLP/TOO).",
      actions: [
        "Review eligibility for IE (Citizens, Kandas, EAEU residents)",
        "Determine if you need partners (Requires LLP)",
        "Check liability differences (IE = Personal liability, LLP = Limited to capital)"
      ],
      details: (
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-blue-900">Individual Entrepreneur (IE)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800">
              <ul className="list-disc pl-4 space-y-1">
                <li>Fast registration online (eGov, Bank apps)</li>
                <li>No office required</li>
                <li>Simpler reporting</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-slate-50 border-slate-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-slate-900">LLP (Partnership)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              <ul className="list-disc pl-4 space-y-1">
                <li>Best for partners & scaling</li>
                <li>Requires Charter (rules)</li>
                <li>Liability limited to capital</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "tax",
      title: "4. Taxation Regimes",
      icon: DollarSign,
      purpose: "Financial Efficiency",
      description: "Choosing the right tax regime can save you millions. Most small businesses choose a Special Tax Regime (STR) over the General Regime.",
      actions: [
        "Estimate your annual turnover",
        "Count expected employees",
        "Select a regime: Patent, Simplified Declaration, or Retail Tax"
      ],
      details: (
        <div className="space-y-3 mt-4">
          <div className="p-3 border rounded-lg bg-white">
            <div className="font-semibold">Simplified Declaration</div>
            <div className="text-sm text-slate-600">3% tax on turnover. Limit: ~24,038 MCI income. Up to 30 employees.</div>
          </div>
          <div className="p-3 border rounded-lg bg-white">
            <div className="font-semibold">Patent</div>
            <div className="text-sm text-slate-600">1% tax paid in advance. No employees allowed. Good for solo artisans.</div>
          </div>
          <div className="p-3 border rounded-lg bg-white">
            <div className="font-semibold">Retail Tax</div>
            <div className="text-sm text-slate-600">4% (individuals) / 8% (companies). Higher turnover limits. Specific sectors only.</div>
          </div>
        </div>
      )
    },
    {
      id: "kkm",
      title: "5. Cash Registers (KKM)",
      icon: CreditCard,
      purpose: "Compliance",
      description: "If you accept cash or bank cards, you MUST have a Cash Register (KKM). It transmits data to tax authorities.",
      actions: [
        "Register a KKM before accepting first payment",
        "Choose between physical device or mobile app (Webkassa, Rekassa, etc.)",
        "Ensure it supports QR payments if needed"
      ],
      tip: "KKM must be registered before you start working with clients to avoid fines."
    },
    {
      id: "automation",
      title: "6. Outsourcing & Automation",
      icon: Cpu,
      purpose: "Efficiency & Scalability",
      description: "You don't need to hire full-time staff for everything. Use modern tools and outsourcing to keep costs low.",
      actions: [
        "Outsource Accounting, Marketing, and IT",
        "Use bots (Telegram/WhatsApp) for customer FAQs",
        "Implement a CRM system early"
      ],
      tip: "Pay for results, not just for employees sitting in an office."
    },
    {
      id: "grants",
      title: "7. Grants & State Support",
      icon: GraduationCap,
      purpose: "Funding & Education",
      description: "The government offers training and non-repayable grants to support new businesses.",
      actions: [
        "Check 'Bastau Business' on skills.enbek.kz (Free training)",
        "Apply for grants up to 400 MCI (for specific social groups)",
        "Prepare documents for grant usage (Equipment, Rent, etc.)"
      ]
    },
    {
      id: "support",
      title: "8. Non-Financial Support",
      icon: Users,
      purpose: "Consulting",
      description: "Atameken and Entrepreneur Service Centers (ЦОП) provide free consulting for businesses.",
      actions: [
        "Visit a local CSC (ЦОП) office",
        "Get help with Tax Reporting",
        "Get help with Business Planning"
      ],
      tip: "These services are funded by the state and are free for entrepreneurs."
    },
    {
      id: "women",
      title: "9. Women Entrepreneurship",
      icon: Heart,
      purpose: "Inclusive Growth",
      description: "Specific centers exist to support women founders with training, mentorship, and business evaluation.",
      actions: [
        "Find a Women Entrepreneurship Development Center",
        "Join networking events",
        "Apply for specific mentorship programs"
      ]
    },
    {
      id: "rural",
      title: "10. One Village – One Product",
      icon: MapPin,
      purpose: "Rural Development",
      description: "A program designed to develop rural production and promote local products to wider markets.",
      actions: [
        "Identify unique local raw materials",
        "Apply for branding and marketing support",
        "Look for grants up to 5 million KZT for production"
      ]
    },
    {
      id: "mistakes",
      title: "11. Common Mistakes",
      icon: AlertTriangle,
      purpose: "Risk Avoidance",
      description: "Learn from others' failures to save time and money.",
      actions: [
        "Do NOT mix personal and business money (especially LLP)",
        "Do NOT forget to submit zero-reports if you have no income",
        "Do NOT ignore social payments (Pension/Social insurance)"
      ],
      tip: "Even if you earned 0 KZT, you must report it. Silence leads to blocked accounts."
    }
  ],
  ru: [], // To be populated later
  kz: []  // To be populated later
};

// --------------------
// COMPONENT
// --------------------

export function Handbook() {
  const [activeLang, setActiveLang] = useState<Language>("en");
  const contentData =
    HANDBOOK_DATA[activeLang].length > 0
      ? HANDBOOK_DATA[activeLang]
      : HANDBOOK_DATA.en;

  const [activeChapterId, setActiveChapterId] = useState(
    contentData[0].id
  );

  const activeContent =
    contentData.find((c) => c.id === activeChapterId) ||
    contentData[0];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Book className="h-6 w-6 text-blue-600" />
              Entrepreneur’s Handbook
            </h1>
            <p className="text-sm text-slate-500">
              Step-by-step guidance for Kazakhstan 🇰🇿
            </p>
          </div>

          <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {(["en", "ru", "kz"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeLang === lang
                    ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-72">
          <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 font-semibold border-b border-slate-200 dark:border-slate-800">
              Steps
            </div>

            <ScrollArea className="h-[500px]">
              <div className="p-2 space-y-1">
                {contentData.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      setActiveChapterId(chapter.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl flex gap-3 transition ${
                      activeChapterId === chapter.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <chapter.icon className="h-4 w-4 mt-1 shrink-0" />
                    <span className="text-sm leading-tight">
                      {chapter.title}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 max-w-3xl">
          {/* Title */}
          <div className="mb-10">
            {activeContent.purpose && (
              <Badge className="mb-4 bg-blue-50 text-blue-700 border border-blue-200">
                {activeContent.purpose}
              </Badge>
            )}

            <h2 className="text-4xl font-extrabold mb-6 text-slate-900 dark:text-white leading-tight">
              {activeContent.title}
            </h2>

            <div className="border-l-4 border-blue-600 pl-6 text-lg text-slate-700 dark:text-slate-300">
              {activeContent.description}
            </div>
          </div>

          {/* ACTIONS */}
          <Card className="border-l-4 border-l-teal-500 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-teal-600" />
                What You Need to Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {activeContent.actions.map((action, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold mt-1">
                      {idx + 1}
                    </div>
                    <span className="text-slate-800 dark:text-slate-200">
                      {action}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* DETAILS */}
          {activeContent.details}

          {/* EXAMPLES */}
          {activeContent.examples && (
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Practical Examples
              </h3>
              <div className="space-y-2">
                {activeContent.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-sm"
                  >
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TIP */}
          {activeContent.tip && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6 flex gap-4 mb-8">
              <div className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-full">
                <Heart className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1 text-indigo-900 dark:text-indigo-300">
                  Human Insight
                </h4>
                <p className="text-sm text-indigo-800 dark:text-indigo-200">
                  {activeContent.tip}
                </p>
              </div>
            </div>
          )}

          {/* NEXT BUTTON */}
          <div className="flex justify-end pt-6">
            <Button
              onClick={() => {
                const currentIndex = contentData.findIndex(
                  (c) => c.id === activeChapterId
                );
                if (currentIndex < contentData.length - 1) {
                  setActiveChapterId(contentData[currentIndex + 1].id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              disabled={
                contentData.findIndex(
                  (c) => c.id === activeChapterId
                ) === contentData.length - 1
              }
            >
              Next Step →
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
