'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Phone,
  Send,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SERVICES } from '@/lib/data/servicesData';
import { siteConfig } from '@/config/site';
import InquiryModal from '@/components/inquiry/InquiryModal';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const service = SERVICES.find((s) => s.slug === slug);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!service) {
    notFound();
  }

  const handleOpenModal = (tariffName?: string) => {
    setSelectedTariff(tariffName || '');
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Top Breadcrumb */}
      <div className="border-b border-[#eef2f7] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3 text-sm font-semibold text-[#5d6577]">
          <Link href="/" className="hover:text-[#0b5cff] transition-colors">
            Bosh sahifa
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#0b5cff] transition-colors">
            Xizmatlar
          </Link>
          <span>/</span>
          <span className="text-[#0f1320] font-bold">{service.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-white border-b border-[#eef2f7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#e9f0ff] text-[#0b5cff] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            {service.badge}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0f1320] tracking-tight leading-tight mb-6">
            {service.heroHeadline}
          </h1>

          <p className="text-lg sm:text-xl text-[#5d6577] font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            {service.heroSubtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 bg-[#0b5cff] hover:bg-[#0847c9] text-white font-bold px-7 py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-base"
            >
              Bepul konsultatsiya va hisob-kitob
            </button>
            <a
              href={`${siteConfig.telegramUrl}?start=service_${service.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f3f5f9] hover:bg-[#e9f0ff] text-[#0f1320] font-bold px-7 py-4 rounded-xl transition-all border border-[#e5e8ef] text-base"
            >
              <Send className="w-4 h-4 text-[#0b5cff]" /> Telegram orqali bog‘lanish
            </a>
          </div>
        </div>
      </section>

      {/* 6 Core Capabilities */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1320] tracking-tight mb-3">
              Yechimning asosiy imkoniyatlari
            </h2>
            <p className="text-[#5d6577] font-medium">
              Har bir detal biznesingiz xavfsizligi, tezligi va daromadini oshirishga yo‘naltirilgan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e5e8ef] rounded-2xl p-7 hover:border-[#0b5cff] transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#e9f0ff] text-[#0b5cff] flex items-center justify-center font-bold mb-5">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0f1320] mb-2">{feat.title}</h3>
                <p className="text-sm font-medium text-[#5d6577] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Steps Timeline */}
      <section className="py-20 bg-[#f3f5f9] border-y border-[#e5e8ef]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1320] tracking-tight mb-3">
              Jarayon qanday amalga oshiriladi?
            </h2>
            <p className="text-[#5d6577] font-medium">
              4 bosqichda to‘liq ishga tushirish va xodimlarni o‘rgatish.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.steps.map((st, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-[#e2e8f0] relative">
                <span className="text-3xl font-extrabold text-[#0b5cff] mb-4 block">
                  {st.step}
                </span>
                <h4 className="text-base font-bold text-[#0f1320] mb-2">{st.title}</h4>
                <p className="text-sm text-[#5d6577] font-medium leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1320] tracking-tight mb-3">
              Shaffof narxlar va tariflar
            </h2>
            <p className="text-[#5d6577] font-medium">
              Yashirin to‘lovlarsiz, rasmiy shartnoma va kafolatlangan xizmat ko‘rsatish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {service.packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 border flex flex-col justify-between relative transition-all ${
                  pkg.isPopular
                    ? 'border-[#0b5cff] bg-[#fafbff] shadow-xl ring-2 ring-[#0b5cff]/20'
                    : 'border-[#e5e8ef] bg-white'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0b5cff] text-white text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Tavsiya etiladi
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-[#0f1320] mb-2">{pkg.name}</h3>
                  <p className="text-sm text-[#5d6577] font-medium mb-6">{pkg.desc}</p>
                  <div className="text-3xl font-extrabold text-[#0f1320] mb-8 pb-6 border-b border-[#eef2f7]">
                    {pkg.price}
                  </div>

                  <div className="space-y-3.5 mb-8">
                    {pkg.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-sm font-semibold text-[#334155]">
                        <CheckCircle2 className="w-4 h-4 text-[#16a864] flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenModal(pkg.name)}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all ${
                    pkg.isPopular
                      ? 'bg-[#0b5cff] hover:bg-[#0847c9] text-white shadow-md'
                      : 'bg-[#f3f5f9] hover:bg-[#e9f0ff] text-[#0f1320]'
                  }`}
                >
                  Tarifni tanlash
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-[#fafbfc] border-t border-[#eef2f7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1320] tracking-tight mb-3">
              Ko‘p beriladigan savollar
            </h2>
            <p className="text-[#5d6577] font-medium">Ushbu xizmat bo‘yicha muhim savollarga javoblar</p>
          </div>

          <div className="space-y-4">
            {service.faq.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#e5e8ef] rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 font-bold text-[#0f1320] flex items-center justify-between gap-4 text-base"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#5d6577] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#0b5cff]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-[#5d6577] font-medium leading-relaxed border-t border-[#f8fafc] pt-4">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-[#0f1320] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
            Savollaringiz bormi yoki loyihani boshlaymizmi?
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-8 font-medium">
            Menejerimiz 15 daqiqa ichida siz bilan bog‘lanib, to‘liq texnik tafsilotlarni tushuntiradi.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleOpenModal()}
              className="bg-[#0b5cff] hover:bg-[#0847c9] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-base"
            >
              Menejer so‘rovini qoldirish
            </button>
            <a
              href={siteConfig.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-4 rounded-xl transition-all border border-white/20 text-base"
            >
              <Send className="w-4 h-4 text-[#0b5cff]" /> Telegram bot (@dashboardsalevvbot)
            </a>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultServiceKey={service.slug}
        initialNotes={selectedTariff ? `Tanlangan tarif: ${selectedTariff}` : undefined}
      />
    </div>
  );
}
