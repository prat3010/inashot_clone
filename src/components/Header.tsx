'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import SearchDrawer from './SearchDrawer';

export default function Header() {
  const { openCart, items } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopSubmenuOpen, setIsShopSubmenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const totalCartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 30);
      const diff = y - lastY;
      if (Math.abs(diff) > 5) {
        if (diff > 0 && y > 120) {
          document.body.classList.add('is-scrolling-down');
        } else if (diff < 0) {
          document.body.classList.remove('is-scrolling-down');
        }
        lastY = y;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div
        id="shopify-section-sections--29572445733228__header"
        className="shopify-section shopify-section-group-header-group shopify-section-header"
      >
        <sticky-header
          data-sticky-type="on-scroll-up"
          className={`header-wrapper header-wrapper--compact ${isScrolled ? 'shopify-section-header-sticky' : ''}`}
        >
          <header className="header header-compact header--left-logo header--has-menu header--overlay-mode container">
            <div className="header-compact__wrapper color-background-4">
              {/* Desktop/Mobile Burger Menu Trigger & Slideout */}
              <div className="burger-menu__container" style={{ ['--image-height' as string]: '400px' }}>
                <button
                  type="button"
                  className="burger-menu__button burger-menu__open button--unstyled focus-inset"
                  aria-label="Open desktop burger menu"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <svg
                    className="icon icon-hamburger"
                    width="22"
                    height="16"
                    viewBox="0 0 22 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 15C22 15.5523 21.5523 16 21 16H1C0.447716 16 0 15.5523 0 15C0 14.4477 0.447715 14 1 14H21C21.5523 14 22 14.4477 22 15ZM22 8C22 8.55229 21.5523 9 21 9H1C0.447716 9 0 8.55229 0 8C0 7.44772 0.447715 7 1 7H21C21.5523 7 22 7.44772 22 8ZM22 1C22 1.55228 21.5523 2 21 2H1C0.447716 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0H21C21.5523 0 22 0.447715 22 1Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                {/* Burger Menu Modal Overlay */}
                <div
                  className={`burger-menu color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d ${
                    isMenuOpen ? 'active' : ''
                  }`}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Burger menu"
                  style={{
                    display: isMenuOpen ? 'flex' : 'none',
                    opacity: isMenuOpen ? 1 : 0,
                    visibility: isMenuOpen ? 'visible' : 'hidden',
                    pointerEvents: isMenuOpen ? 'auto' : 'none',
                  }}
                >
                  <div className="burger-menu__wrapper">
                    <div className="burger-menu__top">
                      <button
                        type="button"
                        className="burger-menu__close button--unstyled focus-inset modal-close-button"
                        aria-label="Close desktop burger menu"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg
                          className="icon icon-close"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 4L4 20M20 20L4 4.00001"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="square"
                          />
                        </svg>
                      </button>

                      <Link
                        href="/"
                        className="header__heading-link focus-inset"
                        style={{ width: '56px' }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <img
                          src="/scraped/images/logo_in_a_shot_d764db0c-90a3-4ef9-af49-a3c5ef4b0dc2.png"
                          className="header__heading-logo"
                          width={56}
                          height={56}
                          alt="IN'A Shot"
                        />
                      </Link>

                      <div className="burger-menu__icons">
                        <div className="burger-menu__icons-wrapper">
                          <div className="header__cart header__cart--icon">
                            <button
                              type="button"
                              onClick={() => {
                                setIsMenuOpen(false);
                                openCart();
                              }}
                              className="header__icon header__icon--cart focus-inset button--unstyled"
                              aria-label="View Cart"
                            >
                              <svg
                                className="icon icon-cart"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M17.5383 11.0757C17.5383 4.22808 16.0783 0.921875 11.9999 0.921875C7.92148 0.921875 6.46143 4.22808 6.46143 11.0757"
                                  stroke="currentColor"
                                  strokeWidth="1.7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M22.5736 8.47656H1.42676L3.17533 21.3996H20.825L22.5736 8.47656Z"
                                  stroke="currentColor"
                                  strokeWidth="1.7"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="header__cart-text header__icon-text">
                                Cart ({totalCartCount})
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <nav className="burger-menu__menu">
                      <ul className="burger-menu__menu-list" role="list">
                        <li className="burger-menu__menu-list-item burger-menu__menu-list--submenu">
                          <div
                            className="burger-menu__menu-item h3 focus-inset"
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            onClick={() => setIsShopSubmenuOpen(!isShopSubmenuOpen)}
                          >
                            <span className="burger-menu__menu-item-title" title="Shop all">
                              <span>Shop all</span>
                            </span>
                            <svg
                              className="icon icon-arrow-down"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{
                                transform: isShopSubmenuOpen ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.2s ease',
                              }}
                            >
                              <path
                                d="M14 8L10 12L6 8"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>

                          {isShopSubmenuOpen && (
                            <ul className="burger-menu__submenu motion-reduce" role="list" style={{ display: 'block', paddingLeft: '1.5rem' }}>
                              <li className="header__submenu-li">
                                <Link
                                  href="/collections/combos"
                                  className="burger-menu__menu-item h4 list-menu__item focus-inset"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span className="burger-menu__menu-item-title">
                                    <span>Combos</span>
                                  </span>
                                </Link>
                              </li>
                              <li className="header__submenu-li">
                                <Link
                                  href="/collections/nuts"
                                  className="burger-menu__menu-item h4 list-menu__item focus-inset"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span className="burger-menu__menu-item-title">
                                    <span>Roasted Edamame</span>
                                  </span>
                                </Link>
                              </li>
                              <li className="header__submenu-li">
                                <Link
                                  href="/collections/crunchy-edamame"
                                  className="burger-menu__menu-item h4 list-menu__item focus-inset"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span className="burger-menu__menu-item-title">
                                    <span>Crunchy Edamame</span>
                                  </span>
                                </Link>
                              </li>
                              <li className="header__submenu-li">
                                <Link
                                  href="/collections/edamame"
                                  className="burger-menu__menu-item h4 list-menu__item focus-inset"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span className="burger-menu__menu-item-title">
                                    <span>Seed Mix</span>
                                  </span>
                                </Link>
                              </li>
                              <li className="header__submenu-li">
                                <Link
                                  href="/collections/all"
                                  className="burger-menu__menu-item h4 list-menu__item focus-inset"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span className="burger-menu__menu-item-title">
                                    <span>All</span>
                                  </span>
                                </Link>
                              </li>
                            </ul>
                          )}
                        </li>

                        <li className="burger-menu__menu-list-item">
                          <Link
                            href="/blogs"
                            className="burger-menu__menu-item h3 focus-inset"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="burger-menu__menu-item-title">
                              <span>Blogs</span>
                            </span>
                          </Link>
                        </li>

                        <li className="burger-menu__menu-list-item">
                          <Link
                            href="/pages/faq"
                            className="burger-menu__menu-item h3 focus-inset"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="burger-menu__menu-item-title">
                              <span>FAQ</span>
                            </span>
                          </Link>
                        </li>

                        <li className="burger-menu__menu-list-item">
                          <Link
                            href="/pages/contact"
                            className="burger-menu__menu-item h3 focus-inset"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="burger-menu__menu-item-title">
                              <span>Contact Us</span>
                            </span>
                          </Link>
                        </li>

                        <li className="burger-menu__menu-list-item">
                          <Link
                            href="/my-orders"
                            className="burger-menu__menu-item h3 focus-inset"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="burger-menu__menu-item-title">
                              <span>My Orders</span>
                            </span>
                          </Link>
                        </li>

                        <li className="burger-menu__menu-list-item">
                          <Link
                            href="/admin"
                            className="burger-menu__menu-item h3 focus-inset"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="burger-menu__menu-item-title">
                              <span>Admin</span>
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </nav>

                    <div className="burger-menu__bottom">
                      <div className="burger-menu__copyright burger-menu__copyright--desktop-show">
                        <small className="copyright__content">
                          © 2026, IN&apos;A Shot. All rights reserved.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Logo */}
              <h1 className="header__heading">
                <Link
                  href="/"
                  className="header__heading-link focus-inset"
                  style={{ width: '56px', display: 'inline-block' }}
                >
                  <img
                    src="/scraped/images/logo_in_a_shot_d764db0c-90a3-4ef9-af49-a3c5ef4b0dc2.png"
                    className="header__heading-logo"
                    width={56}
                    height={56}
                    alt="IN'A Shot"
                    loading="lazy"
                  />
                </Link>
              </h1>

              {/* Right Icons: Search & Cart */}
              <div className="burger-menu__icons">
                <div className="burger-menu__icons-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="header__icon header__icon--search focus-inset modal__toggle button--unstyled"
                    aria-label="Search"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <svg
                      className="icon icon-search"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.812 18.624C15.1265 18.624 18.624 15.1265 18.624 10.812C18.624 6.49756 15.1265 3 10.812 3C6.49756 3 3 6.49756 3 10.812C3 15.1265 6.49756 18.624 10.812 18.624Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.2559 16.7383L20.5151 21.006"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div className="header__cart header__cart--icon">
                    <button
                      type="button"
                      onClick={openCart}
                      className="header__icon header__icon--cart focus-inset button--unstyled"
                      aria-label="View Cart"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: 0 }}
                    >
                      <svg
                        className="icon icon-cart"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.5383 11.0757C17.5383 4.22808 16.0783 0.921875 11.9999 0.921875C7.92148 0.921875 6.46143 4.22808 6.46143 11.0757"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M22.5736 8.47656H1.42676L3.17533 21.3996H20.825L22.5736 8.47656Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="header__cart-text header__icon-text" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        Cart ({totalCartCount})
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </sticky-header>
      </div>

      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
