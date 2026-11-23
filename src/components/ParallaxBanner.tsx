'use client';

import React from 'react';
import Link from 'next/link';

export default function ParallaxBanner() {
  return (
    <section
      id="shopify-section-template--29572451434860__image-parallax-with-text"
      className="shopify-section section-image-parallax-with-text overlay-section anim-active"
    >
      <div className="image-parallax-with-text-container color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d background">
        <div className="image-parallax-with-text section-template--29572451434860__image-parallax-with-text-padding">
          <div className="container image-parallax-with-text__container">
            <div className="image-parallax-with-text__subheading-wrapper image-parallax-with-text__subheading-wrapper--animation-container image-parallax-with-text__subheading-wrapper--line-type-1">
              <p className="image-parallax-with-text__subheading body-xl">
                <span className="image-parallax-with-text__text-wrapper">
                  Healthy but with a little drama
                  <svg viewBox="0 0 226 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1.5 1.5C20.6941 1.5 28.3857 1.5431 41.7047 2.08333C83.1976 3.76631 124.846 3 166.371 3C184.854 3 203.259 1.5 221.71 1.5C235.545 1.5 194.139 3.75793 180.311 4.125C140.815 5.1734 101.351 6.52635 61.8664 7.83333C47.1491 8.32049 32.4254 8.56301 17.7071 9C16.2597 9.04297 13.7349 9.04813 12.0468 9.375C11.703 9.44156 12.7258 9.61324 13.0759 9.58333C34.3315 7.76788 56.1609 9.08245 77.4438 9.375C104.439 9.74607 131.515 9.1283 158.465 10.5"
                      stroke="#fedc2d"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="image-parallax-with-text__line image-parallax-with-text__line--animation"
                    />
                  </svg>
                </span>
              </p>
            </div>

            <h2
              id="main-text-template--29572451434860__image-parallax-with-text"
              className="image-parallax-with-text__main-text h1 animated-text"
            >
              <span className="word" style={{ ['--word-index' as string]: 0 }}>PACKED</span>{' '}
              <span className="word" style={{ ['--word-index' as string]: 1 }}>TO</span>{' '}
              <span className="word" style={{ ['--word-index' as string]: 2 }}>POWER</span>{' '}
              <span className="word" style={{ ['--word-index' as string]: 3 }}>EVERY</span>{' '}
              <span className="word" style={{ ['--word-index' as string]: 4 }}>BITE</span>
            </h2>

            <p className="image-parallax-with-text__description body-normal">
              Bold, crunchy, and perfectly seasoned for any moment — a wholesome seed mix made to fuel, nourish, and keep you going with every handful.
            </p>

            <div className="image-parallax-with-text__button-wrapper">
              <Link
                href="/collections/all"
                aria-label="Shop Now"
                className="button button--primary image-parallax-with-text__button"
              >
                <div className="button__content">
                  <span className="button__label" data-label="Shop Now">
                    Shop Now
                  </span>
                </div>
                <span className="animated-button-circle"></span>
              </Link>
            </div>
          </div>

          {/* Floating Element 1 */}
          <div
            className="image-parallax image-parallax-with-text__image-wrapper image-parallax-with-text__image-wrapper--landscape image-parallax-with-text__image-wrapper--elem-1 position-9-24"
            style={{ position: 'absolute', left: '9%', top: '24%', visibility: 'visible' }}
          >
            <div className="image-parallax-with-text__image-inner-wrapper image-parallax-with-text__image-inner-wrapper--rounded" style={{ width: '140px' }}>
              <img
                src="/scraped/images/Flavour_03734dab-f706-471e-aac0-221fd71e8788.png"
                alt=""
                width={140}
                height={140}
                loading="lazy"
                className="image-parallax-with-text__image"
              />
            </div>
          </div>

          {/* Floating Element 2 */}
          <div
            className="image-parallax image-parallax-with-text__image-wrapper image-parallax-with-text__image-wrapper--landscape image-parallax-with-text__image-wrapper--elem-2 position-11-85"
            style={{ position: 'absolute', left: '11%', top: '80%', visibility: 'visible' }}
          >
            <div className="image-parallax-with-text__image-inner-wrapper image-parallax-with-text__image-inner-wrapper--rounded" style={{ width: '144px' }}>
              <img
                src="/scraped/images/Do_good.png"
                alt=""
                width={144}
                height={99}
                loading="lazy"
                className="image-parallax-with-text__image"
              />
            </div>
          </div>

          {/* Floating Element 3 */}
          <div
            className="image-parallax image-parallax-with-text__image-wrapper image-parallax-with-text__image-wrapper--square image-parallax-with-text__image-wrapper--elem-3 position-84-20"
            style={{ position: 'absolute', right: '10%', top: '20%', visibility: 'visible' }}
          >
            <div className="image-parallax-with-text__image-inner-wrapper image-parallax-with-text__image-inner-wrapper--rounded" style={{ width: '88px' }}>
              <img
                src="/scraped/images/Container_5af0ab34-2ea5-46ac-93a6-d42d7ac3dc2e.png"
                alt=""
                width={88}
                height={88}
                loading="lazy"
                className="image-parallax-with-text__image"
              />
            </div>
          </div>

          {/* Floating Element 4 */}
          <div
            className="image-parallax image-parallax-with-text__image-wrapper image-parallax-with-text__image-wrapper--square image-parallax-with-text__image-wrapper--elem-4 position-83-85"
            style={{ position: 'absolute', right: '11%', top: '80%', visibility: 'visible' }}
          >
            <div className="image-parallax-with-text__image-inner-wrapper image-parallax-with-text__image-inner-wrapper--rounded" style={{ width: '144px' }}>
              <img
                src="/scraped/images/Seed_mix_product_photography_fe0ea025_2K_2.jpg"
                alt=""
                width={144}
                height={144}
                loading="lazy"
                className="image-parallax-with-text__image"
                style={{ borderRadius: '16px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
