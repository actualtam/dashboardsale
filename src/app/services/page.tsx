'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, Bot, UserCheck, Camera, Monitor, CheckCircle2, Phone, Send } from 'lucide-react';
import { SERVICES } from '@/lib/data/servicesData';
import { siteConfig } from '@/config/site';

const ICON_MAP: Record<string, React.ReactNode> = {
  cart: <ShoppingCart className="w-6 h-6 text-[#0b5cff]" />,
  bot: <Bot className="w-6 h-6 text-[#0b5cff]" />,
  face: <UserCheck className="w-6 h-6 text-[#0b5cff]" />,
  camera: <Camera className="w-6 h-6 text-[#0b5cff]" />,
  monitor: <Monitor className="w-6 h-6 text-[#0b5cff]" />,
};

export default function ServicesIndexPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-white border-b border-[#eef2f7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#e9f0ff] text-[#0b5cff] mb-4">
            Barcha xizmatlar va yechimlar
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0f1320] tracking-tight max-w-3xl mx-auto leading-tight">
            Biznesni to‘liq avtomatlashtirish xizmatlari
          </h1>
          <p className="mt-4 text-lg text-[#5d6577] max-w-2xl mx-auto font-medium">
            Savdo, moliya, davomat va xavfsizlik — har bir soha bo‘yicha alohida professional yechimlar va kafolatli texnik ko‘mak.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((s, idx) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group block bg-white border border-[#e5e8ef] hover:border-[#0b5cff] rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#f3f5f9] group-hover:bg-[#e9f0ff] flex items-center justify-center transition-colors">
                    {ICON_MAP[s.icon] || <Bot className="w-6 h-6 text-[#0b5cff]" />}
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#0b5cff] bg-[#e9f0ff] px-3 py-1 rounded-full">
                    {s.badge}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-[#0f1320] group-hover:text-[#0b5cff] transition-colors mb-3">
                  {s.title}
                </h2>
                <p className="text-[#5d6577] font-medium leading-relaxed mb-6">
                  {s.heroSubtitle}
                </p>

                <div className="space-y-2 mb-8">
                  {s.features.slice(0, 3).map((f, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-sm font-semibold text-[#334155]">
                      <CheckCircle2 className="w-4 h-4 text-[#16a864] flex-shrink-0" />
                      <span className="truncate">{f.title}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-[#f1f5f9]">
                  <span className="text-sm font-bold text-[#0b5cff] flex items-center gap-2 group-hover:gap-3 transition-all">
                    Batafsil ma’lumot va narxlar <ArrowRight className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-semibold text-[#94a3b8]">
                    Boshlanishi: {s.packages[0]?.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Consultation CTA */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-[#0b5cff] text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
              Qaysi yechim biznesingizga to‘g‘ri kelishini bilmayapsizmi?
            </h2>
            <p className="text-white/85 text-base sm:text-lg max-w-xl mx-auto mb-8 font-medium">
              Mutaxassisimiz savdo nuqtangiz yoki korxonangizga mos texnik yechim va byudjetni bepul hisoblab beradi.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={siteConfig.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#0b5cff] font-bold px-6 py-3.5 rounded-xl hover:bg-slate-50 transition-all shadow-md"
              >
                <Send className="w-4 h-4" /> Telegram orqali maslahat olish
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/[\s-]/g, '')}`}
                className="inline-flex items-center gap-2 bg-[#0847c9] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#063ba8] transition-all"
              >
                <Phone className="w-4 h-4" /> {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
