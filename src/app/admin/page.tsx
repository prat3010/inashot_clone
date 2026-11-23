'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Save,
} from 'lucide-react';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProductValues, setEditProductValues] = useState<any>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setData((prev: any) => ({
          ...prev,
          orders: prev.orders.map((o: any) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o)),
        }));
        showToast(`Order ${orderId} updated to "${newStatus}"!`);
      }
    } catch (e) {
      alert('Failed to update status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleStartEditProduct = (prod: any) => {
    setEditingProductId(prod.id);
    setEditProductValues({
      id: prod.id,
      title: prod.title,
      price: prod.price,
      compareAtPrice: prod.compareAtPrice || '',
      inStock: prod.inStock,
    });
  };

  const handleSaveProduct = async () => {
    if (!editingProductId) return;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProductValues),
      });
      if (res.ok) {
        setData((prev: any) => ({
          ...prev,
          products: prev.products.map((p: any) =>
            p.id === editingProductId ? { ...p, ...editProductValues } : p
          ),
          kpi: {
            ...prev.kpi,
            activeProducts: prev.products.filter((p: any) =>
              p.id === editingProductId ? editProductValues.inStock : p.inStock
            ).length,
            outOfStockCount: prev.products.filter((p: any) =>
              p.id === editingProductId ? !editProductValues.inStock : !p.inStock
            ).length,
          },
        }));
        setEditingProductId(null);
        showToast('Product updated in SQLite! Changes live on storefront.');
      }
    } catch (e) {
      alert('Failed to update product');
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
          <RefreshCw className="w-5 h-5 animate-spin text-black" />
          <span>Loading Showcase Admin...</span>
        </div>
      </div>
    );
  }

  const { kpi, orders, products } = data;

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-black text-[#fdd835] px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#fdd835] bg-black px-3 py-1 rounded-full">
                DEMO SHOWCASE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900">
                IN&apos;A SHOT Store Management
              </h1>
            </div>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Zero-config SQLite engine connected to <code className="bg-gray-200 px-1 py-0.5 rounded text-black">./local.db</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              className="p-2.5 bg-white border border-gray-200 hover:border-black rounded-full text-gray-700 transition-colors"
              title="Refresh SQLite Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 bg-black hover:bg-[#fdd835] hover:text-black text-white font-black text-xs uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 1. KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500">Total Revenue</span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              Rs. {kpi.totalRevenue.toFixed(2)}
            </div>
            <span className="text-[11px] font-bold text-emerald-600 block">
              100% verified demo orders
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500">Total Orders</span>
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {kpi.totalOrders}
            </div>
            <span className="text-[11px] font-bold text-gray-400 block">
              Stored in SQLite tables
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500">Active Products</span>
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {kpi.activeProducts}
            </div>
            <span className="text-[11px] font-bold text-gray-400 block">
              In stock on storefront
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500">Out of Stock</span>
              <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {kpi.outOfStockCount}
            </div>
            <span className="text-[11px] font-bold text-rose-600 block">
              Toggled sold out
            </span>
          </div>
        </div>

        {/* 2. Live Order Table */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">
                Live Orders ({orders.length})
              </h2>
              <p className="text-xs text-gray-400 font-semibold">
                Changing status immediately syncs with the customer tracking page.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-black uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Payment</th>
                  <th className="py-3.5 px-6">Total</th>
                  <th className="py-3.5 px-6">Current Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-semibold">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-black text-black">
                      <Link
                        href={`/my-orders?id=${encodeURIComponent(order.id)}`}
                        className="hover:underline flex items-center gap-1 text-amber-800"
                        title="View Customer Tracking View"
                      >
                        <span>{order.id}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{order.customerName}</div>
                      <div className="text-gray-400 text-[11px]">{order.customerPhone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-800">
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-gray-900">
                      Rs. {order.total.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.orderStatus}
                        disabled={updatingOrderId === order.id}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-black uppercase text-gray-900 focus:outline-none focus:border-black shadow-sm cursor-pointer"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/my-orders?id=${encodeURIComponent(order.id)}`}
                        className="text-xs font-bold text-gray-500 hover:text-black underline"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Catalog Quick-Editor */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">
                Catalog Quick-Editor ({products.length} Products)
              </h2>
              <p className="text-xs text-gray-400 font-semibold">
                Edit prices, title, and stock availability directly in SQLite.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-black uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Sale Price (Rs)</th>
                  <th className="py-3.5 px-6">Regular Price (Rs)</th>
                  <th className="py-3.5 px-6">Stock Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-semibold">
                {products.map((prod: any) => {
                  const isEditing = editingProductId === prod.id;
                  return (
                    <tr key={prod.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                            <Image
                              src={prod.featuredImage}
                              alt={prod.title}
                              fill
                              className="object-contain p-0.5"
                            />
                          </div>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editProductValues.title}
                              onChange={(e) =>
                                setEditProductValues({ ...editProductValues, title: e.target.value })
                              }
                              className="border border-gray-300 rounded px-2 py-1 text-xs font-bold text-gray-900 w-60"
                            />
                          ) : (
                            <Link
                              href={`/products/${prod.handle}`}
                              className="font-bold text-gray-900 hover:text-amber-800 uppercase truncate max-w-xs block"
                            >
                              {prod.title}
                            </Link>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-gray-500 uppercase text-[11px] font-bold">
                        {prod.category}
                      </td>

                      <td className="py-4 px-6">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editProductValues.price}
                            onChange={(e) =>
                              setEditProductValues({ ...editProductValues, price: e.target.value })
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-xs font-bold text-gray-900 w-24"
                          />
                        ) : (
                          <span className="font-black text-gray-900">
                            Rs. {prod.price.toFixed(2)}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editProductValues.compareAtPrice}
                            onChange={(e) =>
                              setEditProductValues({
                                ...editProductValues,
                                compareAtPrice: e.target.value,
                              })
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-xs font-bold text-gray-900 w-24"
                          />
                        ) : (
                          <span className="text-gray-400">
                            {prod.compareAtPrice ? `Rs. ${prod.compareAtPrice.toFixed(2)}` : '—'}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {isEditing ? (
                          <select
                            value={editProductValues.inStock ? 'true' : 'false'}
                            onChange={(e) =>
                              setEditProductValues({
                                ...editProductValues,
                                inStock: e.target.value === 'true',
                              })
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-xs font-bold text-gray-900"
                          >
                            <option value="true">In Stock</option>
                            <option value="false">Sold Out</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              prod.inStock
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {prod.inStock ? 'In Stock' : 'Sold Out'}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={handleSaveProduct}
                              className="px-3 py-1 bg-black text-[#fdd835] hover:bg-gray-800 text-[11px] font-black rounded-lg uppercase flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingProductId(null)}
                              className="text-gray-400 hover:text-black text-xs font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEditProduct(prod)}
                            className="text-xs font-black uppercase text-amber-800 hover:text-black underline"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
