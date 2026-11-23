'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '#INAS-1042';

  const [query, setQuery] = useState(initialId);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (searchTarget: string) => {
    if (!searchTarget.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(searchTarget.trim())}`);
      const data = await res.json();
      if (res.ok) {
        setOrderData(data);
      } else {
        setError(data.error || 'Order not found');
        setOrderData(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(query);
  };

  const demoPills = [
    { label: '#INAS-1042 (Shipped)', value: '#INAS-1042' },
    { label: '#INAS-1028 (Packed)', value: '#INAS-1028' },
    { label: '#INAS-1015 (Order Placed)', value: '#INAS-1015' },
  ];

  return (
    <div className="bg-white min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-[#fdd835] bg-black px-4 py-1.5 rounded-full inline-block mb-3">
            LIVE ORDER TRACKING
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900">
            Track Your Delivery
          </h1>
          <p className="mt-2 text-sm text-gray-600 font-medium">
            Look up your order status in real time or test with quick-demo pills below.
          </p>
        </div>

        {/* Search input and demo pills */}
        <div className="bg-[#fafafa] p-6 rounded-3xl border border-gray-200/80 mb-10 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. #INAS-1042) or Phone (+91 98765 43210)"
                className="w-full pl-11 pr-4 py-3.5 rounded-full border border-gray-300 focus:border-black focus:outline-none text-sm font-semibold bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-black hover:bg-[#fdd835] hover:text-black text-white font-black text-xs uppercase tracking-wider rounded-full transition-colors shrink-0"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Quick Demo Test Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Quick Demo Pills:
            </span>
            {demoPills.map((pill) => (
              <button
                key={pill.value}
                type="button"
                onClick={() => {
                  setQuery(pill.value);
                  fetchOrder(pill.value);
                }}
                className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
                  query === pill.value
                    ? 'border-black bg-black text-[#fdd835]'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 mb-8 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Order Details & Timeline */}
        {orderData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Order Banner */}
            <div className="bg-black text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#fdd835]">
                    {orderData.order.id}
                  </span>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-white/20 text-white uppercase tracking-wider">
                    {orderData.order.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Placed on {new Date(orderData.order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs uppercase text-gray-400 font-bold block">Total Amount</span>
                <span className="text-xl font-black text-white">
                  Rs. {orderData.order.total.toFixed(2)}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold block">
                  {orderData.order.paymentStatus} ({orderData.order.paymentMethod})
                </span>
              </div>
            </div>

            {/* 4-Step Shipment Progress Timeline */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-8">
                Shipment Progress
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {orderData.trackingSteps.map((step: any, idx: number) => {
                  const isDone = step.completed;
                  return (
                    <div key={idx} className="relative group">
                      {/* Step node dot */}
                      <div
                        className={`absolute -left-[1.85rem] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white transition-colors ${
                          isDone
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-gray-300 text-gray-300'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h4
                            className={`text-sm font-black uppercase tracking-tight ${
                              isDone ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          <span className="text-xs font-semibold text-gray-400">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping address */}
              <div className="bg-[#fafafa] p-6 rounded-3xl border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-800 tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery Address</span>
                </div>
                <h4 className="text-sm font-black text-gray-900">{orderData.order.customerName}</h4>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  {orderData.order.address}, {orderData.order.city}, {orderData.order.state} - {orderData.order.pincode}
                </p>
                <p className="text-xs font-bold text-gray-700 pt-1">
                  Phone: {orderData.order.customerPhone}
                </p>
              </div>

              {/* Items in this order */}
              <div className="bg-[#fafafa] p-6 rounded-3xl border border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-800 tracking-wider">
                  <Package className="w-4 h-4" />
                  <span>Ordered Items</span>
                </div>
                <div className="space-y-3 divide-y divide-gray-200/60">
                  {orderData.items.map((item: any) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        <Image
                          src={item.image}
                          alt={item.productTitle}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-black uppercase text-gray-900 truncate">
                          {item.productTitle}
                        </h5>
                        <p className="text-[11px] font-bold text-amber-700">
                          {item.variantTitle} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-black text-gray-900">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm font-bold text-gray-400">Loading order tracker...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
