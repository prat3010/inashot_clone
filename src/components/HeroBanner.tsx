'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Slide {
  id: number;
  desktopSrc: string;
  mobileSrc: string;
  ctaLink: string;
  ctaText: string;
  alt: string;
}

const slides: Slide[] = [
  {
    id: 1,
    desktopSrc: '/scraped/images/Artboard_3.png',
    mobileSrc: '/scraped/images/ALL_Products_Mobile_1.png',
    ctaLink: '/collections/all',
    ctaText: 'Shop Now',
    alt: 'IN\'A Shot - All Products',
  },
  {
    id: 2,
    desktopSrc: '/scraped/images/Artboard_1.png',
    mobileSrc: '/scraped/images/LIFESTYLE_1_MOBILE_1.png',
    ctaLink: '/collections/all',
    ctaText: 'Shop Now',
    alt: 'IN\'A Shot - Functional Snacking',
  },
  {
    id: 3,
    desktopSrc: '/scraped/images/IAS_LIFESTYLE_3_1ae956ce-324e-485e-af88-50641e77e5d5.png',
    mobileSrc: '/scraped/images/Mobile_Banner_3_bc3567a3-298b-4771-bc79-6df5e113fae4.png',
    ctaLink: '/products/roasted-salted-seed-mix',
    ctaText: 'Shop Now',
    alt: 'IN\'A Shot - Roasted Salted Seed Mix',
  },
  {
    id: 4,
    desktopSrc: '/scraped/images/IAS_LIFESTYLE_4_05f03d26-5b36-4cd7-b5be-7f8b2fcc4b98.png',
    mobileSrc: '/scraped/images/Mobile_Banner4_829ecadf-29ea-46e3-8c8c-0e0c146662ba.png',
    ctaLink: '/products/peri-peri-roasted-edamame',
    ctaText: 'Shop Now',
    alt: 'IN\'A Shot - Peri Peri Roasted Edamame',
  },
  {
    id: 5,
    desktopSrc: '/scraped/images/LifestyleBanner_1_d04108d7-04df-45dc-8d00-63300205f49c.png',
    mobileSrc: '/scraped/images/Mobile_Banner_ff359890-8c93-4761-8d40-c819edd0b791.png',
    ctaLink: '/products/chilli-cheese-crunchy-edamame',
    ctaText: 'Shop Now',
    alt: 'IN\'A Shot - Chilli Cheese Crunchy Edamame',
  },
  {
    id: 6,
    desktopSrc: '/scraped/images/IAS_SEED_BANNER_2_1.png',
    mobileSrc: '/scraped/images/IAS_SEED_BANNER_2_Mobile_bc1acd31-274c-4a38-b364-ed60acf83b16.png',
    ctaLink: '/products/nimbu-pudina-seed-mix',
    ctaText: 'Shop Now',
    alt: 'IN\'A Shot - Nimbu Pudina Seed Mix',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = slides.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total]);

  return (
    <section
      id="shopify-section-template--29572451434860__banner_carousel_eAT77X"
      className="shopify-section section-banner-carousel"
    >
      <section
        className="banner-carousel"
        data-banner-carousel=""
        data-autoplay="true"
        data-interval="5000"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="banner-carousel__track">
          {slides.map((slide, idx) => {
            const isActive = idx === current;
            return (
              <div
                key={slide.id}
                className={`banner-carousel__slide ${isActive ? 'is-active' : ''}`}
                data-slide=""
                style={{
                  transform: isActive ? 'translateX(0px)' : 'translateX(100%)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 800ms cubic-bezier(0.4, 0, 0.2, 1), opacity 800ms ease',
                }}
              >
                <picture>
                  <source media="(max-width: 749px)" srcSet={slide.mobileSrc} />
                  <img
                    src={slide.desktopSrc}
                    alt={slide.alt}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </picture>
                <Link className="banner-carousel__cta" href={slide.ctaLink}>
                  {slide.ctaText}
                </Link>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="banner-carousel__arrow banner-carousel__arrow--prev"
          data-prev=""
          aria-label="Previous"
          onClick={prevSlide}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M15 18l-6-6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className="banner-carousel__arrow banner-carousel__arrow--next"
          data-next=""
          aria-label="Next"
          onClick={nextSlide}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M9 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </section>
    </section>
  );
}
