'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export interface ProductItem {
  id: string;
  handle: string;
  title: string;
  category: string;
  price: number;
  compareAtPrice?: number | null;
  featuredImage: string;
  images: string[];
  badge?: string | null;
  inStock: boolean;
  grams?: number;
  description?: string;
  macros?: any;
  ingredients?: string | null;
}

export type ProductCardData = ProductItem;

interface ProductCardProps {
  product: ProductItem;
  columns?: number;
  onQuickView?: (product: ProductItem) => void;
}

export default function ProductCard({
  product,
  columns = 3,
  onQuickView,
}: ProductCardProps) {
  const { addItem, openQuickView } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    const packCount = product.category === 'roasted-edamame' ? 9 : 8;
    addItem({
      id: `${product.id}-${packCount}`,
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      tierTitle: `Pack of ${packCount}`,
      packCount,
      weightGrams: product.grams || 270,
      price: product.price,
      compareAtPrice: product.compareAtPrice || undefined,
      image: product.featuredImage,
    });
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      openQuickView({
        ...product,
        description: product.description || '',
        grams: product.grams || 270,
      });
    }
  };

  const secondaryImage =
    product.images && product.images.length > 1 ? product.images[1] : product.featuredImage;

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <product-card
      className="product-card card-wrapper js-color-swatches-wrapper color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d"
      data-product={product.handle}
      data-product-title={product.title}
      data-product-columns={String(columns)}
      data-product-img-ratio="1"
      data-product-img-fit="cover"
      style={{ display: 'block', width: '100%' }}
    >
      <div className="card card--hover-secondary_image" tabIndex={-1}>
        <div className="card__inner">
          <div className="card-media" style={{ paddingBottom: '100%', position: 'relative' }}>
            <img
              src={product.featuredImage}
              alt={product.title}
              width={2000}
              height={2000}
              loading="lazy"
              className="motion-reduce media--first"
              style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            />
            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={product.title}
                width={2000}
                height={2000}
                loading="lazy"
                className="motion-reduce media--second"
                style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 }}
              />
            )}
          </div>

          <div className="card__badges-wrapper">
            {discountPercent && (
              <span className="badge badge--sale body-small" aria-hidden="true">
                <span className="badge__discount-amount body-small">{discountPercent}%</span>
                <span className="badge__discount-label body-small"> Off!</span>
              </span>
            )}
            {product.badge && !product.badge.toLowerCase().includes('off') && (
              <div className="card__badges">
                <span className="badge badge--new body-small">{product.badge}</span>
              </div>
            )}
          </div>
        </div>

        <div className="card__links card__links--hover card__links--show-on-mobile">
          <product-form className="card__add-to-cart card__button">
            <button
              type="button"
              className="card__link button button--primary button--quick-add card-focused"
              name="add"
              aria-label={product.inStock ? 'Add to Cart' : 'Sold Out'}
              disabled={!product.inStock}
              onClick={handleAddToCart}
            >
              <div className="button__content">
                <span className="button__label">
                  {product.inStock ? 'Add to Cart' : 'Sold Out'}
                </span>
                <div className="button__icons">
                  <span className="button__icon button__icon--1">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18.2215 9.16602H3.77848M18.2215 9.16602C18.2794 9.16602 18.3227 9.21894 18.3114 9.27566L17.9667 10.9993M18.2215 9.16602H18.3333M3.77848 9.16602C3.72064 9.16602 3.67725 9.21894 3.6886 9.27566L5.20524 16.8589C5.37663 17.7158 6.12906 18.3327 7.00297 18.3327H11M3.77848 9.16602H3.66667M2.75 9.16602H3.66667M3.66667 9.16602L6.41667 3.66602M18.3333 9.16602H19.25M18.3333 9.16602L15.5833 3.66602M15.5833 12.8327V15.5827M15.5833 15.5827V18.3327M15.5833 15.5827H18.3333M15.5833 15.5827H12.8333"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <span className="button__icon button__icon--2">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18.2215 9.16602H3.77848M18.2215 9.16602C18.2794 9.16602 18.3227 9.21894 18.3114 9.27566L17.9667 10.9993M18.2215 9.16602H18.3333M3.77848 9.16602C3.72064 9.16602 3.67725 9.21894 3.6886 9.27566L5.20524 16.8589C5.37663 17.7158 6.12906 18.3327 7.00297 18.3327H11M3.77848 9.16602H3.66667M2.75 9.16602H3.66667M3.66667 9.16602L6.41667 3.66602M18.3333 9.16602H19.25M18.3333 9.16602L15.5833 3.66602M15.5833 12.8327V15.5827M15.5833 15.5827V18.3327M15.5833 15.5827H18.3333M15.5833 15.5827H12.8333"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="animated-button-circle"></div>
            </button>
          </product-form>

          <div className="quick-add no-js-hidden">
            <button
              type="button"
              className="card__link button button--secondary button--quick-view card-focused"
              aria-label="Quick View"
              title={`Quick View ${product.title}`}
              data-product={product.handle}
              onClick={handleQuickViewClick}
            >
              <div className="button__content">
                <span className="button__label visually-hidden">Quick View</span>
                <div className="button__icons">
                  <span className="button__icon button__icon--1">
                    <svg className="icon icon-quick-view" width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10.9996 0.293213C15.0145 0.293213 17.6363 2.19537 19.2301 4.08228C20.0218 5.01968 20.5625 5.9543 20.9058 6.65454C21.078 7.00558 21.2019 7.30053 21.2838 7.51099C21.3247 7.61629 21.3556 7.7009 21.3765 7.76099C21.387 7.79093 21.3952 7.81483 21.401 7.83228C21.4038 7.841 21.406 7.84832 21.4078 7.85376C21.4087 7.85642 21.4092 7.85875 21.4097 7.8606L21.4107 7.86353V7.8645L21.441 7.99438C21.4604 8.12546 21.449 8.26005 21.4068 8.38696L20.6002 8.11938L21.4068 8.38794L21.4058 8.38892L21.4049 8.39087C21.4043 8.39267 21.4038 8.39512 21.4029 8.39771C21.4011 8.40308 21.3991 8.41057 21.3961 8.41919C21.3901 8.43641 21.3816 8.45997 21.3707 8.4895C21.349 8.54853 21.3172 8.63137 21.275 8.73462C21.1904 8.94141 21.0624 9.23118 20.8863 9.57544C20.535 10.2621 19.9847 11.1771 19.1861 12.0911C17.5786 13.9308 14.9547 15.7702 10.9859 15.7053C7.03552 15.6407 4.42407 13.8118 2.81893 12.0071C2.02103 11.11 1.46979 10.219 1.11776 9.55103C0.941429 9.21641 0.813947 8.93541 0.729087 8.73462C0.686621 8.63414 0.655283 8.55287 0.633384 8.49536C0.622471 8.4667 0.613093 8.4438 0.607016 8.427C0.604017 8.41871 0.602026 8.41172 0.600181 8.40649C0.599255 8.40387 0.597889 8.40149 0.597251 8.39966V8.39771L0.596274 8.39673L1.39999 8.11938C0.655257 7.88617 0.594309 7.86646 0.589438 7.8645V7.86353L0.590415 7.8606C0.591002 7.85875 0.591512 7.85642 0.592368 7.85376C0.59412 7.84831 0.596315 7.84102 0.599204 7.83228C0.604969 7.81482 0.613175 7.79095 0.623618 7.76099C0.644565 7.7009 0.675418 7.61629 0.716391 7.51099C0.798276 7.30053 0.922221 7.00554 1.09432 6.65454C1.43768 5.95431 1.97836 5.01964 2.7701 4.08228C4.36385 2.19546 6.98498 0.293336 10.9996 0.293213ZM10.9996 1.99243C7.5997 1.99255 5.42127 3.57804 4.06893 5.17896C3.3877 5.9855 2.91868 6.7958 2.62069 7.40356C2.47884 7.69287 2.376 7.93369 2.30916 8.10376C2.37774 8.26387 2.48075 8.4888 2.62264 8.75806C2.92638 9.33444 3.40272 10.1051 4.08944 10.8772C5.45352 12.4108 7.64175 13.9509 11.0142 14.0061C14.3682 14.0608 16.5442 12.5313 17.9058 10.9729C18.5918 10.1878 19.0682 9.39613 19.3726 8.80103C19.5189 8.51516 19.6232 8.27662 19.692 8.10962C19.6252 7.93928 19.5228 7.69596 19.3795 7.40356C19.0815 6.7958 18.6125 5.9855 17.9312 5.17896C16.5788 3.57794 14.3998 1.99243 10.9996 1.99243Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="button__icon button__icon--2">
                    <svg className="icon icon-quick-view" width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10.9996 0.293213C15.0145 0.293213 17.6363 2.19537 19.2301 4.08228C20.0218 5.01968 20.5625 5.9543 20.9058 6.65454C21.078 7.00558 21.2019 7.30053 21.2838 7.51099C21.3247 7.61629 21.3556 7.7009 21.3765 7.76099C21.387 7.79093 21.3952 7.81483 21.401 7.83228C21.4038 7.841 21.406 7.84832 21.4078 7.85376C21.4087 7.85642 21.4092 7.85875 21.4097 7.8606L21.4107 7.86353V7.8645L21.441 7.99438C21.4604 8.12546 21.449 8.26005 21.4068 8.38696L20.6002 8.11938L21.4068 8.38794L21.4058 8.38892L21.4049 8.39087C21.4043 8.39267 21.4038 8.39512 21.4029 8.39771C21.4011 8.40308 21.3991 8.41057 21.3961 8.41919C21.3901 8.43641 21.3816 8.45997 21.3707 8.4895C21.349 8.54853 21.3172 8.63137 21.275 8.73462C21.1904 8.94141 21.0624 9.23118 20.8863 9.57544C20.535 10.2621 19.9847 11.1771 19.1861 12.0911C17.5786 13.9308 14.9547 15.7702 10.9859 15.7053C7.03552 15.6407 4.42407 13.8118 2.81893 12.0071C2.02103 11.11 1.46979 10.219 1.11776 9.55103C0.941429 9.21641 0.813947 8.93541 0.729087 8.73462C0.686621 8.63414 0.655283 8.55287 0.633384 8.49536C0.622471 8.4667 0.613093 8.4438 0.607016 8.427C0.604017 8.41871 0.602026 8.41172 0.600181 8.40649C0.599255 8.40387 0.597889 8.40149 0.597251 8.39966V8.39771L0.596274 8.39673L1.39999 8.11938C0.655257 7.88617 0.594309 7.86646 0.589438 7.8645V7.86353L0.590415 7.8606C0.591002 7.85875 0.591512 7.85642 0.592368 7.85376C0.59412 7.84831 0.596315 7.84102 0.599204 7.83228C0.604969 7.81482 0.613175 7.79095 0.623618 7.76099C0.644565 7.7009 0.675418 7.61629 0.716391 7.51099C0.798276 7.30053 0.922221 7.00554 1.09432 6.65454C1.43768 5.95431 1.97836 5.01964 2.7701 4.08228C4.36385 2.19546 6.98498 0.293336 10.9996 0.293213ZM10.9996 1.99243C7.5997 1.99255 5.42127 3.57804 4.06893 5.17896C3.3877 5.9855 2.91868 6.7958 2.62069 7.40356C2.47884 7.69287 2.376 7.93369 2.30916 8.10376C2.37774 8.26387 2.48075 8.4888 2.62264 8.75806C2.92638 9.33444 3.40272 10.1051 4.08944 10.8772C5.45352 12.4108 7.64175 13.9509 11.0142 14.0061C14.3682 14.0608 16.5442 12.5313 17.9058 10.9729C18.5918 10.1878 19.0682 9.39613 19.3726 8.80103C19.5189 8.51516 19.6232 8.27662 19.692 8.10962C19.6252 7.93928 19.5228 7.69596 19.3795 7.40356C19.0815 6.7958 18.6125 5.9855 17.9312 5.17896C16.5788 3.57794 14.3998 1.99243 10.9996 1.99243Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="animated-button-circle"></div>
            </button>
          </div>
        </div>

        <Link
          href={`/products/${product.handle}`}
          className="link card-link-overlay"
          aria-label={product.title}
        />
      </div>

      <div className="card-information">
        <div className="card-information__wrapper">
          <div className="card-information__group">
            <div className="card__title-price-wrapper">
              <h3 className="card__title">
                <Link className="full-unstyled-link" href={`/products/${product.handle}`}>
                  {product.title}
                </Link>
              </h3>

              <div className="price price--on-sale">
                <dl style={{ margin: 0 }}>
                  <div className="price__sale" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px' }}>
                    <span className="price-item price-item--sale" dir="ltr">
                      Rs. {product.price.toFixed(2)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="price-item price-item--regular" dir="ltr" style={{ color: '#888' }}>
                        <s>Rs. {product.compareAtPrice.toFixed(2)}</s>
                      </span>
                    )}
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </product-card>
  );
}
