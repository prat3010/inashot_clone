'use client';

import React from 'react';

const tickerItems = [
  'No Hidden Ingredient',
  'No Added Sugar',
  'All Natural Ingredients',
  'No Artificial Preservative',
  'No Artificial Sweetners',
  'No Artificial Flavours',
];

export default function CleanLabelMarquee() {
  return (
    <section
      id="shopify-section-template--29572451434860__ticker-banner"
      className="shopify-section ticker-banner-section"
    >
      <div
        className="ticker-banner ticker-banner--border-top ticker-banner--border-bottom"
        id="ticker-banner-template--29572451434860__ticker-banner"
      >
        <div className="ticker-banner__container color-background-4 content">
          <div className="ticker-banner__main">
            <div
              className="ticker-banner__ticker"
              style={{ ['--ticker-banner-ticker-speed' as string]: '35s' }}
            >
              <div className="ticker-banner__ticker-wrapper">
                {/* Collection 1 */}
                <span className="ticker-banner__ticker-collection ticker-banner__ticker-collection--1">
                  {tickerItems.map((text, idx) => (
                    <span key={`t1-${idx}`} className="ticker-banner__ticker-item h4">
                      <span className="ticker-banner__ticker-text">{text}</span>
                    </span>
                  ))}
                </span>

                {/* Collection 2 for seamless infinite marquee loop */}
                <span className="ticker-banner__ticker-collection ticker-banner__ticker-collection--2">
                  {tickerItems.map((text, idx) => (
                    <span key={`t2-${idx}`} className="ticker-banner__ticker-item h4">
                      <span className="ticker-banner__ticker-text">{text}</span>
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
