import { useState } from 'react';
import type { CartItem } from '../types';
import { checkout } from '../api/client';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

interface Props {
  items: CartItem[];
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
  onClear: () => void;
  onCheckoutSuccess: () => void;
}

export default function CartPage({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onCheckoutSuccess,
}: Props) {
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState('');

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + shipping + tax;

  async function doCheckout() {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    setError('');
    try {
      await checkout(
        items.map((i) => ({ productId: i.product.id, quantity: i.quantity }))
      );
      onClear();
      onCheckoutSuccess();
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
    } finally {
      setIsCheckingOut(false);
    }
  }

  function handleCheckoutClick() {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      doCheckout();
    }
  }

  // Called when auth modal succeeds — user is now logged in, proceed to checkout
  function handleAuthSuccess() {
    setShowAuthModal(false);
    doCheckout();
  }

  if (items.length === 0) {
    return (
      <div className="cart-page-empty">
        <div className="empty-cart-card">
          <span className="empty-cart-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Explore our products and find something you like!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      <div className="cart-page">
        <h1 className="section-title">Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items-section">
            {items.map((item) => (
              <div key={item.product.id} className="cart-page-item">
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                  <p className="cart-item-desc">{item.product.description}</p>
                  <p className="cart-item-price-unit">R{Number(item.product.price).toFixed(2)} each</p>
                </div>
                <div className="cart-item-actions">
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => onDecrease(item.product.id)}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => onIncrease(item.product.id)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-price-col">
                    <span className="cart-item-line-total">R{(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                    <button className="cart-item-remove-btn" onClick={() => onRemove(item.product.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-section">
            <div className="summary-card">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">Free</span>
              </div>
              <div className="summary-row">
                <span>Estimated Tax (8%)</span>
                <span>R{tax.toFixed(2)}</span>
              </div>

              <hr className="summary-divider" />

              <div className="summary-row total">
                <span>Total</span>
                <span>R{total.toFixed(2)}</span>
              </div>

              {error && <div className="checkout-error">{error}</div>}

              <button
                className="checkout-btn"
                onClick={handleCheckoutClick}
                disabled={isCheckingOut}
              >
                {isCheckingOut
                  ? 'Placing Order...'
                  : !isAuthenticated
                  ? '🔒 Sign In to Checkout'
                  : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
