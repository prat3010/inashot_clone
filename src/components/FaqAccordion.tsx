'use client';

import React, { useState } from 'react';

export interface FaqItem {
  id: string;
  category?: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
  title?: string;
}

export default function FaqAccordion({
  faqs,
  title = 'Frequently Asked Questions',
}: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const words = title.split(' ');

  return (
    <section
      id="shopify-section-template--29572451565932__collapsible_content_LzK6iw"
      className="shopify-section collapsible-content-section spaced-section anim-active"
    >
      <div
        className="collapsible-content color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d background section-template--29572451565932__collapsible_content_LzK6iw-padding"
        data-enable-header-animation="true"
        style={{
          ['--heading-delay' as string]: '0s',
          ['--description-delay' as string]: '0.3s',
        }}
      >
        <div className="container">
          <div className="collapsible-content__header collapsible-content__header--center">
            <h3 className="collapsible-content__heading h3">
              {words.map((w, idx) => (
                <span
                  key={idx}
                  className="word"
                  style={{ ['--word-index' as string]: idx }}
                >
                  {w}{' '}
                </span>
              ))}
            </h3>
          </div>

          <div className="collapsible-content__content content collapsible-content__content--center">
            <div className="collapsible-content__items">
              {faqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`collapsible-content__item ${isOpen ? 'active' : ''}`}
                  >
                    <button
                      type="button"
                      className="collapsible-content__toggle button--unstyled focus-inset"
                      onClick={() => toggle(faq.id)}
                    >
                      <div className="collapsible-content__toggle-group">
                        <p className="collapsible-content__question h5">
                          {faq.question}
                        </p>
                      </div>
                      <div className="collapsible-content__icon"></div>
                    </button>
                    <div
                      className="collapsible-content__answer-wrapper"
                      style={{ display: isOpen ? 'block' : 'none' }}
                    >
                      <div className="collapsible-content__answer rte">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
