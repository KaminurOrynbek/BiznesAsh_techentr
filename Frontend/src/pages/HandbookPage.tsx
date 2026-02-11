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

import { Navbar } from "../components"; 
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";

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

const CHAPTERS: ChapterContent[] = [
  {
    id: "niche",
    title: "1. Define Your Business Niche",
    icon: Target,
    purpose: "Strategic thinking",
    description:
      "Before registering a business, it is essential to understand what you will sell and who your customers are. This decision affects taxation, registration form, and required licenses.",
    actions: [
      "Decide whether you will sell goods or services",
      "Identify your skills, experience, or resources",
      "Analyze demand in your area (competitors, customer needs)",
    ],
    examples: [
      "A teacher can open an educational center",
      "An accountant can provide accounting and audit services",
      "A barista can offer coffee-to-go services",
    ],
    tip: "Many successful small businesses in Kazakhstan start as home-based services to reduce costs in the first year.",
  },
  {
    id: "plan",
    title: "2. Business Plan Draft",
    icon: FileText,
    purpose: "Financial and risk awareness",
    description:
      "You don't need a 100-page document, but you need to know your numbers. Failing to plan is planning to fail.",
    actions: [
      "Calculate startup costs (equipment, rent, licenses)",
      "Identify funding sources (savings, loans, grants)",
      "Draft a development strategy for the first 6-12 months",
      "List potential risks and how to mitigate them",
    ],
    tip: "At early stages, working from home can significantly reduce costs. Don't rent an office unless absolutely necessary.",
  },
  {
    id: "types",
    title: "3. Types of Entrepreneurship",
    icon: Briefcase,
    purpose: "Legal structure",
    description:
      "Choosing the right legal form is crucial. In Kazakhstan, the two most common forms are Individual Entrepreneur (IE/IP) and Limited Liability Partnership (LLP/TOO).",
    actions: [
      "Review eligibility for IE (Citizens, Kandas, EAEU residents)",
      "Determine if you need partners (Requires LLP)",
      "Check liability differences (IE = Personal liability, LLP = Limited to capital)",
    ],
    details: (
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-blue-900">
              Individual Entrepreneur (IE)
            </CardTitle>
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
            <CardTitle className="text-base text-slate-900">
              LLP (Partnership)
            </CardTitle>
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
    ),
  },
  {
    id: "tax",
    title: "4. Taxation Regimes",
    icon: DollarSign,
    purpose: "Financial Efficiency",
    description:
      "Choosing the right tax regime can save you millions. Most small businesses choose a Special Tax Regime (STR) over the General Regime.",
    actions: [
      "Estimate your annual turnover",
      "Count expected employees",
      "Select a regime: Patent, Simplified Declaration, or Retail Tax",
    ],
    details: (
      <div className="space-y-3 mt-4">
        <div className="p-3 border rounded-lg bg-white">
          <div className="font-semibold">Simplified Declaration</div>
          <div className="text-sm text-slate-600">
            3% tax on turnover. Limit: ~24,038 MCI income. Up to 30 employees.
          </div>
        </div>
        <div className="p-3 border rounded-lg bg-white">
          <div className="font-semibold">Patent</div>
          <div className="text-sm text-slate-600">
            1% tax paid in advance. No employees allowed. Good for solo artisans.
          </div>
        </div>
        <div className="p-3 border rounded-lg bg-white">
          <div className="font-semibold">Retail Tax</div>
          <div className="text-sm text-slate-600">
            4% (individuals) / 8% (companies). Higher turnover limits. Specific
            sectors only.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "kkm",
    title: "5. Cash Registers (KKM)",
    icon: CreditCard,
    purpose: "Compliance",
    description:
      "If you accept cash or bank cards, you MUST have a Cash Register (KKM). It transmits data to tax authorities.",
    actions: [
      "Register a KKM before accepting first payment",
      "Choose between physical device or mobile app (Webkassa, Rekassa, etc.)",
      "Ensure it supports QR payments if needed",
    ],
    tip: "KKM must be registered before you start working with clients to avoid fines.",
  },
  {
    id: "automation",
    title: "6. Outsourcing & Automation",
    icon: Cpu,
    purpose: "Efficiency & Scalability",
    description:
      "You don't need to hire full-time staff for everything. Use modern tools and outsourcing to keep costs low.",
    actions: [
      "Outsource Accounting, Marketing, and IT",
      "Use bots (Telegram/WhatsApp) for customer FAQs",
      "Implement a CRM system early",
    ],
    tip: "Pay for results, not just for employees sitting in an office.",
  },
  {
    id: "grants",
    title: "7. Grants & State Support",
    icon: GraduationCap,
    purpose: "Funding & Education",
    description:
      "The government offers training and non-repayable grants to support new businesses.",
    actions: [
      "Check 'Bastau Business' on skills.enbek.kz (Free training)",
      "Apply for grants up to 400 MCI (for specific social groups)",
      "Prepare documents for grant usage (Equipment, Rent, etc.)",
    ],
  },
  {
    id: "support",
    title: "8. Non-Financial Support",
    icon: Users,
    purpose: "Consulting",
    description:
      "Atameken and Entrepreneur Service Centers (ЦОП) provide free consulting for businesses.",
    actions: [
      "Visit a local CSC (ЦОП) office",
      "Get help with Tax Reporting",
      "Get help with Business Planning",
    ],
    tip: "These services are funded by the state and are free for entrepreneurs.",
  },
  {
    id: "women",
    title: "9. Women Entrepreneurship",
    icon: Heart,
    purpose: "Inclusive Growth",
    description:
      "Specific centers exist to support women founders with training, mentorship, and business evaluation.",
    actions: [
      "Find a Women Entrepreneurship Development Center",
      "Join networking events",
      "Apply for specific mentorship programs",
    ],
  },
  {
    id: "rural",
    title: "10. One Village – One Product",
    icon: MapPin,
    purpose: "Rural Development",
    description:
      "A program designed to develop rural production and promote local products to wider markets.",
    actions: [
      "Identify unique local raw materials",
      "Apply for branding and marketing support",
      "Look for grants up to 5 million KZT for production",
    ],
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
      "Do NOT ignore social payments (Pension/Social insurance)",
    ],
    tip: "Even if you earned 0 KZT, you must report it. Silence leads to blocked accounts.",
  },
];

export function Handbook() {
  const [activeChapterId, setActiveChapterId] = useState(CHAPTERS[0].id);
  const activeContent =
    CHAPTERS.find((c) => c.id === activeChapterId) || CHAPTERS[0];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* ✅ YOUR SITE NAVBAR BACK */}
      <Navbar />

      {/* Handbook Header under Navbar */}
      <div className="border-b border-slate-200 bg-white sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Book className="h-6 w-6 text-blue-600" />
            Entrepreneur’s Handbook
          </h1>
          <p className="text-sm text-slate-500">
            Step-by-step guidance for Kazakhstan 🇰🇿
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT NAVIGATION PANEL */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-32 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 font-semibold text-slate-900 bg-slate-100/50">
                Steps
              </div>

              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="p-2 space-y-1">
                  {CHAPTERS.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        setActiveChapterId(chapter.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-full text-left px-3 py-3 text-sm rounded-lg transition-colors flex items-start gap-3 group ${
                        activeChapterId === chapter.id
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                      }`}
                      type="button"
                    >
                      <chapter.icon
                        className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          activeChapterId === chapter.id
                            ? "text-blue-200"
                            : "text-slate-400 group-hover:text-blue-500"
                        }`}
                      />
                      <span className="line-clamp-2 leading-tight">
                        {chapter.title}
                      </span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 w-full min-w-0">
            <div className="max-w-3xl">
              {/* Step Title & Purpose */}
              <div className="mb-8">
                {activeContent.purpose && (
                  <Badge
                    variant="outline"
                    className="mb-4 border-blue-200 bg-blue-50 text-blue-700"
                  >
                    {activeContent.purpose}
                  </Badge>
                )}

                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                  {activeContent.title}
                </h2>

                <div className="text-lg text-slate-700 leading-relaxed border-l-4 border-blue-600 pl-6 py-1">
                  {activeContent.description}
                </div>
              </div>

              <div className="space-y-8">
                {/* Action Items */}
                <Card className="border-l-4 border-l-teal-500 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <CheckSquare className="h-5 w-5 text-teal-600" />
                      What You Need to Do
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {activeContent.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <span className="text-slate-800">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Dynamic Details */}
                {activeContent.details}

                {/* Examples */}
                {activeContent.examples && (
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Practical Examples
                    </h3>

                    <div className="grid gap-3">
                      {activeContent.examples.map((ex, i) => (
                        <div
                          key={i}
                          className="bg-white p-3 rounded-lg border border-slate-100 text-slate-700 text-sm shadow-sm"
                        >
                          {ex}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pro Tip */}
                {activeContent.tip && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex gap-4 items-start">
                    <div className="bg-indigo-100 p-2 rounded-full shrink-0">
                      <Heart className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-indigo-900 mb-1">
                        Human Insight
                      </h4>
                      <p className="text-indigo-800 text-sm leading-relaxed">
                        {activeContent.tip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Next Step Navigation */}
                <div className="pt-8 flex justify-end">
                  <Button
                    onClick={() => {
                      const currentIndex = CHAPTERS.findIndex(
                        (c) => c.id === activeChapterId
                      );
                      if (currentIndex < CHAPTERS.length - 1) {
                        setActiveChapterId(CHAPTERS[currentIndex + 1].id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    disabled={
                      CHAPTERS.findIndex((c) => c.id === activeChapterId) ===
                      CHAPTERS.length - 1
                    }
                    className="bg-slate-900 hover:bg-slate-800"
                  >
                    Next Step →
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
