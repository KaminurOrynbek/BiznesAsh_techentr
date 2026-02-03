import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";


import {
  Book,
  FileText,
  Globe,
  DollarSign,
  HelpCircle,
  ChevronRight,
  Download,
  ChevronDown,
} from "lucide-react";
import { Navbar, Card, Button } from "../components";

/**
 * Small helper styles that match your existing "rounded-xl2" feel.
 * No shadcn required.
 */

type ChapterId = "registration" | "documents" | "platforms" | "taxes" | "faq";

type Chapter = {
  id: ChapterId;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  render: () => React.ReactNode;
};

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-semibold">
    {children}
  </span>
);

const DocRow = ({ name, desc }: { name: string; desc: string }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
        <FileText className="h-4 w-4 text-slate-400" />
      </div>
      <div>
        <div className="font-semibold text-slate-900 text-sm">{name}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
    </div>

    <button
      type="button"
      className="h-9 w-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition"
      aria-label="Download"
      title="Download (placeholder)"
    >
      <Download className="h-4 w-4 text-slate-400" />
    </button>
  </div>
);

const AccordionItem = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition"
      >
        <span className="font-semibold text-slate-900">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="px-4 pb-4 text-sm text-slate-700">{children}</div>}
    </div>
  );
};

export const HandbookPage = () => {
  const chapters: Chapter[] = useMemo(
    () => [
      {
        id: "registration",
        title: "Registration Steps",
        icon: Book,
        render: () => (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
                Step 1: Choose Your Legal Entity
              </h2>
              <p className="text-slate-700 mb-4">
                Before registering, decide between Individual Entrepreneur (IE/IP) and
                Limited Liability Partnership (LLP/TOO).
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-0">
                  <div className="p-5">
                    <div className="font-bold text-slate-900 mb-2">
                      Individual Entrepreneur (IE)
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                      <li>Simpler registration (online)</li>
                      <li>Lower fines</li>
                      <li>Personal liability for debts</li>
                      <li>Good for solo founders</li>
                    </ul>
                  </div>
                </Card>

                <Card className="p-0">
                  <div className="p-5">
                    <div className="font-bold text-slate-900 mb-2">
                      Limited Liability Partnership (LLP)
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                      <li>Separate legal entity</li>
                      <li>Liability limited to capital</li>
                      <li>More reporting requirements</li>
                      <li>Good for partners/scaling</li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
                Step 2: Register Online
              </h2>
              <p className="text-slate-700 mb-4">
                You can register online via eGov.kz or banking apps (Kaspi, Halyk).
              </p>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="font-bold text-blue-900 mb-2">Required for eGov:</div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800">
                  <li>Valid EDS (Digital Signature) keys</li>
                  <li>Registered phone number in Mobile Citizens Database</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "documents",
        title: "Required Documents",
        icon: FileText,
        render: () => (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Document Checklist</h2>
            <p className="text-slate-700">
              Depending on business type, prepare specific documents.
            </p>

            <div className="space-y-3">
              <DocRow name="Identity Card (UDL)" desc="Scan of your national ID" />
              <DocRow
                name="Proof of Address"
                desc="Address certificate (can be pulled from eGov)"
              />
              <DocRow name="Charter (for LLP)" desc="Founding document describing rules" />
              <DocRow name="Founder's Decision" desc="Written decision to start the company" />
            </div>

            <div className="pt-2 flex gap-2 flex-wrap">
              <Pill>Tip: keep scans in one folder</Pill>
              <Pill>Tip: name files clearly</Pill>
            </div>
          </div>
        ),
      },
      {
        id: "platforms",
        title: "Gov Platforms",
        icon: Globe,
        render: () => (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Digital Ecosystem</h2>

            <div className="grid gap-3">
              {[
                { name: "eGov.kz", desc: "Main portal for government services." },
                { name: "cabinet.salyk.kz", desc: "Taxpayer cabinet for reporting & notices." },
                { name: "enbek.kz", desc: "Employment contracts and labor exchange." },
                { name: "Open Data", desc: "Statistics and public registries." },
              ].map((site) => (
                <a
                  key={site.name}
                  href="#"
                  className="block group rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {site.name}
                      </div>
                      <div className="text-sm text-slate-500">{site.desc}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "taxes",
        title: "Tax Regimes",
        icon: DollarSign,
        render: () => (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Understanding Taxes</h2>
            <p className="text-slate-700">
              Choosing the right regime saves money. Many small businesses start with
              Simplified Declaration.
            </p>

            <div className="space-y-3">
              <AccordionItem title="Simplified Declaration (3%)" defaultOpen>
                Most popular: pay 3% of turnover semi-annually. Has limits by turnover and
                employees.
              </AccordionItem>

              <AccordionItem title="Retail Tax (4% / 8%)">
                For certain sectors (often restaurants): different rates for sales to
                individuals vs companies.
              </AccordionItem>

              <AccordionItem title="General Regime (10% / 20%)">
                Paid on net profit (Revenue − Expenses). Useful if you have high confirmed
                expenses.
              </AccordionItem>
            </div>
          </div>
        ),
      },
      {
        id: "faq",
        title: "Common Mistakes",
        icon: HelpCircle,
        render: () => (
          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold text-slate-900">Avoid These Mistakes</h2>

            {[
              {
                q: "Forgetting to submit zero-reports",
                a: "Even with no income, you must submit reports with zeros, otherwise accounts can be blocked.",
              },
              {
                q: "Mixing personal and business money",
                a: "Especially for LLPs. Treat business money as separate from your personal wallet.",
              },
              {
                q: "Ignoring social payments",
                a: "You must pay pension/social insurance for yourself and employees monthly (depending on your status).",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5"
              >
                <div className="font-bold text-orange-900 mb-2">{item.q}</div>
                <div className="text-sm text-slate-700">{item.a}</div>
              </div>
            ))}
          </div>
        ),
      },
    ],
    []
  );

  const [activeChapter, setActiveChapter] = useState<ChapterId>(chapters[0].id);
  const active = chapters.find((c) => c.id === activeChapter);

  return (
    <>
      <Navbar />

      <div className="bg-white min-h-[calc(100vh-64px)]">
        {/* Top banner */}
        <div className="border-b border-slate-200 bg-slate-50 py-10">
          <div className="container-page">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
              Entrepreneur’s Handbook
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              A structured guide to starting and running a business in Kazakhstan.
            </p>
          </div>
        </div>

        <div className="container-page py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-72 flex-shrink-0">
              <div className="md:sticky md:top-24 space-y-2">
                {chapters.map((c) => {
                  const ActiveIcon = c.icon;
                  const isActive = c.id === activeChapter;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveChapter(c.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                      }`}
                      type="button"
                    >
                      <ActiveIcon
                        className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400"}`}
                      />
                      {c.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-[520px]">
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="p-6 md:p-8">{active?.render()}</div>

                {/* Bottom CTA row */}
                <div className="border-t border-slate-100 p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-slate-50/40">
                  <div className="text-sm text-slate-600">
                    Next: keep going chapter by chapter and ask questions in Community.
                  </div>
                  <Link to="/feed">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2">
                      Open Community
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
