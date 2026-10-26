'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    sku: string;
    nameUz: string;
    categorySlug: string;
    categoryName?: string;
    price: number | null;
    currency?: string;
    priceOnRequest?: boolean;
    descriptionUz: string;
    images: string[];
    specs?: Record<string, string>;
    inStock: boolean;
  };
  onOrderClick?: (product: any) => void;
}

export default function ProductCard({ product, onOrderClick }: ProductCardProps) {
  const primaryImage = product.images?.[0] || '';
  const displayPrice =
    product.priceOnRequest || !product.price
      ? 'Narxi so‘rov bo‘yicha'
      : formatCurrency(product.price);

  return (
    <div className="bg-[#1D2023] border border-[#353A40] rounded-[8px] overflow-hidden flex flex-col justify-between group hover:border-[#4D535B] transition-colors">
      <div>
        {/* Crisp Matte Product Frame (#F5F5F2) */}
        <Link href={`/equipment/${product.slug}`} className="block relative">
          <div className="bg-[#F5F5F2] h-48 sm:h-52 w-full p-4 flex items-center justify-center border-b border-[#353A40]">
            {primaryImage.startsWith('http') ? (
              <img
                src={primaryImage}
                alt={product.nameUz}
                className="max-h-full max-w-full object-contain filter contrast-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#858C93] gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-[#E6E6E1] text-[#25292D] rounded-[2px] font-semibold">
                  HARDWARE
                </span>
                <span className="font-mono text-[11px] text-[#858C93]">{product.sku}</span>
              </div>
            )}

            {/* In stock indicator */}
            <div className="absolute top-2.5 left-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[3px] bg-[#151719]/90 text-[#F4F4F1] border border-[#353A40]">
                {product.inStock ? 'OMBORDA MAVJUD' : 'BUYURTMAGA'}
              </span>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2 text-[11px] font-mono text-[#858C93]">
            <span className="uppercase tracking-wider truncate">
              {product.categoryName || product.categorySlug}
            </span>
            <span className="shrink-0">{product.sku}</span>
          </div>

          <Link href={`/equipment/${product.slug}`} className="block group-hover:text-[#4B91D9] transition-colors">
            <h3 className="font-heading font-bold text-[16px] text-[#F4F4F1] line-clamp-2 leading-snug">
              {product.nameUz}
            </h3>
          </Link>

          <p className="text-[13px] text-[#B0B5BA] mt-2 line-clamp-2 leading-relaxed">
            {product.descriptionUz}
          </p>

          {/* Technical Specs tags */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#353A40]/70 flex flex-wrap gap-1.5">
              {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                <span
                  key={key}
                  className="font-mono text-[10px] text-[#858C93] bg-[#151719] px-2 py-0.5 rounded-[3px] border border-[#353A40]"
                >
                  {val}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer with Price & Actions */}
      <div className="p-5 pt-3 border-t border-[#353A40] flex items-center justify-between gap-2 bg-[#151719]/40">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#858C93]">Narxi</div>
          <div className="font-mono font-bold text-[15px] text-[#F4F4F1]">
            {displayPrice}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/equipment/${product.slug}`}
            className="p-2 rounded-[6px] border border-[#353A40] text-[#B0B5BA] hover:text-[#F4F4F1] hover:bg-[#1D2023] transition-colors"
            title="Batafsil ko‘rish"
          >
            <ArrowUpRight size={14} />
          </Link>

          <button
            onClick={() => onOrderClick ? onOrderClick(product) : (window.location.href = `/equipment/${product.slug}`)}
            className="bz-btn-primary py-1.5 px-3 text-[12px]"
          >
            <ShoppingBag size={13} />
            <span>Buyurtma</span>
          </button>
        </div>
      </div>
    </div>
  );
}
