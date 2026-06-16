import { useState } from 'react';
import ShopPage from './pages/ShopPage';
import OrdersPage from './pages/OrdersPage';
import type { CartItem } from './types';
import './index.css';

type Page = 'shop' | 'orders';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('shop');
  const [cart, setCart] = useState<CartItem[]>([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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
            className="nav-btn nav-cart-btn"
            onClick={() => setCurrentPage('shop')}
          >
            🛒 Cart {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>
      </nav>

      {currentPage === 'shop' ? (
        <ShopPage cart={cart} setCart={setCart} />
      ) : (
        <OrdersPage />
      )}
    </div>
  );
}
