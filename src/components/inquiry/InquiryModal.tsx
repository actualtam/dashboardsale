'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { formatCurrency } from '@/lib/formatters';

export interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultServiceKey?: string;
  product?: {
    id: string;
    nameUz: string;
    sku: string;
    price: number | null;
  } | null;
}

export default function InquiryModal({
  isOpen,
  onClose,
  defaultServiceKey,
  product,
}: InquiryModalProps) {
  const isEquipmentOrder = Boolean(product);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [serviceKey, setServiceKey] = useState(defaultServiceKey || 'online_store');
  const [businessName, setBusinessName] = useState('');
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'COURIER' | 'PICKUP'>('COURIER');
  const [address, setAddress] = useState('');
  const [preferredContact, setPreferredContact] = useState<'TELEGRAM' | 'PHONE'>('TELEGRAM');

  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{ number: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      if (isEquipmentOrder && product) {
        const res = await fetch('/api/public/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName,
            phone,
            deliveryMethod,
            address: deliveryMethod === 'COURIER' ? address : null,
            notes: message,
            items: [
              {
                productId: product.id,
                name: product.nameUz,
                sku: product.sku,
                price: product.price || 0,
                quantity,
              },
            ],
            totalAmount: (product.price || 0) * quantity,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Buyurtma yuborishda xatolik yuz berdi');
        }

        setSuccessResult({
          number: data.orderNumber,
          message: data.message,
        });
      } else {
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
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Tarmoq xatosi. Iltimos qaytadan urinib ko‘ring.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessResult(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-[2px]">
      <div className="bg-[#202327] border border-[#383D44] rounded-[6px] w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#383D44] flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7E8791]">
              {isEquipmentOrder ? 'USKUNA BUYURTMASI' : 'XIZMAT BO‘YICHA MUROJAAT'}
            </div>
            <h3 className="font-heading font-bold text-[16px] sm:text-[17px] text-[#F3F3F0] mt-0.5">
              {isEquipmentOrder ? product?.nameUz : 'Texnik konsultatsiya so‘rovi'}
            </h3>
          </div>

          <button
            onClick={handleReset}
            className="p-1 rounded text-[#7E8791] hover:text-[#F3F3F0] hover:bg-[#17191B] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          {successResult ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-[4px] bg-[#17191B] border border-[#383D44] text-[#4D91D9] mx-auto flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>

              <div>
                <h4 className="font-heading font-bold text-[17px] text-[#F3F3F0]">
                  So‘rov qabul qilindi
                </h4>
                <div className="font-mono text-[12px] text-[#4D91D9] mt-1">
                  QAYD RAQAMI: {successResult.number}
                </div>
                <p className="text-[13px] text-[#A5ABB2] mt-2 max-w-sm mx-auto leading-relaxed">
                  {successResult.message}
                </p>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bz-btn-primary text-[13px] py-2.5 justify-center"
                >
                  <Send size={13} />
                  <span>Telegram orqali tezkor bog‘lanish</span>
                </a>
                <button
                  onClick={handleReset}
                  className="bz-btn-outline text-[13px] py-2 justify-center"
                >
                  Yopish
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-[4px] bg-red-950/40 border border-red-800 text-red-300 text-[12px] flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Product order summary if applicable */}
              {isEquipmentOrder && product && (
                <div className="p-3 bg-[#17191B] border border-[#383D44] rounded-[4px] flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-bold text-[#F3F3F0]">{product.nameUz}</div>
                    <div className="text-[11px] font-mono text-[#7E8791]">{product.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[13px] font-bold text-[#4D91D9]">
                      {product.price ? formatCurrency(product.price) : 'So‘rov bo‘yicha'}
                    </div>
                    <div className="flex items-center gap-2 mt-1 justify-end">
                      <span className="font-mono text-[10px] text-[#7E8791]">SONI:</span>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 px-1.5 py-0.5 rounded-[2px] bg-[#202327] border border-[#383D44] text-[12px] font-mono text-center text-[#F3F3F0] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Service Select if not equipment order */}
              {!isEquipmentOrder && (
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7E8791] mb-1.5">
                    Xizmat yo‘nalishi:
                  </label>
                  <select
                    value={serviceKey}
                    onChange={(e) => setServiceKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-[4px] bg-[#17191B] border border-[#383D44] text-[13px] text-[#F3F3F0] focus:border-[#4D91D9] focus:outline-none transition-colors"
                  >
                    {siteConfig.services.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.title}
                      </option>
                    ))}
                    <option value="general">Umumiy konsultatsiya / Boshqa</option>
                  </select>
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7E8791] mb-1">
                    Ism: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sardor Aliyev"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-[4px] bg-[#17191B] border border-[#383D44] text-[13px] text-[#F3F3F0] placeholder-[#7E8791] focus:border-[#4D91D9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7E8791] mb-1">
                    Telefon: *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-[4px] bg-[#17191B] border border-[#383D44] text-[13px] font-mono text-[#F3F3F0] placeholder-[#7E8791] focus:border-[#4D91D9] focus:outline-none"
                  />
                </div>
              </div>

              {/* Company / Store name */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7E8791] mb-1">
                  Do‘kon yoki korxona nomi (ixtiyoriy):
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Safia Resto yoki Minimarket"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 rounded-[4px] bg-[#17191B] border border-[#383D44] text-[13px] text-[#F3F3F0] placeholder-[#7E8791] focus:border-[#4D91D9] focus:outline-none"
                />
              </div>

              {/* If equipment order, delivery method and address */}
              {isEquipmentOrder && (
                <>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7E8791] mb-1.5">
                      Yetkazib berish usuli:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('COURIER')}
                        className={`py-2 px-3 rounded-[4px] text-[12px] font-medium border text-center transition-all ${
                          deliveryMethod === 'COURIER'
                            ? 'bg-[#17191B] border-[#4D91D9] text-[#4D91D9]'
                            : 'bg-[#17191B] border-[#383D44] text-[#A5ABB2]'
                        }`}
                      >
                        Kuryer orqali
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('PICKUP')}
                        className={`py-2 px-3 rounded-[4px] text-[12px] font-medium border text-center transition-all ${
                          deliveryMethod === 'PICKUP'
                            ? 'bg-[#17191B] border-[#4D91D9] text-[#4D91D9]'
                            : 'bg-[#17191B] border-[#383D44] text-[#A5ABB2]'
                        }`}
                      >
                        Olib ketish (Ofisdan)
                      </button>
                    </div>
                  </div>

                  {deliveryMethod === 'COURIER' && (
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7E8791] mb-1">
                        Yetkazib berish manzili:
                      </label>
                      <input
                        type="text"
                        placeholder="Shahar, tuman, ko‘cha, uy raqami"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-[4px] bg-[#17191B] border border-[#383D44] text-[13px] text-[#F3F3F0] placeholder-[#7E8791] focus:border-[#4D91D9] focus:outline-none"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Message */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7E8791] mb-1">
                  {isEquipmentOrder ? 'Qo‘shimcha izoh:' : 'Talab va maqsadlaringiz:'}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    isEquipmentOrder
                      ? 'Yetkazish vaqti yoki kassa dasturiga sozlash haqida izoh'
                      : 'Filiallar soni, kerakli dastur yoki qurilmalar haqida qisqacha...'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-[4px] bg-[#17191B] border border-[#383D44] text-[13px] text-[#F3F3F0] placeholder-[#7E8791] focus:border-[#4D91D9] focus:outline-none resize-none"
                />
              </div>

              {/* Preferred contact channel for service inquiry */}
              {!isEquipmentOrder && (
                <div className="flex items-center justify-between pt-1 text-[12px]">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#7E8791]">
                    Aloqa kanali:
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 text-[#A5ABB2] cursor-pointer">
                      <input
                        type="radio"
                        name="prefContact"
                        value="TELEGRAM"
                        checked={preferredContact === 'TELEGRAM'}
                        onChange={() => setPreferredContact('TELEGRAM')}
                        className="accent-[#4D91D9]"
                      />
                      <span>Telegram</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-[#A5ABB2] cursor-pointer">
                      <input
                        type="radio"
                        name="prefContact"
                        value="PHONE"
                        checked={preferredContact === 'PHONE'}
                        onChange={() => setPreferredContact('PHONE')}
                        className="accent-[#4D91D9]"
                      />
                      <span>Qo‘ng‘iroq</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bz-btn-primary w-full py-2.5 text-[13px] font-bold justify-center disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={13} />
                      <span>{isEquipmentOrder ? 'Buyurtmani yuborish' : 'So‘rovni yuborish'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
