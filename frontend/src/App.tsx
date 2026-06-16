import { useState } from 'react';
import ShopPage from './pages/ShopPage';
import OrdersPage from './pages/OrdersPage';
import './index.css';

type Page = 'shop' | 'orders';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('shop');

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
        </div>
      </nav>

      {currentPage === 'shop' ? <ShopPage /> : <OrdersPage />}
    </div>
  );
}
