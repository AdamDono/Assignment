import { useEffect, useState } from 'react';
import { getOrders } from '../api/client';
import type { Order } from '../types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
