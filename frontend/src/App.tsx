import { useState } from 'react';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import type { CartItem, Product } from './types';
import './index.css';

type Page = 'shop' | 'cart' | 'orders';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('shop');
  const [cart, setCart] = useState<CartItem[]>([]);

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

      if (item.quantity === 1) {
        return prev.filter((i) => i.product.id !== productId);
      }

      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }

  function removeFromCart(productId: number) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }

  return (
    <div className="app-layout">
      <nav className="navbar">
        <span className="navbar-logo">🛍️ ShopCart</span>

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
      </nav>

      {currentPage === 'shop' && (
        <ShopPage cart={cart} onAddToCart={addToCart} />
      )}
      {currentPage === 'cart' && (
        <CartPage
          items={cart}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onRemove={removeFromCart}
          onClear={() => setCart([])}
          onCheckoutSuccess={() => setCurrentPage('orders')}
        />
      )}
      {currentPage === 'orders' && (
        <OrdersPage />
      )}
    </div>
  );
}
