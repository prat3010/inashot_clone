'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { BundleTier } from './ProductDetailWithBundles';

interface StickyOfferBarProps {
  productId: string;
  productTitle: string;
  productHandle: string;
  productImage: string;
  selectedTier: BundleTier;
  inStock: boolean;
}

export default function StickyOfferBar({
  productId,
  productTitle,
  productHandle,
  productImage,
  selectedTier,
  inStock,
}: StickyOfferBarProps) {
  const { addItem } = useCartStore();
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 56);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const STORAGE_KEY = 'inashot_urgency_expiry';
    let targetTime: number;
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) : null;
    if (stored && Number(stored) > Date.now()) {
      targetTime = Number(stored);
    } else {
      targetTime = Date.now() + (14 * 60 + 56) * 1000;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, String(targetTime));
      }
    }

    const update = () => {
      const remaining = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        targetTime = Date.now() + (14 * 60 + 56) * 1000;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(STORAGE_KEY, String(targetTime));
        }
      }
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      id: `${productId}-${selectedTier.packCount}`,
      productId,
      productTitle,
      productHandle,
      tierTitle: `Pack of ${selectedTier.packCount}`,
      packCount: selectedTier.packCount,
      weightGrams: selectedTier.weightGrams,
      price: selectedTier.price,
      compareAtPrice: selectedTier.compareAtPrice || undefined,
      image: productImage,
    });
  };

  if (!isVisible) return null;

  return (
    <div
      className="sticky-bottom-bar color-background-4"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e0e0e0',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
        padding: '12px 0',
        transition: 'transform 0.3s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          maxWidth: '100%',
        }}
      >
        {/* Left: Product & Tier Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}>
          <img
            src={productImage}
            alt={productTitle}
            width={44}
            height={44}
            style={{ borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div className="body-normal" style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {productTitle}
            </div>
            <div className="body-xs" style={{ color: '#666', whiteSpace: 'nowrap' }}>
              Pack of {selectedTier.packCount} • Rs. {selectedTier.price.toFixed(0)}
            </div>
          </div>
        </div>

        {/* Center: Live Urgency Countdown Timer (hidden on mobile via CSS) */}
        <div
          className="sticky-urgency"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#fff9db',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid #ffe066',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#000' }}>
            ⚡ Special offer ends in:
          </span>
          <span
            style={{
              fontFamily: 'monospace',
              fontWeight: 800,
              fontSize: '1rem',
              color: '#d9480f',
            }}
          >
            {formattedTime}
          </span>
        </div>

        {/* Right: Add to Cart CTA */}
        <div style={{ flexShrink: 0 }}>
          <button
            type="button"
            className="button button--primary"
            onClick={handleAddToCart}
            disabled={!inStock}
            style={{ padding: '10px 18px', borderRadius: '40px', whiteSpace: 'nowrap' }}
          >
            <div className="button__content">
              <span className="button__label" style={{ fontSize: '0.85rem' }}>
                {inStock ? `Add to Cart • Rs. ${selectedTier.price.toFixed(0)}` : 'Sold Out'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
