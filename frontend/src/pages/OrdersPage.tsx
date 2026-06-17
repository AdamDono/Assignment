import { useEffect, useState } from 'react';
import { getOrders } from '../api/client';
import type { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

interface Props {
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

export default function OrdersPage({ showToast }: Props) {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    getOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => setShowAuthModal(false)}
            showToast={showToast}
          />
        )}
        <div className="cart-page-empty">
          <div className="empty-cart-card">
            <h2>Log in to see your orders</h2>
            <p>You need to be signed in to view your order history.</p>
            <button
              className="add-btn"
              style={{ marginTop: '20px', padding: '12px' }}
              onClick={() => setShowAuthModal(true)}
            >
              Sign In &amp; Register
            </button>
          </div>
        </div>
      </>
    );
  }

  if (loading) return <p className="state-message">Loading orders...</p>;
  if (error) return <p className="state-message error">{error}</p>;

  return (
    <div className="orders-page">
      <h1 className="section-title">Order History</h1>

      {orders.length === 0 ? (
        <p className="state-message">No orders yet. Go buy something!</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <div className="order-id">Order #{order.id}</div>
                <div className="order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
              <span className="order-total-badge">
                R{Number(order.total).toFixed(2)}
              </span>
            </div>

            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>R{Number(item.unitPrice).toFixed(2)}</td>
                    <td>R{(Number(item.unitPrice) * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
