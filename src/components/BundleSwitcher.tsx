'use client';

import React from 'react';
import { Check } from 'lucide-react';

export interface BundleTier {
  id: string;
  packCount: number;
  weightGrams: number;
  price: number;
  compareAtPrice?: number | null;
  discountPercent: number;
  badge?: string | null;
}

interface BundleSwitcherProps {
  tiers: BundleTier[];
  selectedTier: BundleTier;
  onSelectTier: (tier: BundleTier) => void;
}

export default function BundleSwitcher({
  tiers,
  selectedTier,
  onSelectTier,
}: BundleSwitcherProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-gray-900">
          Choose your offer
        </span>
        <span className="text-xs font-bold text-amber-700">
          Save up to 10%
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {tiers.map((tier) => {
          const isSelected = selectedTier.id === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelectTier(tier)}
              className={`relative flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-black bg-amber-50/40 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <span className="absolute -top-2.5 right-4 bg-[#fdd835] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                  {tier.badge}
                </span>
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-black bg-black text-[#fdd835]' : 'border-gray-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-gray-900 uppercase">
                      Pack of {tier.packCount}
                    </span>
                    {tier.discountPercent > 0 && (
                      <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Save {tier.discountPercent}%
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {tier.weightGrams}gm ({tier.packCount} × {Math.round(tier.weightGrams / tier.packCount)}g)
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="text-right">
                <div className="text-sm font-black text-gray-900">
                  Rs. {tier.price.toFixed(2)}
                </div>
                {tier.compareAtPrice && tier.compareAtPrice > tier.price && (
                  <div className="text-xs text-gray-400 font-semibold line-through">
                    Rs. {tier.compareAtPrice.toFixed(2)}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
