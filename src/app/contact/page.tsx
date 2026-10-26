'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Phone,
  Send,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

function ContactFormContent() {
  const searchParams = useSearchParams();
  const defaultService = searchParams.get('service') || 'online_store';

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [serviceKey, setServiceKey] = useState(defaultService);
  const [businessName, setBusinessName] = useState('');
  const [message, setMessage] = useState('');
  const [preferredContact, setPreferredContact] = useState<'TELEGRAM' | 'PHONE'>('TELEGRAM');

  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{ number: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          serviceKey,
          businessName,
          message,
          preferredContact,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'So‘rov yuborishda xatolik yuz berdi');
      }

      setSuccessResult({
        number: data.inquiryNumber,
        message: data.message,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Xatolik yuz berdi. Iltimos qaytadan urinib ko‘ring.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#151719] text-[#F4F4F1] min-h-screen">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-14 sm:py-24">
        {/* Header */}
        <div className="pb-8 border-b border-[#353A40] mb-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#858C93]">
            ALOQA VA KONSULTATSIYA
          </div>
          <h1 className="font-heading font-bold text-[34px] sm:text-[46px] text-[#F4F4F1] tracking-tight mt-1">
            Biz bilan bog‘laning
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#B0B5BA] max-w-xl mt-2 leading-relaxed">
            Savdo tizimlari, hisobot botlari, biometrik davomat va kassa uskunalari bo‘yicha
            bepul professional smeta va maslahat olish uchun so‘rov qoldiring.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Coordinates (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1D2023] border border-[#353A40] rounded-[8px] p-6 sm:p-7 space-y-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#858C93]">
                ALOQA KANALLARI
              </div>

              <div className="space-y-4 text-[14px]">
                <a
                  href={`tel:${siteConfig.phoneClean}`}
                  className="flex items-center justify-between p-3.5 bg-[#151719] border border-[#353A40] rounded-[6px] hover:border-[#4B91D9] transition-colors group"
                >
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[#858C93]">
                      QO‘NG‘IROQ
                    </div>
                    <div className="font-mono font-bold text-[#F4F4F1] mt-0.5">
                      {siteConfig.phone}
                    </div>
                  </div>
                  <ArrowUpRight size={15} className="text-[#858C93] group-hover:text-[#4B91D9] transition-colors" />
                </a>

                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-[#151719] border border-[#353A40] rounded-[6px] hover:border-[#4B91D9] transition-colors group"
                >
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[#858C93]">
                      TELEGRAM BOT
                    </div>
                    <div className="font-bold text-[#4B91D9] mt-0.5">
                      {siteConfig.telegramBotUser}
                    </div>
                  </div>
                  <Send size={15} className="text-[#4B91D9]" />
                </a>

                <div className="p-3.5 bg-[#151719] border border-[#353A40] rounded-[6px] space-y-0.5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#858C93]">
                    MANZIL
                  </div>
                  <div className="text-[#F4F4F1]">{siteConfig.address}</div>
                </div>

                <div className="p-3.5 bg-[#151719] border border-[#353A40] rounded-[6px] space-y-0.5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#858C93]">
                    ISH VAQTI
                  </div>
                  <div className="font-mono text-[13px] text-[#F4F4F1]">{siteConfig.workingHours}</div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#1D2023] border border-[#353A40] rounded-[8px] space-y-2">
              <span className="font-mono text-[11px] text-[#4B91D9] uppercase tracking-wider">
                TEZ VA SHAFFOF
              </span>
              <p className="text-[13px] text-[#B0B5BA] leading-relaxed">
                Yuborilgan har bir so‘rov avtomatik ravishda qayd etiladi va Telegram orqali
                mas’ul texnik muhandisimizga 15 daqiqa ichida yetkaziladi.
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#1D2023] border border-[#353A40] rounded-[8px] p-6 sm:p-8">
              {successResult ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 rounded-[6px] bg-[#151719] border border-[#353A40] text-[#4B91D9] mx-auto flex items-center justify-center">
                    <CheckCircle2 size={28} />
                  </div>

                  <h3 className="font-heading font-bold text-[20px] text-[#F4F4F1]">
                    So‘rovingiz muvaffaqiyatli qabul qilindi!
                  </h3>
                  <div className="font-mono text-[13px] text-[#4B91D9]">
                    ARIZA RAQAMI: {successResult.number}
                  </div>
                  <p className="text-[14px] text-[#B0B5BA] max-w-md mx-auto leading-relaxed">
                    {successResult.message}
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={siteConfig.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bz-btn-primary w-full sm:w-auto text-[14px] py-2.5 px-6"
                    >
                      <Send size={14} />
                      <span>Telegram orqali yozish</span>
                    </a>
                    <button
                      onClick={() => {
                        setSuccessResult(null);
                        setCustomerName('');
                        setMessage('');
                      }}
                      className="bz-btn-outline w-full sm:w-auto text-[14px] py-2.5 px-6"
                    >
                      Yangi so‘rov yuborish
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="pb-3 border-b border-[#353A40]">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-[#858C93]">
                      KONSULTATSIYA FORMASI
                    </div>
                    <div className="font-heading font-semibold text-[16px] text-[#F4F4F1] mt-0.5">
                      Talablaringizni yozib qoldiring
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-[6px] bg-red-950/40 border border-red-800 text-red-300 text-[13px] flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Service Select */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#858C93] mb-1">
                      Xizmat yo‘nalishi: *
                    </label>
                    <select
                      value={serviceKey}
                      onChange={(e) => setServiceKey(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#151719] border border-[#353A40] text-[14px] text-[#F4F4F1] focus:border-[#4B91D9] focus:outline-none"
                    >
                      {siteConfig.services.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.title}
                        </option>
                      ))}
                      <option value="general">Umumiy konsultatsiya / Boshqa</option>
                    </select>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-[#858C93] mb-1">
                        Ismingiz: *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Sardor Aliyev"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#151719] border border-[#353A40] text-[14px] text-[#F4F4F1] placeholder-[#858C93] focus:border-[#4B91D9] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-[#858C93] mb-1">
                        Telefon raqamingiz: *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+998 90 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#151719] border border-[#353A40] text-[14px] font-mono text-[#F4F4F1] placeholder-[#858C93] focus:border-[#4B91D9] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Business Name */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#858C93] mb-1">
                      Do‘kon yoki korxona nomi (ixtiyoriy):
                    </label>
                    <input
                      type="text"
                      placeholder="Masalan: Safia Resto yoki Minimarket"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#151719] border border-[#353A40] text-[14px] text-[#F4F4F1] placeholder-[#858C93] focus:border-[#4B91D9] focus:outline-none"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#858C93] mb-1">
                      Savol yoki talablaringiz:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Qanday muammoni hal qilmoqchisiz, nechta filialingiz bor..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#151719] border border-[#353A40] text-[14px] text-[#F4F4F1] placeholder-[#858C93] focus:border-[#4B91D9] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Preferred Contact */}
                  <div className="flex items-center justify-between pt-1 text-[13px]">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#858C93]">
                      Aloqa kanali:
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-1.5 text-[#B0B5BA] cursor-pointer">
                        <input
                          type="radio"
                          name="contactChannel"
                          value="TELEGRAM"
                          checked={preferredContact === 'TELEGRAM'}
                          onChange={() => setPreferredContact('TELEGRAM')}
                          className="accent-[#4B91D9]"
                        />
                        <span>Telegram orqali</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 text-[#B0B5BA] cursor-pointer">
                        <input
                          type="radio"
                          name="contactChannel"
                          value="PHONE"
                          checked={preferredContact === 'PHONE'}
                          onChange={() => setPreferredContact('PHONE')}
                          className="accent-[#4B91D9]"
                        />
                        <span>Qo‘ng‘iroq</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bz-btn-primary w-full py-3 text-[14px] font-bold justify-center disabled:opacity-50"
                    >
                      {submitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={14} />
                          <span>So‘rovni yuborish</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[500px] bg-[#151719]">
          <span className="font-mono text-[12px] text-[#858C93]">YUKLANMOQDA...</span>
        </div>
      }
    >
      <ContactFormContent />
    </Suspense>
  );
}
