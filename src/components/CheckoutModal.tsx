'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import confetti from 'canvas-confetti';
import { X, CheckCircle, ShieldCheck, CreditCard, QrCode, Banknote, Sparkles } from 'lucide-react';

export default function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, items, subtotal, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    name: 'Aarav Sharma',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    address: 'Flat 402, Green Glen Layout, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<string | null>(null);
  const [completedTotal, setCompletedTotal] = useState<number>(0);

  const handleClose = () => {
    setCompletedOrder(null);
    setCompletedTotal(0);
    closeCheckout();
  };

  if (!isCheckoutOpen) return null;

  const currentSubtotal = subtotal();
  const shippingFee = currentSubtotal >= 499 ? 0 : 50;
  const grandTotal = currentSubtotal + shippingFee;

  const handleFillDemoData = () => {
    setFormData({
      name: 'Rohan Mehra',
      phone: '+91 98111 22334',
      email: 'rohan.mehra@example.com',
      address: 'Villa 12, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
    });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          paymentMethod,
          items,
          subtotal: currentSubtotal,
          shippingFee,
          total: grandTotal,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCompletedOrder(data.orderId);
        setCompletedTotal(grandTotal);
        clearCart();

        // Fire festive celebration confetti!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore
        }
      } else {
        alert(data.error || 'Failed to complete order');
      }
    } catch (err: any) {
      alert('Error creating order: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-modal fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl overflow-hidden border border-gray-100 my-8">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black rounded-full transition-colors z-10"
          aria-label="Close Checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Order Confirmation View */
          <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#fdd835] bg-black px-3.5 py-1 rounded-full inline-block">
                ORDER CONFIRMED
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900">
                Thank You, {formData.name}!
              </h3>
              <p className="text-sm font-semibold text-gray-500">
                Your order <strong className="text-gray-900 font-black">{completedOrder}</strong> has been logged to SQLite and is being prepped for dispatch.
              </p>
            </div>

            <div className="bg-[#fafafa] p-4 rounded-2xl border border-gray-100 text-left space-y-2 text-xs">
              <div className="flex justify-between font-medium text-gray-500">
                <span>Shipping Address:</span>
                <span className="font-bold text-gray-800">{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-500">
                <span>Payment Mode:</span>
                <span className="font-bold text-gray-800">{paymentMethod} (Verified Demo)</span>
              </div>
              <div className="flex justify-between font-medium text-gray-500">
                <span>Total Paid:</span>
                <span className="font-black text-black">Rs. {completedTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/my-orders?id=${encodeURIComponent(completedOrder)}`}
                onClick={handleClose}
                className="flex-1 py-3.5 bg-black hover:bg-[#fdd835] hover:text-black text-white rounded-full font-black text-xs uppercase tracking-wider text-center transition-all shadow-md"
              >
                Track Live Order {completedOrder.startsWith('#') ? completedOrder : `#${completedOrder}`}
              </Link>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3.5 border border-gray-300 hover:border-black rounded-full font-black text-xs uppercase tracking-wider text-gray-700 transition-colors"
              >
                Back to Store
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 block">
                  Simulated 1-Click Checkout
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">
                  Express Delivery Details
                </h3>
              </div>
              <button
                type="button"
                onClick={handleFillDemoData}
                className="text-[11px] font-black uppercase tracking-wider text-amber-800 hover:text-black bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Demo Fill</span>
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-gray-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-black focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-gray-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-black focus:outline-none text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-gray-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-black focus:outline-none text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-gray-700 block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-black focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-gray-700 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-black focus:outline-none text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-gray-700 block mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-black focus:outline-none text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-gray-700 block mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-black focus:outline-none text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-700 block">
                Select Payment Simulation
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { key: 'Card', label: 'Card', icon: CreditCard },
                  { key: 'COD', label: 'Cash on Del.', icon: Banknote },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setPaymentMethod(m.key as any)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === m.key
                          ? 'border-black bg-black text-[#fdd835] shadow-sm'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-black uppercase">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order Summary & Submit Button */}
            <div className="bg-[#fafafa] p-4 rounded-2xl border border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600 font-semibold">
                <span>Items ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                <span>Rs. {currentSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-semibold">
                <span>Shipping Fee</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-600 uppercase">FREE</strong> : `Rs. ${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 border-t pt-2 uppercase">
                <span>Total Payable</span>
                <span>Rs. {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-black hover:bg-[#fdd835] hover:text-black text-white font-black text-sm uppercase tracking-wider rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShieldCheck className="w-5 h-5 text-[#fdd835] group-hover:text-black" />
              <span>{isSubmitting ? 'Processing Demo Order...' : `Complete Demo Order • Rs. ${grandTotal.toFixed(2)}`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
