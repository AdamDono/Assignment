import { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import type { CartItem, Product } from './types';
import './index.css';

type Page = 'shop' | 'cart' | 'orders';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

function AppInner() {
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('shop');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function increaseQty(productId: number) {
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  }

  function decreaseQty(productId: number) {
    setCart((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (!item) return prev;
      if (item.quantity === 1) return prev.filter((i) => i.product.id !== productId);
      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }

  function removeFromCart(productId: number) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function handleLogout() {
    logout();
    showToast('You have been logged out.', 'success');
  }

  return (
    <div className="app-layout">
      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

      <nav className="navbar">
        <span className="navbar-logo">Adams's Shop</span>

        <div className="navbar-links">
          <button
            className={`nav-btn ${currentPage === 'shop' ? 'active' : ''}`}
            onClick={() => setCurrentPage('shop')}
          >
            Shop
          </button>
          <button
            className={`nav-btn ${currentPage === 'orders' ? 'active' : ''}`}
            onClick={() => setCurrentPage('orders')}
          >
            Orders
          </button>
          <button
            className={`nav-btn nav-cart-btn ${currentPage === 'cart' ? 'active' : ''}`}
            onClick={() => setCurrentPage('cart')}
          >
            🛒 Cart {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>

        <div className="navbar-user">
          {isAuthenticated ? (
            <>
              <span className="user-pill">
                {isAdmin ? '👑 Admin' : '👤'} {user?.email}
              </span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <span className="user-pill guest">Guest</span>
          )}
        </div>
      </nav>

      {currentPage === 'shop' && (
        <ShopPage cart={cart} onAddToCart={addToCart} showToast={showToast} />
      )}
      {currentPage === 'cart' && (
        <CartPage
          items={cart}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onRemove={removeFromCart}
          onClear={() => setCart([])}
          onCheckoutSuccess={() => setCurrentPage('orders')}
          showToast={showToast}
        />
      )}
      {currentPage === 'orders' && <OrdersPage />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
