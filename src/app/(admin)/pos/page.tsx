'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import {
  Search,
  Barcode,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  User,
  Pause,
  Play,
  RotateCcw,
  CheckCircle2,
  Printer,
  X,
  AlertCircle,
  Coins,
  QrCode,
  DollarSign,
  Layers,
} from 'lucide-react';

interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  size: string;
  color: string;
  sku: string;
  barcode: string;
  unitPrice: number;
  unitCost: number;
  quantity: number;
  discountAmount: number;
  availableStock: number;
}

export default function POSPage() {
  const { t, currentBranchId, branches } = useApp();
  const [activeBranchId, setActiveBranchId] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountTotal, setDiscountTotal] = useState<number>(0);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [suspendedCarts, setSuspendedCarts] = useState<{ id: string; time: string; items: CartItem[]; customer: any }[]>([]);

  // Modals
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<any>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [completedSale, setCompletedSale] = useState<any>(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UZCARD' | 'HUMO' | 'PAYME' | 'CLICK' | 'SPLIT'>('CASH');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [splitCash, setSplitCash] = useState<number>(0);
  const [splitCard, setSplitCard] = useState<number>(0);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Customers search
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');

  // Shift state
  const [shiftData, setShiftData] = useState<any>(null);
  const [shiftAction, setShiftAction] = useState<'VIEW' | 'OPEN' | 'CLOSE' | 'MOVE'>('VIEW');
  const [shiftOpeningCash, setShiftOpeningCash] = useState<number>(500000);
  const [shiftClosingCash, setShiftClosingCash] = useState<number>(0);
  const [movementAmount, setMovementAmount] = useState<number>(0);
  const [movementReason, setMovementReason] = useState<string>('');
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('OUT');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize active branch
  useEffect(() => {
    if (branches.length > 0) {
      if (currentBranchId && currentBranchId !== 'all') {
        setActiveBranchId(currentBranchId);
      } else {
        const main = branches.find((b) => b.isMain) || branches[0];
        setActiveBranchId(main.id);
      }
    }
  }, [branches, currentBranchId]);

  // Load products & categories
  useEffect(() => {
    if (!activeBranchId) return;
    setLoading(true);
    fetch(`/api/pos/products?branchId=${activeBranchId}&query=${searchQuery}&categoryId=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('POS load error', err);
        setLoading(false);
      });
  }, [activeBranchId, searchQuery, selectedCategory]);

  // Load active shift
  useEffect(() => {
    if (!activeBranchId) return;
    fetch(`/api/pos/shifts?branchId=${activeBranchId}`)
      .then((res) => res.json())
      .then((data) => setShiftData(data))
      .catch((err) => console.error(err));
  }, [activeBranchId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        if (cart.length > 0) {
          openPaymentModal();
        }
      } else if (e.key === 'F7') {
        e.preventDefault();
        if (cart.length > 0) {
          parkCart();
        }
      } else if (e.key === 'Escape') {
        setSelectedProductForVariants(null);
        setShowPaymentModal(false);
        setShowCustomerModal(false);
        setShowShiftModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Barcode / Fast Add
  const handleProductSelect = (product: any) => {
    if (product.variants.length === 1) {
      addVariantToCart(product, product.variants[0]);
    } else {
      setSelectedProductForVariants(product);
    }
  };

  const addVariantToCart = (product: any, variant: any) => {
    const availableStock = variant.balances?.[0]?.quantityOnHand ?? 10;
    const existingIndex = cart.findIndex((item) => item.variantId === variant.id);

    if (existingIndex > -1) {
      const existing = cart[existingIndex];
      if (existing.quantity + 1 > availableStock) {
        alert(`Cannot add more. Only ${availableStock} in stock.`);
        return;
      }
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      if (availableStock < 1) {
        alert('This item is currently out of stock.');
        return;
      }
      setCart([
        ...cart,
        {
          variantId: variant.id,
          productId: product.id,
          productName: product.name,
          size: variant.size,
          color: variant.color,
          sku: variant.sku,
          barcode: variant.barcode,
          unitPrice: Number(variant.sellingPrice),
          unitCost: Number(variant.costPrice),
          quantity: 1,
          discountAmount: 0,
          availableStock,
        },
      ]);
    }
    setSelectedProductForVariants(null);
  };

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    const item = updated[index];
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      updated.splice(index, 1);
    } else if (newQty > item.availableStock) {
      alert(`Max available stock is ${item.availableStock}`);
      return;
    } else {
      item.quantity = newQty;
    }
    setCart(updated);
  };

  const removeItem = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const clearCart = () => {
    if (cart.length > 0 && confirm('Clear the current cart?')) {
      setCart([]);
      setDiscountTotal(0);
      setSelectedCustomer(null);
    }
  };

  const parkCart = () => {
    if (cart.length === 0) return;
    setSuspendedCarts([
      ...suspendedCarts,
      {
        id: `PARK-${Date.now().toString().slice(-4)}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: cart,
        customer: selectedCustomer,
      },
    ]);
    setCart([]);
    setSelectedCustomer(null);
    setDiscountTotal(0);
  };

  const restoreCart = (index: number) => {
    const target = suspendedCarts[index];
    setCart(target.items);
    setSelectedCustomer(target.customer);
    const updated = [...suspendedCarts];
    updated.splice(index, 1);
    setSuspendedCarts(updated);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const totalAmount = Math.max(0, subtotal - discountTotal);
  const taxAmount = Math.round((totalAmount * 0.12) / 1.12);

  const openPaymentModal = () => {
    setCashTendered(totalAmount);
    setSplitCash(Math.round(totalAmount / 2));
    setSplitCard(totalAmount - Math.round(totalAmount / 2));
    setPaymentError('');
    setShowPaymentModal(true);
  };

  // Process checkout
  const handleCompleteSale = async () => {
    setProcessingPayment(true);
    setPaymentError('');

    try {
      const payments = [];
      if (paymentMethod === 'SPLIT') {
        if (splitCash + splitCard < totalAmount) {
          throw new Error('Split payment total is less than the checkout total.');
        }
        payments.push({ method: 'CASH', amount: splitCash });
        payments.push({ method: 'UZCARD', amount: splitCard });
      } else {
        payments.push({ method: paymentMethod, amount: totalAmount });
      }

      const payload = {
        branchId: activeBranchId,
        customerId: selectedCustomer?.id,
        shiftId: shiftData?.id,
        items: cart.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          unitCost: i.unitCost,
          discountAmount: i.discountAmount,
        })),
        payments,
        discountTotal,
      };

      const res = await fetch('/api/pos/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete checkout');
      }

      setCompletedSale(data.sale);
      setCart([]);
      setSelectedCustomer(null);
      setDiscountTotal(0);
      setShowPaymentModal(false);
      setShowReceiptModal(true);
    } catch (err: any) {
      setPaymentError(err.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Customer search
  const searchCustomers = (query: string) => {
    setCustomerSearch(query);
    fetch(`/api/customers?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setCustomersList(data));
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-slate-100">
      {/* LEFT: Product Catalog & Search (60%) */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 bg-white">
        {/* Top filter bar */}
        <div className="p-3 border-b border-slate-200 flex flex-wrap items-center gap-2 bg-slate-50">
          {/* Barcode / Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t('searchProductPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
            <Barcode size={16} className="absolute right-3 top-2.5 text-slate-400" />
          </div>

          {/* Branch indicator */}
          <div className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700">
            {branches.find((b) => b.id === activeBranchId)?.name || 'Store'}
          </div>

          {/* Shift Button */}
          <button
            onClick={() => {
              setShiftAction('VIEW');
              setShowShiftModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm"
          >
            <Coins size={14} className="text-amber-500" />
            <span>{shiftData?.status === 'OPEN' ? t('shiftStatusOpen') : t('openShift')}</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto bg-white no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-xs text-slate-400">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-xs">
              <Search size={24} className="mb-2 text-slate-300" />
              <span>No products match your search.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {products.map((product) => {
                const totalStock = product.variants.reduce(
                  (acc: number, v: any) => acc + (v.balances?.[0]?.quantityOnHand || 0),
                  0
                );
                const minPrice = Math.min(...product.variants.map((v: any) => Number(v.sellingPrice)));
                const maxPrice = Math.max(...product.variants.map((v: any) => Number(v.sellingPrice)));

                return (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="flex flex-col text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md bg-white transition-all group"
                  >
                    <div className="flex items-start justify-between gap-1 w-full">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        {product.category?.name || 'General'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          totalStock > 5
                            ? 'bg-emerald-50 text-emerald-700'
                            : totalStock > 0
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {totalStock} in stock
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mt-1">
                      {product.name}
                    </div>

                    <div className="mt-auto pt-2 flex items-center justify-between w-full">
                      <div className="text-xs font-extrabold text-slate-900">
                        {minPrice === maxPrice ? formatCurrency(minPrice) : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`}
                      </div>
                      {product.variants.length > 1 && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded font-medium">
                          {product.variants.length} vars
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: POS Cart & Checkout Panel (40%) */}
      <div className="w-full lg:w-[420px] flex flex-col bg-white shadow-lg border-l border-slate-200">
        {/* Customer & Cart Controls */}
        <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowCustomerModal(true);
                searchCustomers('');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all shadow-sm"
            >
              <User size={14} className="text-indigo-600" />
              <span className="max-w-[140px] truncate">
                {selectedCustomer ? selectedCustomer.fullName : t('selectCustomer')}
              </span>
            </button>

            {selectedCustomer && (
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                {selectedCustomer.currentLoyaltyPoints} pts
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Park / Suspend button */}
            <button
              onClick={parkCart}
              disabled={cart.length === 0}
              className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 disabled:opacity-30"
              title={t('suspendSale')}
            >
              <Pause size={16} />
            </button>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              disabled={cart.length === 0}
              className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500 disabled:opacity-30"
              title={t('clearCart')}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Suspended Carts alert bar */}
        {suspendedCarts.length > 0 && (
          <div className="bg-amber-50 px-3 py-1.5 border-b border-amber-200 flex items-center justify-between text-xs text-amber-800">
            <span>{suspendedCarts.length} parked cart(s)</span>
            <div className="flex gap-1">
              {suspendedCarts.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => restoreCart(idx)}
                  className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 rounded font-semibold text-[10px]"
                >
                  Resume {p.time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center p-6">
              <ShoppingCart size={36} className="text-slate-300 mb-2" />
              <div className="text-xs font-semibold text-slate-600">{t('cartEmpty')}</div>
              <div className="text-[11px] text-slate-400 mt-1">Press F2 to search or scan barcodes</div>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.variantId}-${idx}`}
                className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 truncate">{item.productName}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span className="font-medium text-indigo-600">{item.size} / {item.color}</span>
                    <span>•</span>
                    <span>{formatCurrency(item.unitPrice)}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(idx, -1)}
                    className="w-6 h-6 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-xs"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-xs font-bold text-slate-800 w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(idx, 1)}
                    className="w-6 h-6 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-xs"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <div className="text-xs font-bold text-slate-900">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Totals & Checkout Button */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2.5">
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>{t('subtotal')}</span>
              <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between text-amber-700 font-medium">
                <span>{t('discount')}</span>
                <span>-{formatCurrency(discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>{t('tax')}</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
            <span className="text-sm font-bold text-slate-900">{t('total')}</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          {/* Pay Button */}
          <button
            onClick={openPaymentModal}
            disabled={cart.length === 0}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-sm shadow-xs border border-slate-900/10 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            <CreditCard size={18} />
            <span>{t('pay')} ({formatCurrency(totalAmount)})</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: Variant Selection Matrix */}
      {selectedProductForVariants && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-100">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedProductForVariants.name}</h3>
                <p className="text-xs text-slate-500">Select variant to add to checkout cart</p>
              </div>
              <button
                onClick={() => setSelectedProductForVariants(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {selectedProductForVariants.variants.map((variant: any) => {
                const stock = variant.balances?.[0]?.quantityOnHand ?? 0;
                return (
                  <div
                    key={variant.id}
                    className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {variant.size} • {variant.color}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        SKU: {variant.sku} | Barcode: {variant.barcode}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900">
                          {formatCurrency(variant.sellingPrice)}
                        </div>
                        <div className={`text-[10px] font-bold ${stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                        </div>
                      </div>

                      <button
                        onClick={() => addVariantToCart(selectedProductForVariants, variant)}
                        disabled={stock <= 0}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold disabled:opacity-30"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Customer Search / Attachment */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Attach Customer</h3>
              <button onClick={() => setShowCustomerModal(false)} className="p-1 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="mt-3 relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or phone (+998)..."
                value={customerSearch}
                onChange={(e) => searchCustomers(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="mt-3 divide-y divide-slate-100 max-h-60 overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setShowCustomerModal(false);
                }}
                className="w-full text-left py-2 px-2 hover:bg-slate-50 text-xs font-semibold text-slate-500"
              >
                Guest / Retail Customer (No CRM account)
              </button>
              {customersList.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomer(c);
                    setShowCustomerModal(false);
                  }}
                  className="w-full text-left py-2.5 px-2 hover:bg-slate-50 flex items-center justify-between rounded-lg"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800">{c.fullName}</div>
                    <div className="text-[11px] text-slate-400">{c.phone}</div>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {c.currentLoyaltyPoints} pts ({c.segment})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Payment Tender & Split Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Checkout Payment</h3>
                <p className="text-xs text-slate-500">Total Due: <span className="font-extrabold text-indigo-700">{formatCurrency(totalAmount)}</span></p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="p-1 text-slate-400">
                <X size={18} />
              </button>
            </div>

            {paymentError && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Payment method selector tabs */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-4">
              {[
                { id: 'CASH', label: 'Cash' },
                { id: 'UZCARD', label: 'Uzcard' },
                { id: 'HUMO', label: 'Humo' },
                { id: 'PAYME', label: 'Payme' },
                { id: 'CLICK', label: 'Click' },
                { id: 'SPLIT', label: 'Split' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-all ${
                    paymentMethod === m.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Cash Tender specifics */}
            {paymentMethod === 'CASH' && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Cash Received from Customer</label>
                  <input
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-base font-bold rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Quick Cash Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {[50000, 100000, 200000, 500000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setCashTendered(amt)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                    >
                      +{formatCurrency(amt)}
                    </button>
                  ))}
                  <button
                    onClick={() => setCashTendered(totalAmount)}
                    className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-xs font-bold text-indigo-700"
                  >
                    Exact
                  </button>
                </div>

                {/* Change Due Box */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">{t('changeDue')}</span>
                  <span className={`text-lg font-black ${cashTendered >= totalAmount ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {cashTendered >= totalAmount ? formatCurrency(cashTendered - totalAmount) : 'Insufficient cash'}
                  </span>
                </div>
              </div>
            )}

            {/* Split Tender specifics */}
            {paymentMethod === 'SPLIT' && (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Cash Amount</label>
                    <input
                      type="number"
                      value={splitCash}
                      onChange={(e) => setSplitCash(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Card / QR Amount</label>
                    <input
                      type="number"
                      value={splitCard}
                      onChange={(e) => setSplitCard(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200"
                    />
                  </div>
                </div>
                <div className="text-xs text-slate-500 flex justify-between">
                  <span>Sum of Tender: {formatCurrency(splitCash + splitCard)}</span>
                  <span>Required: {formatCurrency(totalAmount)}</span>
                </div>
              </div>
            )}

            {/* Payme / Click QR simulation */}
            {(paymentMethod === 'PAYME' || paymentMethod === 'CLICK') && (
              <div className="mt-4 p-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 flex flex-col items-center justify-center text-center">
                <QrCode size={48} className="text-indigo-600 mb-2" />
                <span className="text-xs font-bold text-slate-800">{paymentMethod} Dynamic Checkout QR</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Customer scans to pay {formatCurrency(totalAmount)}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteSale}
                disabled={processingPayment || (paymentMethod === 'CASH' && cashTendered < totalAmount)}
                className="flex-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {processingPayment ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Complete Sale & Issue Receipt</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Printable Thermal Receipt */}
      {showReceiptModal && completedSale && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 flex flex-col items-center">
            {/* The actual printable receipt */}
            <div id="printable-receipt" className="w-full text-slate-800 text-xs font-mono space-y-2 border-b pb-4">
              <div className="text-center">
                <div className="font-extrabold text-sm uppercase">DashboardSale</div>
                <div className="text-[10px] text-slate-500">{completedSale.branch?.name}</div>
                <div className="text-[10px] text-slate-500">{completedSale.branch?.address}</div>
                <div className="text-[10px] text-slate-500">INN: 308945201</div>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 text-[11px] flex justify-between">
                <span>Receipt: {completedSale.saleNumber}</span>
                <span>{formatDate(completedSale.createdAt)}</span>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 divide-y divide-slate-100">
                {completedSale.items.map((item: any, i: number) => (
                  <div key={i} className="py-1">
                    <div className="font-semibold text-slate-900 truncate">
                      {item.variant.product.name} ({item.variant.size}/{item.variant.color})
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>{item.quantity} x {formatCurrency(item.unitPrice)}</span>
                      <span>{formatCurrency(item.totalAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(completedSale.subtotal)}</span>
                </div>
                {Number(completedSale.discountTotal) > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-{formatCurrency(completedSale.discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-xs text-slate-900">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(completedSale.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Included QQS (12%):</span>
                  <span>{formatCurrency(completedSale.taxTotal)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 text-center text-[10px] text-slate-400">
                Thank you for shopping with us!
                <br />
                Powered by DashboardSale Retail OS
              </div>
            </div>

            {/* Print & Close buttons */}
            <div className="mt-4 flex gap-2 w-full no-print">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer size={15} />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => {
                  setShowReceiptModal(false);
                  setCompletedSale(null);
                }}
                className="py-2 px-4 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Cash Shift Management */}
      {showShiftModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Cash Register Shift (POS-01)</h3>
              <button onClick={() => setShowShiftModal(false)} className="p-1 text-slate-400">
                <X size={18} />
              </button>
            </div>

            {shiftData?.status === 'OPEN' ? (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={15} />
                    <span>Shift is currently OPEN</span>
                  </div>
                  <div className="mt-1 text-[11px]">
                    Opened: {formatDate(shiftData.openedAt)} by {shiftData.cashier?.fullName}
                  </div>
                  <div className="mt-1 font-semibold">
                    Starting Float: {formatCurrency(shiftData.openingCash)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={async () => {
                      const amount = prompt('Enter cash in/out amount (e.g. 50000):');
                      if (amount) {
                        await fetch('/api/pos/shifts', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            action: 'MOVEMENT',
                            shiftId: shiftData.id,
                            type: 'IN',
                            amount: Number(amount),
                            reason: 'Mid-shift float addition',
                          }),
                        });
                        alert('Cash movement recorded.');
                      }
                    }}
                    className="p-2.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50"
                  >
                    + Cash In
                  </button>
                  <button
                    onClick={async () => {
                      const amount = prompt('Enter drop/out amount:');
                      if (amount) {
                        await fetch('/api/pos/shifts', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            action: 'MOVEMENT',
                            shiftId: shiftData.id,
                            type: 'OUT',
                            amount: Number(amount),
                            reason: 'Safe deposit drop',
                          }),
                        });
                        alert('Cash drop recorded.');
                      }
                    }}
                    className="p-2.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50"
                  >
                    - Cash Drop
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="text-xs font-semibold text-slate-700">Actual Cash in Register Drawer to Close</label>
                  <input
                    type="number"
                    value={shiftClosingCash}
                    onChange={(e) => setShiftClosingCash(Number(e.target.value))}
                    placeholder="Enter closing cash..."
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-xs font-bold"
                  />
                  <button
                    onClick={async () => {
                      if (confirm('Reconcile drawer and close cashier shift?')) {
                        const res = await fetch('/api/pos/shifts', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            action: 'CLOSE',
                            shiftId: shiftData.id,
                            closingCash: shiftClosingCash,
                          }),
                        });
                        const data = await res.json();
                        alert(`Shift closed! Discrepancy: ${formatCurrency(data.cashDifference)}`);
                        setShowShiftModal(false);
                      }
                    }}
                    className="w-full mt-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                  >
                    Close Shift & Reconcile
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-600">Register is currently closed. Enter starting float to open.</p>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Starting Float (UZS)</label>
                  <input
                    type="number"
                    value={shiftOpeningCash}
                    onChange={(e) => setShiftOpeningCash(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-xs font-bold"
                  />
                </div>
                <button
                  onClick={async () => {
                    await fetch('/api/pos/shifts', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        action: 'OPEN',
                        branchId: activeBranchId,
                        openingCash: shiftOpeningCash,
                      }),
                    });
                    alert('Shift opened successfully!');
                    setShowShiftModal(false);
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                >
                  Open Cash Register Shift
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
