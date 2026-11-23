'use client';

import React from 'react';

interface SocialMediaFollowProps {
  sectionId?: string;
  paddingClass?: string;
}

export default function SocialMediaFollow({
  sectionId = 'shopify-section-template--29572451434860__social-media',
  paddingClass = 'section-template--29572451434860__social-media-padding',
}: SocialMediaFollowProps) {
  return (
    <section id={sectionId} className="shopify-section social-media-section spaced-section">
      <div
        className={`social-media social-media--border-top social-media--border-bottom color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d background ${paddingClass}`}
      >
        <div className="social-media-wrapper social-media-wrapper--socials-right">
          <div className="social-media__content social-media__content--socials-right">
            <ul className="social-media-image-wrapper social-media-image-wrapper--center" role="list">
              <li className="social-media-image">
                <a
                  href="https://www.instagram.com/inashot.life"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-media-image-link focus-visible button button--secondary button--social-media-icon color-background-4 background"
                  aria-label="Instagram"
                >
                  <div className="button__content">
                    <span className="button__label visually-hidden">Instagram</span>
                    <div className="button__icons">
                      <span className="button__icon button__icon--1">
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
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <span className="button__icon button__icon--2">
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
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className="animated-button-circle"></div>
                </a>
              </li>
              <li className="social-media-image">
                <a
                  href="https://www.facebook.com/inashot.life/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-media-image-link focus-visible button button--secondary button--social-media-icon color-background-4 background"
                  aria-label="Facebook"
                >
                  <div className="button__content">
                    <span className="button__label visually-hidden">Facebook</span>
                    <div className="button__icons">
                      <span className="button__icon button__icon--1">
                        <svg
                          className="icon icon-facebook"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.0083 7.57403C14.4385 7.1859 15.1043 7.2282 15.1531 7.23032L17.9392 7.22926L18 3.31516L17.5796 3.21469C17.3103 3.15019 16.4859 3 14.6687 3C11.433 3 9.2585 5.20506 9.2585 8.48566V9.36663H6V13.5969H9.2585V21H13.6032V13.5969H17.0376L17.635 9.36663H13.6032V8.71833C13.6032 8.20329 13.74 7.81728 14.0083 7.57403Z"
                          />
                        </svg>
                      </span>
                      <span className="button__icon button__icon--2">
                        <svg
                          className="icon icon-facebook"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.0083 7.57403C14.4385 7.1859 15.1043 7.2282 15.1531 7.23032L17.9392 7.22926L18 3.31516L17.5796 3.21469C17.3103 3.15019 16.4859 3 14.6687 3C11.433 3 9.2585 5.20506 9.2585 8.48566V9.36663H6V13.5969H9.2585V21H13.6032V13.5969H17.0376L17.635 9.36663H13.6032V8.71833C13.6032 8.20329 13.74 7.81728 14.0083 7.57403Z"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className="animated-button-circle"></div>
                </a>
              </li>
            </ul>

            <div className="social-media__main-text-wrapper social-media__main-text-wrapper--center">
              <p className="social-media__main-text social-media__main-text--font-heading h3 is-ready">
                Follow Us
                <span className="underline-wrapper">
                  <svg
                    className="underline-svg line"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 250.5625 6"
                    style={{ stroke: '#fedc2d' }}
                  >
                    <path
                      className="line-path"
                      strokeWidth="4"
                      strokeLinecap="round"
                      d="M2.185 3 C59.487 2, 116.627 1.5, 173.998 1.5 C197.686 1.5, 268.756 1.5, 245.066 1.5 C221.732 1.5, 198.397 1.5, 175.063 1.5 C145.17 1.5, 115.331 1.35, 85.504 2.95"
                    />
                  </svg>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
