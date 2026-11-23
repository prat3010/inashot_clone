'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !isAgreed) return;
    setIsSubscribed(true);
  };

  return (
    <div
      id="shopify-section-sections--29572445634924__footer"
      className="shopify-section shopify-section-group-footer-group"
    >
      <footer className="footer color-scheme-532186f7-5400-4da8-867a-7eceb69be8ce background">
        {/* Top Container: Newsletter */}
        <div className="footer-top-container">
          <div className="container">
            <div className="footer-top" style={{ ['--footer-logo-width' as string]: '420px' }}>
              <Link href="/" className="footer-logo focus-inset">
                <span className="footer-logo__text h3">IN&apos;A Shot</span>
              </Link>

              <div className="footer-subscribe-form-container">
                <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
                  <div className="footer-subscribe-form__text body-normal">
                    New flavours. Exclusive drops. Early access. Don&apos;t miss out.
                  </div>

                  {isSubscribed ? (
                    <div style={{ padding: '12px 0', color: '#2b8a3e', fontWeight: 700 }}>
                      ✓ Thank you for subscribing! Welcome to IN&apos;A Shot.
                    </div>
                  ) : (
                    <div className="footer-subscribe-form__main">
                      <div className="footer-subscribe-form__inner">
                        <div className="footer-subscribe-form__input-wrapper">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="footer-subscribe-form__input"
                            placeholder="Email Address"
                            required
                          />
                        </div>
                        <button type="submit" className="button button--primary">
                          <div className="button__content">
                            <span className="button__label" data-label="Sign Up">
                              Sign Up
                            </span>
                          </div>
                          <span className="animated-button-circle"></span>
                        </button>
                      </div>

                      <div className="footer-subscribe-form-checkbox" style={{ paddingLeft: '0px', marginTop: '8px' }}>
                        <label
                          className="footer-subscribe-form-checkbox__label"
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                        >
                          <input
                            type="checkbox"
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                            required
                          />
                          <p className="footer-subscribe-form-checkbox__label-text body-xs" style={{ margin: 0, color: '#aaa' }}>
                            I agree to the Privacy Policy and Terms of Use.
                          </p>
                        </label>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Main Container: 4 Column Blocks */}
        <div className="footer-main-container">
          <div className="container">
            <div className="footer-main">
              <div className="footer-blocks footer-blocks--4">
                {/* 1. Contact */}
                <div className="footer-block footer-info-block first">
                  <h3 className="footer-info-block__heading h6">Contact</h3>
                  <div className="footer-info-block__description body-small rte">
                    <p>Email - cheers@inashot.life</p>
                    <p>
                      Address - M/S IN&apos;A SHOT, Flat No- 201, Sarika Apartment, Priyadarshi
                      Nagar, Rupaspur, Patna, Bihar - 800014
                    </p>
                  </div>
                  <ul className="footer-socials-list list-social list-unstyled" role="list">
                    <li className="footer-socials-list__item list-social__item">
                      <a
                        href="https://www.instagram.com/inashot.life"
                        target="_blank"
                        rel="noreferrer"
                        className="link link--text list-social__link"
                        aria-label="Instagram"
                      >
                        <svg
                          className="icon icon-instagram"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.54902 1.7243C5.66235 1.76613 5.05685 1.90763 4.52752 2.11563C3.97968 2.32913 3.51535 2.61563 3.05334 3.0793C2.59134 3.54297 2.30684 4.00764 2.09484 4.55631C1.88967 5.08681 1.75067 5.69281 1.71151 6.57998C1.67234 7.46715 1.66367 7.75232 1.66801 10.0153C1.67234 12.2783 1.68234 12.562 1.72534 13.451C1.76767 14.3375 1.90867 14.9428 2.11667 15.4723C2.33051 16.0202 2.61668 16.4843 3.08051 16.9465C3.54435 17.4087 4.00868 17.6925 4.55868 17.9049C5.08868 18.1097 5.69485 18.2494 6.58186 18.2882C7.46886 18.327 7.75436 18.336 10.0167 18.3317C12.279 18.3274 12.5639 18.3174 13.4527 18.2752C14.3415 18.233 14.9437 18.091 15.4734 17.884C16.0212 17.6697 16.4857 17.384 16.9476 16.92C17.4094 16.456 17.6937 15.991 17.9056 15.442C18.1109 14.912 18.2504 14.3058 18.2889 13.4195C18.3277 12.53 18.3369 12.246 18.3326 9.98333C18.3282 7.72065 18.3181 7.43698 18.2759 6.54831C18.2337 5.65964 18.0926 5.05614 17.8847 4.52631C17.6706 3.97847 17.3847 3.51464 16.9211 3.05214C16.4574 2.58963 15.9921 2.30547 15.4432 2.09413C14.9129 1.88896 14.307 1.74913 13.42 1.7108C12.533 1.67246 12.2475 1.66263 9.98437 1.66696C7.72119 1.6713 7.43786 1.68096 6.54902 1.7243Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* 2. Products */}
                <div className="footer-block second">
                  <h3 className="footer-info-block__heading h6">Products</h3>
                  <ul className="footer-block__details-content list-unstyled" role="list">
                    <li>
                      <Link href="/collections/combos" className="link link--text">
                        Combos
                      </Link>
                    </li>
                    <li>
                      <Link href="/collections/nuts" className="link link--text">
                        Roasted Edamame
                      </Link>
                    </li>
                    <li>
                      <Link href="/collections/crunchy-edamame" className="link link--text">
                        Crunchy Edamame
                      </Link>
                    </li>
                    <li>
                      <Link href="/collections/edamame" className="link link--text">
                        Seed Mix
                      </Link>
                    </li>
                    <li>
                      <Link href="/collections/all" className="link link--text">
                        All Products
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* 3. Customer Service */}
                <div className="footer-block third">
                  <h3 className="footer-info-block__heading h6">Customer Service</h3>
                  <ul className="footer-block__details-content list-unstyled" role="list">
                    <li>
                      <Link href="/my-orders" className="link link--text">
                        Track Order
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/contact" className="link link--text">
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/faq" className="link link--text">
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link href="/policies/shipping-policy" className="link link--text">
                        Shipping Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/policies/refund-policy" className="link link--text">
                        Refund Policy
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* 4. Information */}
                <div className="footer-block fourth">
                  <h3 className="footer-info-block__heading h6">Information</h3>
                  <ul className="footer-block__details-content list-unstyled" role="list">
                    <li>
                      <Link href="/pages/about-us" className="link link--text">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/blogs" className="link link--text">
                        Blogs &amp; Science
                      </Link>
                    </li>
                    <li>
                      <Link href="/policies/privacy-policy" className="link link--text">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/policies/terms-of-service" className="link link--text">
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Container: Copyright */}
        <div className="footer-bottom-container" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '24px 0' }}>
          <div className="container">
            <div
              className="footer-bottom"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#888', fontSize: '0.8rem' }}
            >
              <div>
                © {new Date().getFullYear()}, IN&apos;A Shot. All rights reserved.
              </div>
              <div>
                Made with clean label passion.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
