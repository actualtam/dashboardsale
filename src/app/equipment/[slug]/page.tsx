'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingBag,
  Send,
  Phone,
  ShieldCheck,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { formatCurrency } from '@/lib/formatters';
import InquiryModal from '@/components/inquiry/InquiryModal';
import ProductCard from '@/components/equipment/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    fetch(`/api/public/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProduct(data.data);
          if (data.data.images && data.data.images.length > 0) {
            setActiveImage(data.data.images[0]);
          }
        } else {
          setProduct(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load product detail', err);
        setProduct(null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-[#151719]">
        <span className="font-mono text-[12px] text-[#858C93]">USKUNA MA’LUMOTLARI YUKLANMOQDA...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="font-mono text-[11px] uppercase tracking-widest text-[#858C93] mb-2">404 // NOT FOUND</div>
        <h2 className="font-heading font-bold text-2xl text-[#F4F4F1] mb-3">
          Uskuna topilmadi
        </h2>
        <p className="text-[14px] text-[#B0B5BA] mb-6">
          Siz qidirayotgan mahsulot mavjud emas yoki sotuvdan olingan bo‘lishi mumkin.
        </p>
        <Link href="/equipment" className="bz-btn-primary text-[13px] py-2.5 px-5">
          <ArrowLeft size={14} />
          <span>Uskunalar katalogiga qaytish</span>
        </Link>
      </div>
    );
  }

  const displayPrice =
    product.priceOnRequest || !product.price
      ? 'Narxi so‘rov bo‘yicha'
      : formatCurrency(product.price);

  return (
    <div className="bg-[#151719] text-[#F4F4F1] min-h-screen">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#858C93] mb-10 pb-4 border-b border-[#353A40] overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#F4F4F1] transition-colors">
            ASOSIY
          </Link>
          <span>/</span>
          <Link href="/equipment" className="hover:text-[#F4F4F1] transition-colors">
            USKUNALAR
          </Link>
          <span>/</span>
          <Link
            href={`/equipment?category=${product.categorySlug}`}
            className="hover:text-[#F4F4F1] transition-colors text-[#B0B5BA]"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-[#4B91D9] truncate max-w-xs">{product.nameUz}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Product Imagery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#F5F5F2] h-80 sm:h-96 w-full p-6 flex items-center justify-center border border-[#353A40] rounded-[6px]">
              {activeImage && activeImage.startsWith('http') ? (
                <img
                  src={activeImage}
                  alt={product.nameUz}
                  className="max-h-full max-w-full object-contain filter contrast-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#858C93] gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-widest px-2.5 py-1 bg-[#E6E6E1] text-[#25292D] rounded-[2px] font-semibold">
                    HARDWARE SPEC
                  </span>
                  <span className="font-mono text-[12px] text-[#858C93]">{product.sku}</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`bg-[#F5F5F2] w-16 h-16 p-1.5 shrink-0 border rounded-[4px] transition-all ${
                      activeImage === img ? 'border-[#4B91D9] ring-1 ring-[#4B91D9]' : 'border-[#353A40] opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Badges Strip */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-[#1D2023] border border-[#353A40] rounded-[6px] space-y-0.5">
                <div className="font-mono text-[11px] text-[#4B91D9] uppercase tracking-wider">12 OY KAFOLAT</div>
                <div className="text-[13px] font-medium text-[#F4F4F1]">Rasmiy servis markazi</div>
              </div>

              <div className="p-3.5 bg-[#1D2023] border border-[#353A40] rounded-[6px] space-y-0.5">
                <div className="font-mono text-[11px] text-[#4B91D9] uppercase tracking-wider">24 SOATDA YETKAZISH</div>
                <div className="text-[13px] font-medium text-[#F4F4F1]">Toshkent bo‘ylab bepul</div>
              </div>
            </div>
          </div>

          {/* Right: Specifications & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#858C93]">
                <span>TOIFA: {product.categoryName}</span>
                <span>SKU: {product.sku}</span>
              </div>

              <h1 className="font-heading font-bold text-[26px] sm:text-[34px] text-[#F4F4F1] tracking-tight leading-snug">
                {product.nameUz}
              </h1>

              {/* Price Block */}
              <div className="mt-5 p-4 bg-[#1D2023] border border-[#353A40] rounded-[6px] flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#858C93]">
                    CHAKANA NARXI:
                  </div>
                  <div className="font-mono font-bold text-[24px] sm:text-[28px] text-[#F4F4F1] mt-0.5">
                    {displayPrice}
                  </div>
                </div>

                <div className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-[3px] bg-[#151719] border border-[#353A40] text-[#B0B5BA]">
                  {product.inStock ? 'OMBORDA MAVJUD' : 'BUYURTMAGA'}
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 space-y-2">
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#858C93]">
                  TAVSIF VA VAZIFASI
                </div>
                <p className="text-[14px] sm:text-[15px] text-[#B0B5BA] leading-[1.65]">
                  {product.descriptionUz}
                </p>
              </div>

              {/* Compatibility Tags */}
              {product.compatibility && product.compatibility.length > 0 && (
                <div className="mt-6 space-y-2">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#858C93]">
                    SINOVDAN O‘TGAN DASTURIY MOSLIK
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.compatibility.map((prog: string, i: number) => (
                      <span
                        key={i}
                        className="font-mono text-[12px] px-2.5 py-1 bg-[#1D2023] border border-[#353A40] rounded-[3px] text-[#F4F4F1]"
                      >
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-[#353A40] space-y-3">
              <button
                onClick={() => setModalOpen(true)}
                className="bz-btn-primary w-full py-3.5 text-[14px] font-bold justify-center"
              >
                <ShoppingBag size={15} />
                <span>Buyurtma berish</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bz-btn-outline py-2.5 text-[13px] justify-center"
                >
                  <Send size={14} className="text-[#4B91D9]" />
                  <span>Telegram orqali so‘rash</span>
                </a>

                <a
                  href={`tel:${siteConfig.phoneClean}`}
                  className="bz-btn-outline py-2.5 text-[13px] justify-center font-mono"
                >
                  <Phone size={14} className="text-[#4B91D9]" />
                  <span>{siteConfig.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#353A40]">
            <div className="max-w-3xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#858C93]">
                PARAMETRLAR
              </div>
              <h2 className="font-heading font-bold text-[22px] sm:text-[26px] text-[#F4F4F1] tracking-tight mt-1 mb-6">
                Texnik xususiyatlar
              </h2>

              <div className="border border-[#353A40] rounded-[6px] overflow-hidden divide-y divide-[#353A40] text-[13px]">
                {Object.entries(product.specs).map(([key, val], idx) => (
                  <div
                    key={key}
                    className={`grid grid-cols-1 sm:grid-cols-3 p-4 ${
                      idx % 2 === 0 ? 'bg-[#1D2023]' : 'bg-[#151719]'
                    }`}
                  >
                    <span className="font-mono text-[12px] text-[#858C93] uppercase sm:col-span-1">
                      {key}
                    </span>
                    <span className="font-mono text-[#F4F4F1] sm:col-span-2 mt-1 sm:mt-0">
                      {String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {product.related && product.related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#353A40]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-bold text-[20px] text-[#F4F4F1]">
                O‘xshash uskunalar
              </h2>
              <Link
                href={`/equipment?category=${product.categorySlug}`}
                className="text-[13px] font-mono text-[#4B91D9] hover:underline"
              >
                TOIFA BO‘YICHA BARCHASI →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.related.map((rel: any) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onOrderClick={() => router.push(`/equipment/${rel.slug}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Order Modal */}
        <InquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          product={product}
        />
      </div>
    </div>
  );
}
