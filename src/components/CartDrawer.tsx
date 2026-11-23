'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, updateQuantity, removeItem, subtotal, openCheckout } =
    useCartStore();

  const currentSubtotal = subtotal();
  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 499.0;
  const progressPercent = Math.min(100, Math.round((currentSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - currentSubtotal);

  if (!isCartOpen) return null;

  return (
    <div id="CartDrawer" className="cart-drawer active" style={{ display: 'block' }}>
      <div
        id="CartDrawer-Overlay"
        className="drawer__overlay"
        onClick={closeCart}
      />
      <button
        type="button"
        className="cart-drawer__close-btn"
        aria-label="Close"
        onClick={closeCart}
      >
        <svg
          className="icon icon-modal-close"
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 5L5 21M21 21L5 5.00001"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div
        className="drawer__inner color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d"
        role="dialog"
        aria-modal="true"
        aria-label={`Your Cart (${totalCount})`}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="drawer__header color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d">
          <h2 className="drawer__header-title body-xl" style={{ margin: 0 }}>
            Your Cart ({totalCount})
          </h2>
          <button
            type="button"
            className="drawer__header-close focus-inset modal-close-button body-normal"
            onClick={closeCart}
            aria-label="Close"
          >
            <svg
              className="icon icon-modal-close"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 5L5 21M21 21L5 5.00001"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="cart-improvements">
          <div
            className="cart-shipping"
            style={{ padding: '1.2rem 2.4rem', borderBottom: '1px solid #f0f0f0' }}
          >
            {amountNeeded === 0 ? (
              <p
                className="cart-shipping__message cart-shipping__message_success body-xs active"
                style={{ display: 'block', color: '#2b8a3e', fontWeight: 700 }}
              >
                🎉 Congratulations! You qualify for free shipping.
              </p>
            ) : (
              <p
                className="cart-shipping__message cart-shipping__message_default body-xs active"
                style={{ display: 'block' }}
              >
                You&apos;re <strong>Rs. {amountNeeded.toFixed(2)}</strong> away from free shipping
              </p>
            )}
            <span
              className="cart-shipping__progress"
              style={{
                display: 'block',
                height: '6px',
                background: '#eeeeee',
                borderRadius: '3px',
                marginTop: '8px',
                overflow: 'hidden',
              }}
            >
              <span
                className="cart-shipping__progress-current"
                style={{
                  display: 'block',
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: '#000000',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease',
                }}
              />
            </span>
          </div>
        </div>

        {/* Contents */}
        {items.length === 0 ? (
          <div className="drawer__inner-empty" style={{ padding: '4rem 2.4rem', textAlign: 'center' }}>
            <div className="drawer__empty-wrapper">
              <p className="drawer__empty-title body-xl" style={{ fontWeight: 700 }}>
                Your Cart is Empty.
              </p>
              <button
                type="button"
                className="button button--primary"
                onClick={closeCart}
                style={{ marginTop: '1.5rem', borderRadius: '40px', padding: '12px 28px' }}
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div
            className="drawer__contents js-contents"
            style={{ flex: 1, overflowY: 'auto', padding: '1rem 2.4rem' }}
          >
            <ul className="cart-items list-unstyled" style={{ margin: 0, padding: 0 }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  className="cart-item"
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px 0',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <div
                    className="cart-item__media"
                    style={{ width: '72px', height: '72px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}
                  >
                    <img
                      src={item.image}
                      alt={item.productTitle}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="cart-item__details" style={{ flex: 1 }}>
                    <div className="cart-item__name h5" style={{ margin: 0, fontWeight: 700 }}>
                      {item.productTitle}
                    </div>
                    <div className="cart-item__tier body-xs" style={{ color: '#777', margin: '2px 0' }}>
                      {item.tierTitle}
                    </div>
                    <div className="cart-item__price price body-small" style={{ fontWeight: 700, margin: '4px 0' }}>
                      Rs. {item.price.toFixed(2)}
                    </div>
                    <div
                      className="cart-item__quantity-wrapper"
                      style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '8px' }}
                    >
                      <div
                        className="quantity"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid #dcdcdc',
                          borderRadius: '40px',
                          padding: '2px 10px',
                        }}
                      >
                        <button
                          type="button"
                          className="quantity__button button--unstyled"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ cursor: 'pointer', fontSize: '1rem', fontWeight: 700, padding: '0 4px' }}
                        >
                          −
                        </button>
                        <span className="quantity__input" style={{ padding: '0 10px', fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="quantity__button button--unstyled"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ cursor: 'pointer', fontSize: '1rem', fontWeight: 700, padding: '0 4px' }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="button--unstyled body-xs"
                        onClick={() => removeItem(item.id)}
                        style={{ color: '#c92a2a', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="drawer__footer">
          <div className="cart-drawer__footer" style={{ padding: '1.5rem 2.4rem', borderTop: '1px solid #f0f0f0' }}>
            <div className="totals" role="status" style={{ marginBottom: '1.2rem' }}>
              <div
                className="totals__main"
                style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
              >
                <div className="totals__text">
                  <p className="totals__subtotal body-normal" style={{ margin: 0, fontWeight: 700 }}>
                    Subtotal
                  </p>
                  <small className="tax-note body-xs" style={{ color: '#888' }}>
                    Taxes and <Link href="/policies/shipping-policy">shipping</Link> calculated at checkout
                  </small>
                </div>
                <div className="totals__subtotal-value body-normal" style={{ fontWeight: 800, fontSize: '1.15rem' }}>
                  <span>Rs. {currentSubtotal.toFixed(2)} INR</span>
                </div>
              </div>
            </div>

            <div className="cart-drawer__bottom">
              <button
                type="button"
                className="cart__checkout-button button button--primary button--full-width"
                onClick={() => {
                  closeCart();
                  openCheckout();
                }}
                disabled={items.length === 0}
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '60px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
