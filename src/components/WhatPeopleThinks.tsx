'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export interface ReviewProduct {
  id: string;
  title: string;
  handle: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  packCount: number;
  grams: number;
  category: string;
}

export interface ReviewItem {
  id: string;
  authorName: string;
  authorHandle?: string | null;
  rating: number;
  quote: string;
  product?: ReviewProduct;
}

interface WhatPeopleThinksProps {
  reviews: ReviewItem[];
}

export default function WhatPeopleThinks({ reviews }: WhatPeopleThinksProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (product: ReviewProduct) => {
    addItem({
      id: `${product.id}-${product.packCount}`,
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      tierTitle: `Pack of ${product.packCount}`,
      packCount: product.packCount,
      weightGrams: product.grams,
      price: product.price,
      compareAtPrice: product.compareAtPrice || undefined,
      image: product.image,
    });
  };

  return (
    <section
      id="shopify-section-template--29572451434860__testimonials"
      className="shopify-section testimonials-section anim-active"
    >
      <div
        className="testimonials color-scheme-532186f7-5400-4da8-867a-7eceb69be8ce background section-template--29572451434860__testimonials-padding"
        data-enable-header-animation="true"
        style={{
          ['--heading-delay' as string]: '0s',
          ['--description-delay' as string]: '0.3s',
        }}
      >
        <div className="testimonials-heading-group container">
          <div className="testimonials__titles titles titles--left">
            <h4 className="testimonials__title title h2 size--h2">
              <span className="word" style={{ ['--word-index' as string]: 0 }}>
                What
              </span>{' '}
              <span className="word" style={{ ['--word-index' as string]: 1 }}>
                People
              </span>{' '}
              <span className="word" style={{ ['--word-index' as string]: 2 }}>
                Thinks
              </span>
            </h4>
          </div>
        </div>

        <div className="testimonials-main content container">
          <div className="testimonials-slider" style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <div
              className="testimonials-slider-wrapper"
              style={{
                display: 'flex',
                gap: '24px',
                overflowX: 'auto',
                maxWidth: '100%',
                paddingBottom: '1.5rem',
                scrollSnapType: 'x mandatory',
              }}
            >
              {reviews.map((r, i) => (
                <div
                  key={r.id || i}
                  className="testimonials-slider-slide color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d background"
                  style={{
                    minWidth: 'min(340px, 85vw)',
                    maxWidth: '420px',
                    flex: '0 0 auto',
                    borderRadius: '20px',
                    padding: '28px',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div className="testimonials-slider-slide__rating" style={{ marginBottom: '14px' }}>
                      <div
                        className="testimonials-slider-slide__rating-stars"
                        style={{ display: 'flex', gap: '4px', color: '#ffdb00' }}
                      >
                        {[...Array(5)].map((_, s) => (
                          <svg
                            key={s}
                            className="icon icon-star"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M7.30783 1.14622C7.52458 0.474163 8.47542 0.474161 8.69217 1.14622L10.0707 5.42053C10.1677 5.72151 10.4482 5.92527 10.7644 5.92458L15.2555 5.91476C15.9616 5.91322 16.2555 6.81753 15.6833 7.23134L12.0441 9.87304C11.7891 10.0582 11.6823 10.3877 11.7797 10.6885L13.1678 14.9602C13.3855 15.6315 12.6162 16.1906 12.0435 15.775L8.39768 13.1293C8.14324 12.9447 7.85676 12.9447 7.60232 13.1293L3.95648 15.775C3.38379 16.1906 2.61453 15.6315 2.8322 14.9602L4.22033 10.6885C4.31767 10.3877 4.21087 10.0582 3.95587 9.87304L0.316698 7.23134C-0.255475 6.81753 0.0384485 5.91322 0.744538 5.91476L5.23559 5.92458C5.5518 5.92527 5.83229 5.72151 5.92931 5.42053L7.30783 1.14622Z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    <div
                      className="testimonials-slider-slide__text body-normal"
                      style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '18px' }}
                    >
                      &ldquo;{r.quote}&rdquo;
                    </div>

                    <div className="testimonials-slider-slide__author-name h5" style={{ margin: '0 0 2px 0' }}>
                      {r.authorName}
                    </div>
                    {r.authorHandle && (
                      <div
                        className="testimonials-slider-slide__author-bio body-xs"
                        style={{ color: '#888', marginBottom: '16px' }}
                      >
                        {r.authorHandle}
                      </div>
                    )}
                  </div>

                  {r.product && (
                    <div
                      className="card-horizontal-wrapper"
                      style={{
                        marginTop: '16px',
                        padding: '12px 16px',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #ebebeb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={r.product.image}
                          alt={r.product.title}
                          width={48}
                          height={48}
                          style={{ borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="body-xs" style={{ fontWeight: 600 }}>
                            {r.product.title}
                          </div>
                          <div className="body-xs" style={{ color: '#666' }}>
                            Rs. {r.product.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="button button--secondary button--small"
                        onClick={() => handleAddToCart(r.product!)}
                        style={{ minWidth: '60px', padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        <span>Add</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
