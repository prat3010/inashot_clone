'use client';

import React from 'react';

export default function BrandTrio() {
  return (
    <section
      id="shopify-section-template--29572451434860__image-with-text"
      className="shopify-section image-with-text-section spaced-section anim-active"
    >
      <div
        className="image-with-text image-with-text--border-top image-with-text--border-bottom color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d background section-template--29572451434860__image-with-text-padding"
        data-enable-header-animation="true"
        style={{
          ['--heading-delay' as string]: '0s',
          ['--description-delay' as string]: '0.3s',
        }}
      >
        <div className="container">
          <div className="image-with-text__titles titles titles--center">
            <h2 className="image-with-text__title title h2 size--h2">
              <span className="word" style={{ ['--word-index' as string]: 0 }}>
                In
              </span>{' '}
              <span className="word" style={{ ['--word-index' as string]: 1 }}>
                A
              </span>{' '}
              <span className="word" style={{ ['--word-index' as string]: 2 }}>
                Shot
              </span>
            </h2>
          </div>
          <div className="image-with-text__description description description--center">
            In A Shot was built with one simple belief — that healthy snacking shouldn&apos;t feel like a punishment.
          </div>

          <div className="content image-with-text__main image-with-text__main--align-image-left">
            <div
              className="image-with-text__img-wrapper"
              style={{ aspectRatio: '1.3392857142857142', position: 'relative' }}
            >
              <div className="image-with-text__rotating-text color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d">
                <svg viewBox="0 0 132 132">
                  <defs>
                    <path
                      id="circlePath"
                      d="
                        M 66,66
                        m -38, 0
                        a 38,38 0 1,1 76,0
                        a 38,38 0 1,1 -76,0"
                      transform="rotate(180,66,66)"
                    ></path>
                  </defs>
                  <text>
                    <textPath xlinkHref="#circlePath" textLength="200">
                      10G PROTEIN PACK
                    </textPath>
                  </text>
                </svg>
              </div>

              <img
                src="/scraped/images/Give_4_3_version_2K_202606161916.jpg"
                alt="In A Shot Protein Pack"
                width={2400}
                height={1792}
                loading="lazy"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>

            <div className="image-with-text__content image-with-text__content--align-left image-with-text__content--vertical-align-center">
              <div className="image-with-text__items image-with-text__items--medium">
                <div className="image-with-text__item">
                  <h3 className="image-with-text__inner-heading h3">
                    High Plant <br />
                    Protein
                  </h3>
                  <div className="image-with-text__inner-text">
                    Fuel your day with clean, plant-powered protein in every single handful.
                  </div>
                </div>

                <div className="image-with-text__item">
                  <h3 className="image-with-text__inner-heading h3">
                    High <br />
                    Fiber
                  </h3>
                  <div className="image-with-text__inner-text">
                    Loaded with natural fiber for better digestion and long-lasting fullness.
                  </div>
                </div>

                <div className="image-with-text__item">
                  <h3 className="image-with-text__inner-heading h3">
                    Light &amp; <br />
                    Crunchy
                  </h3>
                  <div className="image-with-text__inner-text">
                    Perfectly roasted for a satisfying crunch without feeling heavy or greasy.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
