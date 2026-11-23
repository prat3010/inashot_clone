'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { X, ShoppingBag, Check, ShieldCheck } from 'lucide-react';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addItem } = useCartStore();
  const [selectedPack, setSelectedPack] = useState<number>(0);

  if (!quickViewProduct) return null;

  const isRoasted = quickViewProduct.category === 'roasted-edamame';
  const packCounts = isRoasted ? [9, 18, 27] : [8, 16, 24];
  const activePack = packCounts[selectedPack] || packCounts[0];

  // Price calculations
  let calculatedPrice = quickViewProduct.price;
  if (selectedPack === 1) {
    calculatedPrice = isRoasted ? 987.66 : 892.80;
  } else if (selectedPack === 2) {
    calculatedPrice = isRoasted ? 1433.70 : 1296.00;
  }

  const handleAddToCart = () => {
    if (!quickViewProduct.inStock) return;
    const weightGrams = isRoasted ? activePack * 30 : activePack * 30;

    addItem({
      id: `${quickViewProduct.id}-${activePack}`,
      productId: quickViewProduct.id,
      productTitle: quickViewProduct.title,
      productHandle: quickViewProduct.handle,
      tierTitle: `Pack of ${activePack}`,
      packCount: activePack,
      weightGrams,
      price: calculatedPrice,
      compareAtPrice: quickViewProduct.compareAtPrice || undefined,
      image: quickViewProduct.featuredImage,
    });
    closeQuickView();
  };

  return (
    <div className="quick-view-modal fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        <button
          onClick={closeQuickView}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black rounded-full transition-colors z-10"
          aria-label="Close Quick View"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Image */}
          <div className="relative aspect-square bg-[#f9f9f9] rounded-2xl overflow-hidden p-4 border border-gray-100">
            <Image
              src={quickViewProduct.featuredImage}
              alt={quickViewProduct.title}
              fill
              className="object-contain"
            />
            {quickViewProduct.badge && (
              <span className="absolute top-3 left-3 bg-black text-[#fdd835] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                {quickViewProduct.badge}
              </span>
            )}
          </div>

          {/* Product details */}
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 block mb-1">
                {quickViewProduct.category.replace('-', ' ')}
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 leading-snug">
                {quickViewProduct.title}
              </h3>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-gray-900">
                Rs. {calculatedPrice.toFixed(2)}
              </span>
              {quickViewProduct.compareAtPrice && (
                <span className="text-sm font-semibold text-gray-400 line-through">
                  Rs. {quickViewProduct.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Macro Callout Pills */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full">
                13G PLANT PROTEIN
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full">
                HIGH IN FIBRE
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full">
                0% SUGAR
              </span>
            </div>

            {/* Pack Selector */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-700 block">
                Select Pack:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {packCounts.map((count, idx) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setSelectedPack(idx)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                      selectedPack === idx
                        ? 'border-black bg-black text-[#fdd835]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-800 bg-gray-50'
                    }`}
                  >
                    Pack of {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart button */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleAddToCart}
                disabled={!quickViewProduct.inStock}
                className={`w-full py-3.5 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  quickViewProduct.inStock
                    ? 'bg-black text-white hover:bg-[#fdd835] hover:text-black shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{quickViewProduct.inStock ? 'Add to Cart' : 'Sold Out'}</span>
              </button>

              <Link
                href={`/products/${quickViewProduct.handle}`}
                onClick={closeQuickView}
                className="text-center text-xs font-bold text-gray-500 hover:text-black underline uppercase tracking-wider"
              >
                View Full Product Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
