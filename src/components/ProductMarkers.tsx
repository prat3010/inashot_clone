'use client';

import React from 'react';
import Link from 'next/link';

export interface MarkerProduct {
  id: string;
  handle: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
}

interface ProductMarkersProps {
  products?: MarkerProduct[];
}

export default function ProductMarkers({ products }: ProductMarkersProps) {
  const defaultProducts: MarkerProduct[] = [
    {
      id: 'm-1',
      handle: 'peri-peri-roasted-edamame',
      title: 'Peri Peri Roasted Edamame',
      price: 531.0,
      compareAtPrice: 540.0,
      image: '/scraped/images/Basket.png',
    },
    {
      id: 'm-2',
      handle: 'achari-roasted-edamame',
      title: 'Achari Roasted Edamame',
      price: 531.0,
      compareAtPrice: 540.0,
      image: '/scraped/images/Basket1.png',
    },
    {
      id: 'm-3',
      handle: 'peri-peri-seed-mix',
      title: 'Peri Peri Seed Mix',
      price: 480.0,
      compareAtPrice: 600.0,
      image: '/scraped/images/Basket_2_2.png',
    },
  ];

  const items = products && products.length > 0 ? products : defaultProducts;

  return (
    <section
      id="shopify-section-template--29572451697004__product_markers_e8QKw7"
      className="shopify-section product-markers-section anim-active"
    >
      <div
        className="product-markers color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d background section-template--29572451697004__product_markers_e8QKw7-padding"
        data-enable-header-animation="true"
        style={{
          ['--heading-delay' as string]: '0s',
          ['--description-delay' as string]: '0.3s',
        }}
      >
        <div className="container">
          <div className="product-markers__titles titles titles--center">
            <h3 className="product-markers__title title h3 size--h3">
              <span className="word" style={{ ['--word-index' as string]: 0 }}>
                Most
              </span>{' '}
              <span className="word" style={{ ['--word-index' as string]: 1 }}>
                Recommended
              </span>{' '}
              <span className="word" style={{ ['--word-index' as string]: 2 }}>
                Products
              </span>
            </h3>
          </div>

          <div className="product-markers__main product-markers__main--mobile-image-bottom content">
            <div
              className="product-markers-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginTop: '3.2rem',
              }}
            >
              {items.slice(0, 3).map((item, idx) => (
                <div key={item.id || idx} className="product-markers__item-inner active" data-index={idx + 1}>
                  <div
                    className="card-horizontal color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d"
                    data-product={item.handle}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: 'rgb(var(--color-background-secondary, 248, 248, 248))',
                      borderRadius: '16px',
                      position: 'relative',
                    }}
                  >
                    <Link
                      href={`/products/${item.handle}`}
                      className="link card-horizontal-link-overlay"
                      aria-label={item.title}
                      style={{ position: 'absolute', inset: 0, zIndex: 1 }}
                    />
                    <div
                      className="card-horizontal-media"
                      style={{
                        width: '78px',
                        height: '102px',
                        flexShrink: 0,
                        borderRadius: '12px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="motion-reduce media--first"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </div>

                    <div className="card-horizontal-information" style={{ flex: 1, minWidth: 0 }}>
                      <div className="card-horizontal-information__top">
                        <h3 className="card-horizontal-title h5" style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                          {item.title}
                        </h3>

                        <div className="price price--on-sale" style={{ marginTop: '6px' }}>
                          <dl style={{ margin: 0 }}>
                            <div className="price__sale" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                              <span className="price-item price-item--sale" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                Rs. {item.price.toFixed(2)}
                              </span>
                              {item.compareAtPrice && (
                                <span className="price-item price-item--regular" style={{ fontSize: '0.85rem', color: '#888' }}>
                                  <s>Rs. {item.compareAtPrice.toFixed(2)}</s>
                                </span>
                              )}
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
