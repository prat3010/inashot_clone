'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard, { ProductItem } from './ProductCard';

interface ProductGridProps {
  products: ProductItem[];
  title?: string;
  sectionId?: string;
  paddingClass?: string;
  columns?: number;
  viewAllLink?: string;
}

export default function ProductGrid({
  products,
  title = 'Assorted Combos',
  sectionId = 'shopify-section-template--29572451434860__popular-products',
  paddingClass = 'section-template--29572451434860__popular-products-padding',
  columns = 3,
  viewAllLink = '/collections/all',
}: ProductGridProps) {
  const words = title.split(' ');

  return (
    <section
      id={sectionId}
      className="shopify-section popular-products-section anim-active"
    >
      <div
        className={`popular-products popular-products--desktop-layout-slider popular-products--mobile-layout-slider color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d background ${paddingClass}`}
        data-layout="slider"
        data-layout-mobile="slider"
        data-enable-header-animation="true"
        style={{
          ['--heading-delay' as string]: '0s',
          ['--description-delay' as string]: '0.2s',
          ['--button-delay' as string]: '0.3s',
        }}
      >
        <div className="popular-products-top popular-products-top--align-left container">
          <div className="popular-products-top__heading-group">
            <div className="popular-products__titles titles titles--left">
              <h2 className="popular-products__title title h3 size--h3">
                {words.map((word, idx) => (
                  <span
                    key={idx}
                    className="word"
                    style={{ ['--word-index' as string]: idx }}
                  >
                    {word}{' '}
                  </span>
                ))}
              </h2>
            </div>
          </div>

          <Link
            href={viewAllLink}
            aria-label="View all"
            className="button button--primary popular-products-button heading-group-button"
          >
            <div className="button__content">
              <span className="button__label" data-label="View all">
                View all
              </span>
            </div>
            <span className="animated-button-circle"></span>
          </Link>
        </div>

        <div className="popular-products-main container content">
          <div className="popular-products-layout" data-columns={columns}>
            <div
              className={`popular-products-list popular-products-desktop-grid popular-products-desktop-grid--${columns} popular-products-mobile-column`}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="popular-products-item collection-product-card"
                >
                  <ProductCard product={product} columns={columns} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
