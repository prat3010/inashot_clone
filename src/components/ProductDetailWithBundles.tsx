'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import StickyOfferBar from './StickyOfferBar';

export interface BundleTier {
  id: string;
  packCount: number;
  weightGrams: number;
  price: number;
  compareAtPrice?: number | null;
  discountPercent?: number;
  badge?: string | null;
}

export interface ProductDetailProps {
  product: {
    id: string;
    handle: string;
    title: string;
    category: string;
    description: string;
    featuredImage: string;
    images: string[];
    badge?: string | null;
    inStock: boolean;
    grams: number;
    macros?: { protein: string; fiber: string; sugar: string };
    ingredients?: string;
    faqs?: Array<{ question: string; answer: string }>;
  };
  bundleTiers: BundleTier[];
}

export default function ProductDetailWithBundles({
  product,
  bundleTiers,
}: ProductDetailProps) {
  const { addItem } = useCartStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>('ingredients');
  const [countdown, setCountdown] = useState('14:56');

  // Urgency timer sync
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
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      setCountdown(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      if (remaining === 0) {
        targetTime = Date.now() + (14 * 60 + 56) * 1000;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(STORAGE_KEY, String(targetTime));
        }
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const defaultTiers: BundleTier[] =
    bundleTiers.length > 0
      ? bundleTiers
      : [
          {
            id: `${product.id}-tier-1`,
            packCount: product.category === 'roasted-edamame' ? 9 : 8,
            weightGrams: product.grams,
            price: 531.0,
            compareAtPrice: 540.0,
            discountPercent: 2,
            badge: null,
          },
          {
            id: `${product.id}-tier-2`,
            packCount: product.category === 'roasted-edamame' ? 18 : 16,
            weightGrams: product.grams * 2,
            price: 987.66,
            compareAtPrice: 1062.0,
            discountPercent: 7,
            badge: 'Best value',
          },
          {
            id: `${product.id}-tier-3`,
            packCount: product.category === 'roasted-edamame' ? 27 : 24,
            weightGrams: product.grams * 3,
            price: 1401.84,
            compareAtPrice: 1593.0,
            discountPercent: 12,
            badge: 'Super saver',
          },
        ];

  const [selectedTier, setSelectedTier] = useState<BundleTier>(defaultTiers[0]);

  // Reset selected image and tier when product changes
  useEffect(() => {
    setSelectedTier(defaultTiers[0]);
    setSelectedImageIndex(0);
  }, [product.id]);

  const allImages = product.images.length > 0 ? product.images : [product.featuredImage];
  const activeImage = allImages[selectedImageIndex] || product.featuredImage;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem({
      id: `${product.id}-${selectedTier.packCount}`,
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      tierTitle: `Pack of ${selectedTier.packCount}`,
      packCount: selectedTier.packCount,
      weightGrams: selectedTier.weightGrams,
      price: selectedTier.price,
      compareAtPrice: selectedTier.compareAtPrice || undefined,
      image: product.featuredImage,
    });
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <>
      <section
        id="shopify-section-template--29572451697004__main-product"
        className="shopify-section product-section"
        data-dropdowns-initialized="true"
      >
        <section
          id="MainProduct-template--29572451697004__main-product"
          data-section="template--29572451697004__main-product"
          className="section-template--29572451697004__main-product-padding color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d background"
        >
          <div
            className="product container"
            style={{
              ['--media-aspect-ratio' as string]: '1.0',
              ['--thumbs-width' as string]: '92px',
              ['--product-media-desktop-gap' as string]: '2.4rem',
              ['--product-media-vertical-paddings' as string]: '4rem',
            }}
          >
            <div className="product-outer" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '3.2rem', paddingTop: '2rem', paddingBottom: '4rem', alignItems: 'start', width: '100%', maxWidth: '100%' }}>
              {/* Media Gallery */}
              <div className="product-media" data-section="main-template--29572451697004__main-product" data-image-type="square" style={{ width: '100%', maxWidth: '620px', minWidth: 0 }}>
                <div className="product-media__wrapper" style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100%', minWidth: 0 }}>
                  <div className="product-media__list-wrapper" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
                    <div className="product-media-item active" style={{ width: '100%', maxWidth: '100%', position: 'relative' }}>
                      <div className="product__media media" style={{ paddingBottom: '100%', position: 'relative', overflow: 'hidden', borderRadius: '1.2rem', backgroundColor: '#f7f7f7' }}>
                        <img
                          src={activeImage}
                          alt={product.title}
                          className="motion-reduce"
                          style={{ objectFit: 'contain', width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                        />
                        {product.badge && (
                          <div className="product-badges-wrapper" style={{ position: 'absolute', top: '16px', left: '16px' }}>
                            <span className="badge badge--sale body-small">{product.badge}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {allImages.length > 1 && (
                    <div
                      className="product-media__list-thumbnails"
                      style={{ display: 'flex', gap: '12px', marginTop: '16px', overflowX: 'auto', paddingBottom: '8px', width: '100%', maxWidth: '100%' }}
                    >
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`button--unstyled ${selectedImageIndex === idx ? 'active' : ''}`}
                          style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '8px',
                            border: selectedImageIndex === idx ? '2px solid #000' : '1px solid #ddd',
                            overflow: 'hidden',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            flexShrink: 0,
                            padding: 0,
                          }}
                        >
                          <img
                            src={img}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div
                className="product-info-container"
                id="ProductInfo-template--29572451697004__main-product"
              >
                <div className="product-title-wrapper">
                  <h1 className="product-title h3">{product.title}</h1>
                </div>

                <div className="product-description-wrapper">
                  <div className="product-description rte">
                    <p dir="ltr">
                      Pack of {selectedTier.packCount} (
                      {selectedTier.weightGrams
                        ? Math.round(selectedTier.weightGrams / selectedTier.packCount)
                        : 30}
                      g Each) | {product.title}
                    </p>
                  </div>
                </div>

                <div className="product-price no-js-hidden" id="price-template--29572451697004__main-product">
                  <div className={`price price--product body-xl ${selectedTier.compareAtPrice ? 'price--on-sale' : ''}`}>
                    <dl>
                      <div className="price__sale" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <dd>
                          <span className="price-item price-item--sale" dir="ltr" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                            Rs. {selectedTier.price.toFixed(2)}
                          </span>
                        </dd>
                        {selectedTier.compareAtPrice && (
                          <dd className="price__compare">
                            <s className="price-item price-item--regular" dir="ltr" style={{ color: '#888' }}>
                              Rs. {selectedTier.compareAtPrice.toFixed(2)}
                            </s>
                          </dd>
                        )}
                      </div>
                    </dl>
                  </div>
                  <div className="product-tax rte body-xs" style={{ color: '#777', marginTop: '4px' }}>
                    <Link href="/policies/shipping-policy">Shipping</Link> calculated at checkout. Free shipping over Rs. 499.
                  </div>
                </div>

                {/* Macro Callout Pills */}
                <div className="custom-liquid" style={{ marginTop: '20px', marginBottom: '20px', maxWidth: '100%' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px 14px',
                      padding: '12px 14px',
                      backgroundColor: '#fbfbfb',
                      borderRadius: '12px',
                      border: '1px solid #ebebeb',
                      maxWidth: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src="/scraped/images/Vector_57.png" alt="" width={22} height={22} />
                      <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {product.macros?.protein || '13G PLANT PROTEIN'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src="/scraped/images/Group_3_5.png" alt="" width={22} height={22} />
                      <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {product.macros?.fiber || 'HIGH IN FIBRE'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src="/scraped/images/Group_2_4.png" alt="" width={22} height={22} />
                      <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {product.macros?.sugar || '0% SUGAR'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bundlex Verbatim Offer Widget */}
                <div className="product-buy-buttons">
                  <div className="bx-countdown-timer bx-widget-container">
                    Hurry! Offer expires in {countdown}
                  </div>

                  <div className="bx-widget-container">
                    <div className="bx-widget bx-layout-horizontal">
                      <div className="bx-header bx-header-left">
                        Choose your offer
                      </div>

                      <div className="bx-offers bx-offers-col-3" role="radiogroup">
                        {defaultTiers.map((tier, idx) => {
                          const isActive = selectedTier.id === tier.id;
                          return (
                            <div
                              key={tier.id}
                              className={`bx-offer-wrap js-bx-offer ${isActive ? 'bx-active' : ''}`}
                              data-offer-key={String(idx)}
                              role="radio"
                              aria-checked={isActive}
                              tabIndex={0}
                              onClick={() => setSelectedTier(tier)}
                            >
                              <div className="bx-offer">
                                <div className="bx-offer-main">
                                  <div className="bx-offer-items">
                                    <div className="bx-radio"><span></span></div>
                                    <div className="bx-content">
                                      <div className="bx-offer-title">Pack of {tier.packCount}</div>
                                      {tier.discountPercent && tier.discountPercent > 0 && (
                                        <div className="bx-offer-label">Save {tier.discountPercent}%</div>
                                      )}
                                      <div className="bx-offer-subtitle">{tier.weightGrams}gm</div>
                                    </div>
                                    <div className="bx-offer-prices js-bx-offer-price">
                                      <div>
                                        <div className="bx-offer-price">
                                          {tier.compareAtPrice && (
                                            <div className="bx-original-price">
                                              Rs. {tier.compareAtPrice.toFixed(2)}
                                            </div>
                                          )}
                                          <div className="bx-discounted-price">
                                            Rs. {tier.price.toFixed(2)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {tier.badge && (
                                <div className="bx-offer-badge-wrap" data-badge-type="folded">
                                  <div className="bx-offer-badge">{tier.badge}</div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <product-form className="product-form" style={{ marginTop: '20px' }}>
                    <button
                      type="button"
                      className="product-form__submit button button--full-width button--primary"
                      name="add"
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                    >
                      <div className="button__content">
                        <span className="button__label">
                          {product.inStock
                            ? `Add Pack of ${selectedTier.packCount} to Cart`
                            : 'Sold Out'}
                        </span>
                      </div>
                    </button>
                  </product-form>
                </div>

                {/* Verbatim Product Dropdown Accordions */}
                <div style={{ marginTop: '32px' }}>
                  <div className="product-dropdown" data-product-dropdown="">
                    <button
                      type="button"
                      className={`product-dropdown__toggle ${openDropdown === 'ingredients' ? 'active' : ''}`}
                      aria-label="toggle"
                      data-product-dropdown-toggle=""
                      onClick={() => toggleDropdown('ingredients')}
                    >
                      <span className="product-dropdown__toggle-text body-normal">
                        Ingredients &amp; Nutritions
                      </span>
                      <div className="product-dropdown__toggle-icon"></div>
                    </button>
                    <div
                      className={`product-dropdown__content rte ${openDropdown === 'ingredients' ? 'active' : ''}`}
                      data-product-dropdown-content=""
                    >
                      <p>
                        <span className="metafield-multi_line_text_field">
                          {product.ingredients ||
                            '100% Edamame, Seasoning Spices & Condiments, Iodised Salt, Cold Pressed Rice Bran Oil. Never fried, zero palm oil, high in natural plant protein and dietary fibre.'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="product-dropdown" data-product-dropdown="">
                    <button
                      type="button"
                      className={`product-dropdown__toggle ${openDropdown === 'faqs' ? 'active' : ''}`}
                      aria-label="toggle"
                      data-product-dropdown-toggle=""
                      onClick={() => toggleDropdown('faqs')}
                    >
                      <span className="product-dropdown__toggle-text body-normal">
                        Product Details &amp; FAQs
                      </span>
                      <div className="product-dropdown__toggle-icon"></div>
                    </button>
                    <div
                      className={`product-dropdown__content rte ${openDropdown === 'faqs' ? 'active' : ''}`}
                      data-product-dropdown-content=""
                    >
                      <p>
                        <strong>Shelf Life:</strong> 6 months from the date of manufacture.
                      </p>
                      <p>
                        <strong>Storage:</strong> Store in a cool, dry place away from direct sunlight. Once opened, consume immediately or seal in an airtight container.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Urgency Sticky Offer Bar */}
      <StickyOfferBar
        productId={product.id}
        productTitle={product.title}
        productHandle={product.handle}
        productImage={product.featuredImage}
        selectedTier={selectedTier}
        inStock={product.inStock}
      />
    </>
  );
}
