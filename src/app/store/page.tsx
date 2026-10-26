'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/formatters';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  X,
  Plus,
  Minus,
  CheckCircle2,
  Truck,
  Store,
  CreditCard,
  QrCode,
  ArrowRight,
} from 'lucide-react';

export default function OnlineStorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Cart
  const [cart, setCart] = useState<any[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Checkout form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [deliveryMethod, setDeliveryMethod] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'PAYME' | 'CLICK'>('PAYME');
  const [notes, setNotes] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  useEffect(() => {
    fetch('/api/pos/products?branchId=all')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setLoading(false);
      });
  }, []);

  const addToCart = (product: any, variant: any) => {
    const existing = cart.find((i) => i.variantId === variant.id);
    if (existing) {
      setCart(cart.map((i) => (i.variantId === variant.id ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setCart([
        ...cart,
        {
          variantId: variant.id,
          productName: product.name,
          size: variant.size,
          color: variant.color,
          unitPrice: Number(variant.sellingPrice),
          quantity: 1,
        },
      ]);
    }
    setSelectedProduct(null);
    setShowCartDrawer(true);
  };

  const updateCartQty = (variantId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.variantId === variantId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any[]
    );
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'DELIVERY' ? 25000 : 0;
  const cartTotal = cartSubtotal + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !customerName || !customerPhone) return;
    setPlacingOrder(true);

    try {
      const branchesRes = await fetch('/api/branches');
      const branches = await branchesRes.json();
      const targetBranch = branches[0];

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: targetBranch?.id,
          customerName,
          customerPhone,
          deliveryMethod,
          deliveryAddress,
          paymentMethod,
          items: cart,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setConfirmedOrder(data);
      setCart([]);
      setShowCheckout(false);
      setShowCartDrawer(false);
    } catch (err: any) {
      alert(`Checkout error: ${err.message}`);
    } finally {
      setPlacingOrder(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat;
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Consumer Storefront Nav */}
      <nav className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
            B
          </div>
          <div>
            <div className="font-extrabold text-slate-900 tracking-tight text-base leading-none">
              DASHBOARDSALE
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Official Online Storefront</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            ← Back to SaaS Admin
          </Link>

          <button
            onClick={() => setShowCartDrawer(true)}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800 transition-all"
          >
            <ShoppingCart size={16} />
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-10 px-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Summer & Autumn Retail Collection</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
          Shop directly from our Tashkent flagship store with same-day express delivery across Uzbekistan.
        </p>

        {/* Store Search */}
        <div className="max-w-md mx-auto mt-5 relative">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search clothing, gadgets, cosmetics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-xs text-slate-900 shadow-md focus:outline-none"
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            selectedCat === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedCat === c.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading catalog...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((p) => {
              const minPrice = Math.min(...p.variants.map((v: any) => Number(v.sellingPrice)));
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      {p.category?.name}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">{p.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{p.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">From</div>
                      <div className="text-xs font-extrabold text-slate-900">{formatCurrency(minPrice)}</div>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      Choose Options
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Variant Selection Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedProduct.name}</h3>
                <p className="text-xs text-slate-500">Pick variant and add to cart</p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="p-1 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {selectedProduct.variants.map((v: any) => (
                <div key={v.id} className="p-2.5 border rounded-xl flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{v.size} • {v.color}</div>
                    <div className="text-[11px] font-extrabold text-indigo-600">{formatCurrency(v.sellingPrice)}</div>
                  </div>
                  <button
                    onClick={() => addToCart(selectedProduct, v)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-5 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Your Shopping Cart</h3>
              </div>
              <button onClick={() => setShowCartDrawer(false)} className="p-1 text-slate-400">
                <X size={18} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">Your cart is empty.</div>
              ) : (
                cart.map((item) => (
                  <div key={item.variantId} className="p-3 border rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.productName}</div>
                      <div className="text-[11px] text-slate-500">{item.size} • {item.color}</div>
                      <div className="text-xs font-extrabold text-indigo-600 mt-1">{formatCurrency(item.unitPrice)}</div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                      <button onClick={() => updateCartQty(item.variantId, -1)} className="w-5 h-5 bg-white rounded flex items-center justify-center font-bold text-xs">-</button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQty(item.variantId, 1)} className="w-5 h-5 bg-white rounded flex items-center justify-center font-bold text-xs">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Totals */}
            {cart.length > 0 && (
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total:</span>
                  <span className="text-indigo-600">{formatCurrency(cartSubtotal)}</span>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Order & Delivery Checkout</h3>
              <button type="button" onClick={() => setShowCheckout(false)} className="p-1 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <input type="text" required placeholder="e.g. Alisher Usmonov" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full mt-1 p-2 border rounded-lg text-xs" />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Phone Number (+998)</label>
              <input type="text" required placeholder="+998 90 123 45 67" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full mt-1 p-2 border rounded-lg text-xs font-bold" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeliveryMethod('DELIVERY')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                  deliveryMethod === 'DELIVERY' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'
                }`}
              >
                <Truck size={14} />
                <span>Courier Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod('PICKUP')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                  deliveryMethod === 'PICKUP' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'
                }`}
              >
                <Store size={14} />
                <span>Pickup in Store</span>
              </button>
            </div>

            {deliveryMethod === 'DELIVERY' && (
              <div>
                <label className="text-xs font-semibold text-slate-700">Delivery Address</label>
                <input type="text" required placeholder="City, district, street, house/apt..." value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="w-full mt-1 p-2 border rounded-lg text-xs" />
              </div>
            )}

            {/* Payment method selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700">Payment Option</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {['PAYME', 'CLICK', 'CASH'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m as any)}
                    className={`py-2 rounded-lg border text-xs font-bold ${
                      paymentMethod === m ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'
                    }`}
                  >
                    {m === 'CASH' ? 'Cash on Arrival' : m}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span>{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t">
                <span>Total Amount Due:</span>
                <span className="text-indigo-600">{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md"
            >
              {placingOrder ? 'Confirming order...' : `Confirm Order (${formatCurrency(cartTotal)})`}
            </button>
          </form>
        </div>
      )}

      {/* Confirmed Order Modal */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-3 shadow-2xl">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Order Confirmed!</h3>
            <p className="text-xs text-slate-500">
              Order <span className="font-bold text-indigo-600">{confirmedOrder.orderNumber}</span> has been created.
              Our store team is preparing your items.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 font-semibold">
              Total Amount: {formatCurrency(confirmedOrder.totalAmount)}
            </div>
            <button
              onClick={() => setConfirmedOrder(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Back to Store
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
