import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


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
  <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 text-xs font-semibold border border-transparent dark:border-slate-700">
    {children}
  </span>
);

const DocRow = ({ name, desc }: { name: string; desc: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center">
          <FileText className="h-4 w-4 text-slate-400" />
        </div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{desc}</div>
        </div>
      </div>

      <button
        type="button"
        className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition"
        aria-label={t('download', { defaultValue: 'Download' })}
        title={t('downloadPlaceholder', { defaultValue: 'Download (placeholder)' })}
      >
        <Download className="h-4 w-4 text-slate-400" />
      </button>
    </div>
  );
};

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
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
      >
        <span className="font-semibold text-slate-900 dark:text-slate-100">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="px-4 pb-4 text-sm text-slate-700 dark:text-slate-300">{children}</div>}
    </div>
  );
};

export const HandbookPage = () => {
  const { t } = useTranslation();
  const chapters: Chapter[] = useMemo(
    () => [
      {
        id: "registration",
        title: t('registrationSteps'),
        icon: Book,
        render: () => (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 transition-colors">
                {t('step1Legal')}
              </h2>
              <p className="text-slate-700 dark:text-slate-400 mb-4 transition-colors">
                {t('decideLegal')}
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-0 overflow-hidden">
                  <div className="p-5">
                    <div className="font-bold text-slate-900 dark:text-white mb-2 transition-colors">
                      {t('ieTitle')}
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li>{t('ieSimpler')}</li>
                      <li>{t('ieLowerFines')}</li>
                      <li>{t('ieLiability')}</li>
                      <li>{t('ieSolo')}</li>
                    </ul>
                  </div>
                </Card>

                <Card className="p-0 overflow-hidden">
                  <div className="p-5">
                    <div className="font-bold text-slate-900 dark:text-white mb-2 transition-colors">
                      {t('llpTitle')}
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li>{t('llpSeparate')}</li>
                      <li>{t('llpLimited')}</li>
                      <li>{t('llpReporting')}</li>
                      <li>{t('llpScaling')}</li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 transition-colors">
                {t('step2Register')}
              </h2>
              <p className="text-slate-700 dark:text-slate-400 mb-4 transition-colors">
                {t('egovNotice')}
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 transition-colors">
                <div className="font-bold text-blue-900 dark:text-blue-300 mb-2">{t('requiredEgov')}</div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800 dark:text-blue-400/90">
                  <li>{t('validEds')}</li>
                  <li>{t('registeredPhone')}</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "documents",
        title: t('requiredDocuments'),
        icon: FileText,
        render: () => (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white transition-colors">{t('docChecklist')}</h2>
            <p className="text-slate-700 dark:text-slate-400 transition-colors">
              {t('prepareDocs')}
            </p>

            <div className="space-y-3">
              <DocRow name={t('idCard')} desc={t('idCardDesc')} />
              <DocRow
                name={t('proofAddress')}
                desc={t('proofAddressDesc')}
              />
              <DocRow name={t('charter')} desc={t('charterDesc')} />
              <DocRow name={t('founderDecision')} desc={t('founderDecisionDesc')} />
            </div>

            <div className="pt-2 flex gap-2 flex-wrap">
              <Pill>{t('folderTip')}</Pill>
              <Pill>{t('fileNameTip')}</Pill>
            </div>
          </div>
        ),
      },
      {
        id: "platforms",
        title: t('govPlatforms'),
        icon: Globe,
        render: () => (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white transition-colors">{t('digitalEcosystem')}</h2>

            <div className="grid gap-3">
              {[
                { name: "eGov.kz", desc: t('egovDesc') },
                { name: "cabinet.salyk.kz", desc: t('salykDesc') },
                { name: "enbek.kz", desc: t('enbekDesc') },
                { name: "Open Data", desc: t('openDataDesc') },
              ].map((site) => (
                <a
                  key={site.name}
                  href="#"
                  className="block group rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {site.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{site.desc}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "taxes",
        title: t('taxRegimes'),
        icon: DollarSign,
        render: () => (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white transition-colors">{t('understandingTaxes')}</h2>
            <p className="text-slate-700 dark:text-slate-400 transition-colors">
              {t('taxRegimeText')}
            </p>

            <div className="space-y-3">
              <AccordionItem title={t('simplifiedTitle')} defaultOpen>
                {t('simplifiedDesc')}
              </AccordionItem>

              <AccordionItem title={t('retailTaxTitle')}>
                {t('retailTaxDesc')}
              </AccordionItem>

              <AccordionItem title={t('generalRegimeTitle')}>
                {t('generalRegimeDesc')}
              </AccordionItem>
            </div>
          </div>
        ),
      },
      {
        id: "faq",
        title: t('commonMistakes'),
        icon: HelpCircle,
        render: () => (
          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white transition-colors">{t('avoidMistakes')}</h2>

            {[
              {
                q: t('mistake1Q'),
                a: t('mistake1A'),
              },
              {
                q: t('mistake2Q'),
                a: t('mistake2A'),
              },
              {
                q: t('mistake3Q'),
                a: t('mistake3A'),
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-orange-100 dark:border-orange-900/20 bg-orange-50/50 dark:bg-orange-900/10 p-5 transition-colors"
              >
                <div className="font-bold text-orange-900 dark:text-orange-300 mb-2 transition-colors">{item.q}</div>
                <div className="text-sm text-slate-700 dark:text-slate-400 transition-colors">{item.a}</div>
              </div>
            ))}
          </div>
        ),
      },
    ],
    [t]
  );

  const [activeChapter, setActiveChapter] = useState<ChapterId>(chapters[0].id);
  const active = chapters.find((c) => c.id === activeChapter);

  return (
    <>
      <Navbar />

      <div className="bg-white dark:bg-slate-950 min-h-[calc(100vh-64px)] transition-colors">
        {/* Top banner */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-10">
          <div className="container-page">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
              {t('handbookTitle')}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              {t('handbookSubtitle')}
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
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition ${isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent"
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
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors">
                <div className="p-6 md:p-8">{active?.render()}</div>

                {/* Bottom CTA row */}
                <div className="border-t border-slate-100 dark:border-slate-800 p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-slate-50/40 dark:bg-slate-800/50 transition-colors">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {t('nextHandbook')}
                  </div>
                  <Link to="/feed">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2">
                      {t('openCommunity')}
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
