'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/formatters';
import {
  Package,
  Plus,
  Search,
  Filter,
  Barcode,
  Printer,
  Upload,
  Download,
  X,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Layers,
} from 'lucide-react';

export default function ProductsPage() {
  const { t } = useApp();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [barcodeTarget, setBarcodeTarget] = useState<any>(null);

  // New product form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [variants, setVariants] = useState<any[]>([
    { size: 'M', color: 'Black', sku: 'NEW-BLK-M', barcode: '478000999001', costPrice: 80000, sellingPrice: 160000, minStockAlert: 5 },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [query, selectedCategory]);

  const loadProducts = () => {
    setLoading(true);
    fetch(`/api/products?query=${query}&categoryId=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data || []);
        if (data.length > 0 && !categoryId) {
          setCategoryId(data[0].categoryId);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const addVariantRow = () => {
    setVariants([
      ...variants,
      { size: 'L', color: 'Navy', sku: `NEW-NAV-${Date.now().toString().slice(-3)}`, barcode: `478000${Math.floor(100000 + Math.random() * 900000)}`, costPrice: 80000, sellingPrice: 160000, minStockAlert: 5 },
    ]);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || variants.length === 0) return;
    setSaving(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          categoryId,
          variants,
        }),
      });

      if (!res.ok) throw new Error('Failed to create product');

      setShowAddModal(false);
      setName('');
      setDescription('');
      loadProducts();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    let csv = 'Product Name,Category,SKU,Barcode,Size,Color,Cost Price,Selling Price,Stock\n';
    for (const p of products) {
      for (const v of p.variants) {
        const stock = v.balances?.reduce((a: number, b: any) => a + b.quantityOnHand, 0) || 0;
        csv += `"${p.name}","${p.category?.name || ''}","${v.sku}","${v.barcode || ''}","${v.size}","${v.color}",${v.costPrice},${v.sellingPrice},${stock}\n`;
      }
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'billz_product_catalog.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('products')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your centralized SKU catalog, variant matrices, barcodes, and price lists
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus size={15} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, SKU, barcode..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Variants</th>
                <th className="px-4 py-3">Retail Price Range</th>
                <th className="px-4 py-3">Total Stock</th>
                <th className="px-4 py-3 text-center">Labels</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Loading catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const totalStock = product.variants.reduce(
                    (acc: number, v: any) => acc + (v.balances?.reduce((a: number, b: any) => a + b.quantityOnHand, 0) || 0),
                    0
                  );
                  const minPrice = Math.min(...product.variants.map((v: any) => Number(v.sellingPrice)));
                  const maxPrice = Math.max(...product.variants.map((v: any) => Number(v.sellingPrice)));

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{product.name}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{product.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {product.category?.name || 'General'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">
                        {product.brand?.name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Layers size={13} className="text-indigo-600" />
                          <span className="font-bold text-slate-800">{product.variants.length}</span>
                          <span className="text-slate-400 text-[10px]">options</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-extrabold text-slate-900">
                        {minPrice === maxPrice ? formatCurrency(minPrice) : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            totalStock > 10
                              ? 'bg-emerald-50 text-emerald-700'
                              : totalStock > 0
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {totalStock} in stock
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setBarcodeTarget(product);
                            setShowBarcodeModal(true);
                          }}
                          className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600 transition-colors"
                          title="Print barcode labels"
                        >
                          <Barcode size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add New Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Product & Variants</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Linen Blend Summer Shirt"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  placeholder="Product material, care instructions, details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Variant Matrix Table */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Variant Matrix (Sizes & Colors)</span>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus size={13} />
                    <span>Add Variant</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] font-semibold text-slate-500 uppercase">
                      <tr>
                        <th className="p-2">Size</th>
                        <th className="p-2">Color</th>
                        <th className="p-2">SKU</th>
                        <th className="p-2">Barcode</th>
                        <th className="p-2">Cost (UZS)</th>
                        <th className="p-2">Price (UZS)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {variants.map((v, i) => (
                        <tr key={i}>
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.size}
                              onChange={(e) => {
                                const arr = [...variants];
                                arr[i].size = e.target.value;
                                setVariants(arr);
                              }}
                              className="w-14 px-1.5 py-1 border rounded text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.color}
                              onChange={(e) => {
                                const arr = [...variants];
                                arr[i].color = e.target.value;
                                setVariants(arr);
                              }}
                              className="w-16 px-1.5 py-1 border rounded text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.sku}
                              onChange={(e) => {
                                const arr = [...variants];
                                arr[i].sku = e.target.value;
                                setVariants(arr);
                              }}
                              className="w-24 px-1.5 py-1 border rounded text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.barcode}
                              onChange={(e) => {
                                const arr = [...variants];
                                arr[i].barcode = e.target.value;
                                setVariants(arr);
                              }}
                              className="w-28 px-1.5 py-1 border rounded text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={v.costPrice}
                              onChange={(e) => {
                                const arr = [...variants];
                                arr[i].costPrice = Number(e.target.value);
                                setVariants(arr);
                              }}
                              className="w-20 px-1.5 py-1 border rounded text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={v.sellingPrice}
                              onChange={(e) => {
                                const arr = [...variants];
                                arr[i].sellingPrice = Number(e.target.value);
                                setVariants(arr);
                              }}
                              className="w-20 px-1.5 py-1 border rounded text-xs font-bold text-indigo-600"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 border rounded-xl text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  {saving ? 'Saving...' : 'Save Product & Variants'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Printable Barcode Labels */}
      {showBarcodeModal && barcodeTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Print Shelf & Garment Barcodes</h3>
                <p className="text-xs text-slate-500">{barcodeTarget.name}</p>
              </div>
              <button onClick={() => setShowBarcodeModal(false)} className="p-1 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto">
              {barcodeTarget.variants.map((v: any) => (
                <div key={v.id} className="p-3 border rounded-xl bg-slate-50/50 flex flex-col items-center text-center">
                  <div className="text-xs font-bold text-slate-900">{barcodeTarget.name}</div>
                  <div className="text-[11px] text-slate-600">{v.size} / {v.color} • {v.sku}</div>
                  
                  {/* Simulated Code128 Barcode Visual */}
                  <div className="my-2 bg-white px-4 py-2 border rounded flex flex-col items-center">
                    <div className="flex items-center gap-[2px] h-8">
                      {Array.from({ length: 32 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="bg-black"
                          style={{
                            width: idx % 3 === 0 ? '3px' : idx % 5 === 0 ? '1px' : '2px',
                            height: '100%',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-700 mt-1">
                      {v.barcode || '478000100000'}
                    </span>
                  </div>

                  <div className="text-sm font-black text-slate-900">{formatCurrency(v.sellingPrice)}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer size={15} />
                <span>Print All Labels</span>
              </button>
              <button
                onClick={() => setShowBarcodeModal(false)}
                className="py-2 px-4 border rounded-xl text-xs font-semibold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
