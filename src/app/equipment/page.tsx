'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { siteConfig } from '@/config/site';
import ProductCard from '@/components/equipment/ProductCard';
import EmptyCatalogue from '@/components/equipment/EmptyCatalogue';
import InquiryModal from '@/components/inquiry/InquiryModal';

function EquipmentStoreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [inStockOnly, setInStockOnly] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/public/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (inStockOnly) {
      params.set('inStock', 'true');
    }

    fetch(`/api/public/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products', err);
        setProducts([]);
        setLoading(false);
      });
  }, [selectedCategory, searchQuery, inStockOnly]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.replace(`/equipment?${params.toString()}`);
  };

  const handleOrder = (product: any) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="bg-[#151719] text-[#F4F4F1] min-h-screen">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="pb-8 border-b border-[#353A40] mb-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#858C93]">
            USKUNALAR DO‘KONI
          </div>
          <h1 className="font-heading font-bold text-[32px] sm:text-[44px] text-[#F4F4F1] tracking-tight mt-1">
            Biznes va Kassa Uskunalari
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#B0B5BA] max-w-2xl mt-2 leading-relaxed">
            Chakana savdo, kafelar va korxonalar uchun sertifikatlangan monobloklar, chek printerlari, shtrix-kod skanerlari va biometrik qurilmalar.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-5 mb-10">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-3.5 text-[#858C93]" />
              <input
                type="text"
                placeholder="Model yoki artikul (SKU) bo‘yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-[6px] bg-[#1D2023] border border-[#353A40] text-[14px] text-[#F4F4F1] placeholder-[#858C93] focus:border-[#4B91D9] focus:outline-none"
              />
            </div>

            {/* In-Stock Filter Toggle */}
            <label className="inline-flex items-center gap-2 text-[13px] font-mono text-[#B0B5BA] cursor-pointer bg-[#1D2023] border border-[#353A40] px-4 py-2.5 rounded-[6px] self-start sm:self-auto">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#4B91D9] rounded"
              />
              <span>FAQAT MAVJUD USKUNALAR</span>
            </label>
          </div>

          {/* Horizontal Category Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#353A40] pt-1">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-3.5 py-2 rounded-[5px] text-[13px] font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#4B91D9] text-[#FFFFFF]'
                  : 'text-[#B0B5BA] hover:text-[#F4F4F1] hover:bg-[#1D2023]'
              }`}
            >
              Barchasi
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-3.5 py-2 rounded-[5px] text-[13px] font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#4B91D9] text-[#FFFFFF]'
                      : 'text-[#B0B5BA] hover:text-[#F4F4F1] hover:bg-[#1D2023]'
                  }`}
                >
                  <span>{cat.nameUz}</span>
                  {cat.productCount > 0 && (
                    <span
                      className={`text-[11px] font-mono px-1.5 rounded-[2px] ${
                        isSelected ? 'bg-black/20 text-[#FFFFFF]' : 'bg-[#151719] text-[#858C93]'
                      }`}
                    >
                      {cat.productCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <span className="font-mono text-[12px] text-[#858C93]">USKUNALAR YUKLANMOQDA...</span>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onOrderClick={handleOrder} />
            ))}
          </div>
        ) : (
          <EmptyCatalogue selectedCategory={selectedCategory} searchQuery={searchQuery} />
        )}

        {/* Order Modal */}
        <InquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          product={selectedProduct}
        />
      </div>
    </div>
  );
}

export default function EquipmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[500px] bg-[#151719]">
          <span className="font-mono text-[12px] text-[#858C93]">YUKLANMOQDA...</span>
        </div>
      }
    >
      <EquipmentStoreContent />
    </Suspense>
  );
}
