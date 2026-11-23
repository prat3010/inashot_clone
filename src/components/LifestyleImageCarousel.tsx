'use client';

import React from 'react';

interface LifestyleImageCarouselProps {
  sectionId?: string;
  paddingClass?: string;
}

const carouselImages = [
  { id: '1', src: '/scraped/images/IN_A_Shot_Hero_Image_1.jpg' },
  { id: '2', src: '/scraped/images/IN_A_Shot_Hero_Image_2.jpg' },
  { id: '3', src: '/scraped/images/IN_A_Shot_Hero_Image_3.jpg' },
  { id: '4', src: '/scraped/images/IN_A_Shot_Hero_Image_4.jpg' },
  { id: '5', src: '/scraped/images/IN_A_Shot_Hero_Image_5_b906f8fd-13d5-4a35-88c0-dae31c64920b.jpg' },
  { id: '6', src: '/scraped/images/IN_A_Shot_Hero_Image_6.jpg' },
  { id: '7', src: '/scraped/images/IN_A_Shot_Hero_Image_7_b99654fb-89e1-4f18-b785-8f741af549b9.png' },
  { id: '8', src: '/scraped/images/IN_A_Shot_Hero_Image_8.jpg' },
];

export default function LifestyleImageCarousel({
  sectionId = 'shopify-section-template--29572451434860__image_carousel_nck4K3',
  paddingClass = 'section-template--29572451434860__image_carousel_nck4K3-padding',
}: LifestyleImageCarouselProps) {
  return (
    <section id={sectionId} className="shopify-section image-carousel-section spaced-section">
      <div className={`image-carousel color-background-3 background ${paddingClass}`}>
        <div className="image-carousel__wrapper content">
          <div
            className="image-carousel__ticker"
            style={{
              ['--carousel-speed' as string]: '80s',
              ['--image-width' as string]: '216.0px',
            }}
          >
            <div className="image-carousel__ticker-wrapper">
              {/* Collection 1 */}
              <span className="image-carousel__ticker-collection image-carousel__ticker-collection--1">
                {carouselImages.map((img, i) => (
                  <span
                    key={`c1-${img.id}-${i}`}
                    className="image-carousel__slide"
                    style={{
                      width: '216px',
                      height: '288px',
                      display: 'inline-block',
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img.src}
                      alt="In A Shot Lifestyle"
                      loading="eager"
                      className="image-carousel__slide-image"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <span className="image-carousel__slide-overlay" style={{ opacity: 0 }} />
                  </span>
                ))}
              </span>

              {/* Collection 2 for infinite ticker loop */}
              <span className="image-carousel__ticker-collection image-carousel__ticker-collection--2">
                {carouselImages.map((img, i) => (
                  <span
                    key={`c2-${img.id}-${i}`}
                    className="image-carousel__slide"
                    style={{
                      width: '216px',
                      height: '288px',
                      display: 'inline-block',
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img.src}
                      alt="In A Shot Lifestyle"
                      loading="eager"
                      className="image-carousel__slide-image"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <span className="image-carousel__slide-overlay" style={{ opacity: 0 }} />
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
