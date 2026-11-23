'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard, { ProductCardData } from './ProductCard';
import LifestyleImageCarousel from './LifestyleImageCarousel';
import SocialMediaFollow from './SocialMediaFollow';

interface CollectionBrowserProps {
  collectionTitle: string;
  collectionDescription?: string | null;
  activeHandle: string;
  products: ProductCardData[];
}

export default function CollectionBrowser({
  collectionTitle,
  collectionDescription,
  activeHandle,
  products,
}: CollectionBrowserProps) {
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  const navTabs = [
    {
      label: 'All Products',
      handle: 'all',
      image: '/scraped/images/WhatsApp_Image_2026-11-12_at_17.46.43_1.jpg',
    },
    {
      label: 'Combos',
      handle: 'combos',
      image: '/scraped/images/WhatsApp_Image_2026-11-12_at_17.46.44.jpg',
    },
    {
      label: 'Roasted Edamame',
      handle: 'nuts',
      image: '/scraped/images/WhatsApp_Image_2026-11-12_at_7.13.21_PM_2.png',
    },
    {
      label: 'Crunchy Edamame',
      handle: 'crunchy-edamame',
      image: '/scraped/images/WhatsApp_Image_2026-11-12_at_17.46.45.jpg',
    },
    {
      label: 'Seed Mix',
      handle: 'edamame',
      image: '/scraped/images/Blank_White_Snack_Packet_Mockup_1.png',
    },
  ];

  let filtered = [...products];
  if (stockFilter === 'in_stock') {
    filtered = filtered.filter((p) => p.inStock);
  } else if (stockFilter === 'out_of_stock') {
    filtered = filtered.filter((p) => !p.inStock);
  }

  return (
    <>
      {/* 1. Collection Banner with Circular Tabs */}
      <div
        id="shopify-section-template--29572451139948__banner"
        className="shopify-section collection-banner-section"
      >
        <div className="collection-hero">
          <div className="container">
            <div className="collection-hero__wrapper" style={{ ['--padding-bottom' as string]: '0%' }}>
              <div className="collection-hero__text-wrapper">
                <div className="page-header">
                  <div className="page-header__inner">
                    <h1 className="collection-hero__title title--page h2">
                      <span className="visually-hidden">Collection: </span>
                      {collectionTitle}
                    </h1>
                  </div>
                </div>

                <div className="collection-hero__featured-collections collection-hero__featured-collections--with-images">
                  {navTabs.map((tab) => {
                    const isActive =
                      activeHandle === tab.handle ||
                      (activeHandle === 'roasted-edamame' && tab.handle === 'nuts') ||
                      (activeHandle === 'seed-mix' && tab.handle === 'edamame');
                    return (
                      <Link
                        key={tab.handle}
                        className={`collection-hero-featured-collection collection-hero-featured-collection--with-image ${
                          isActive ? 'collection-hero-featured-collection--active' : ''
                        }`}
                        href={`/collections/${tab.handle}`}
                        aria-label={tab.label}
                      >
                        <div className="collection-hero-featured-collection__image-wrapper">
                          <img
                            src={tab.image}
                            alt={tab.label}
                            width={1600}
                            height={1600}
                            className="collection-hero-featured-collection__image"
                          />
                        </div>
                        <span className="collection-hero-featured-collection__title body-xs">
                          {tab.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Collection Product Grid */}
      <section
        id="shopify-section-template--29572451139948__product-grid"
        className="shopify-section collection-grid-section"
      >
        <div className="main-collection-product-grid section-template--29572451139948__product-grid-padding">
          <div className="container">
            {/* Filter bar */}
            <div className="collection-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setStockFilter('all')}
                  className={`button button--secondary ${stockFilter === 'all' ? 'button--primary' : ''}`}
                  style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}
                >
                  All ({products.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStockFilter('in_stock')}
                  className={`button button--secondary ${stockFilter === 'in_stock' ? 'button--primary' : ''}`}
                  style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}
                >
                  In Stock ({products.filter((p) => p.inStock).length})
                </button>
              </div>
              <div className="product-count body-small" style={{ color: '#777' }}>
                {filtered.length} products
              </div>
            </div>

            <div
              className="collection product-grid"
              id="product-grid"
              data-id="template--29572451139948__product-grid"
            >
              <div className="popular-products-list popular-products-desktop-grid popular-products-desktop-grid--3 popular-products-mobile-column">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    className="popular-products-item collection-product-card"
                  >
                    <ProductCard product={product} columns={3} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Lifestyle Image Carousel & Social Media Follow */}
      <LifestyleImageCarousel />
      <SocialMediaFollow />
    </>
  );
}
