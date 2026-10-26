import React from 'react';
import { Send, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface EmptyCatalogueProps {
  selectedCategory?: string;
  searchQuery?: string;
}

export default function EmptyCatalogue({ selectedCategory, searchQuery }: EmptyCatalogueProps) {
  const isFiltered = (selectedCategory && selectedCategory !== 'all') || Boolean(searchQuery);

  const categories = [
    { code: '01', name: 'Monobloklar va POS terminallar' },
    { code: '02', name: 'Chek printerlar (58mm / 80mm)' },
    { code: '03', name: 'Shtrix-kod skanerlar (1D / 2D)' },
    { code: '04', name: 'Avtomatik kassa qutilari' },
    { code: '05', name: 'Face ID va biometrik terminallar' },
    { code: '06', name: 'NFC kartalar va o‘quvchilar' },
  ];

  return (
    <div className="bg-[#1D2023] border border-[#353A40] p-8 sm:p-12 my-8 max-w-4xl mx-auto rounded-[8px]">
      <div className="flex items-center justify-between pb-6 border-b border-[#353A40] mb-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#858C93]">
          OMBOR HOLATI // RO‘YXAT
        </span>
        <span className="font-mono text-[11px] text-[#4B91D9] uppercase tracking-wider">
          TOSHKENT OMBORI
        </span>
      </div>

      <div className="max-w-2xl">
        <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#F4F4F1] tracking-tight mb-3">
          {isFiltered
            ? 'Ushbu parametrlar bo‘yicha uskunalar topilmadi'
            : 'Uskunalar katalogi yangilanmoqda'}
        </h3>

        <p className="text-[15px] text-[#B0B5BA] leading-[1.65] mb-8">
          {isFiltered
            ? 'Tanlangan toifa yoki qidiruv so‘rovi bo‘yicha ayni paytda saytda faol mahsulot mavjud emas. Toshkent omborimizdagi barcha joriy uskunalar qoldig‘i va narxlarini Telegram orqali olishingiz mumkin.'
            : 'Biznesingiz uchun monobloklar, chek printerlar, skanerlar va biometrik qurilmalarning to‘liq assortimenti tez kunda saytda e’lon qilinadi. Hozirgi mavjud uskunalar ro‘yxati va narxlarini Telegram orqali olishingiz mumkin.'}
        </p>
      </div>

      {/* Category Matrix */}
      <div className="mb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#858C93] mb-3">
          Mavjud toifalar:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {categories.map((c) => (
            <div
              key={c.code}
              className="p-3 bg-[#151719] border border-[#353A40] rounded-[6px] flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] text-[#858C93]">{c.code}</span>
                <span className="text-[13px] font-medium text-[#F4F4F1]">{c.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="pt-6 border-t border-[#353A40] flex flex-col sm:flex-row items-center gap-3">
        <a
          href={siteConfig.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bz-btn-primary w-full sm:w-auto text-[14px] py-3 px-6 font-semibold"
        >
          <Send size={14} />
          <span>Telegram orqali narxlar roʻyxatini olish</span>
        </a>

        <a
          href="/contact"
          className="bz-btn-outline w-full sm:w-auto text-[14px] py-3 px-6"
        >
          <span>Menejerga so‘rov qoldirish</span>
          <ArrowUpRight size={14} className="text-[#858C93]" />
        </a>
      </div>
    </div>
  );
}
