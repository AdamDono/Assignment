import { useEffect, useState } from 'react';
import { getProducts, checkout } from '../api/client';
import type { Product, CartItem } from '../types';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

import type { Dispatch, SetStateAction } from 'react';

interface Props {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
}

export default function ShopPage({ cart, setCart }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Auto-dismiss the toast after 3 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        // Already in cart — just bump the quantity
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
        // Remove from cart if quantity would hit 0
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

  async function handleCheckout() {
    if (cart.length === 0) return;

    setIsCheckingOut(true);
    try {
      await checkout(
        cart.map((i) => ({ productId: i.product.id, quantity: i.quantity }))
      );

      setCart([]);
      setToast({ message: 'Order placed successfully! 🎉', type: 'success' });

      // Refresh stock counts so the UI reflects the new inventory
      const updated = await getProducts();
      setProducts(updated);
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setIsCheckingOut(false);
    }
  }

  if (loading) return <p className="state-message">Loading products...</p>;
  if (error) return <p className="state-message error">{error}</p>;

  return (
    <div className="main-content">
      <section className="products-section">
        <h1 className="section-title">Products</h1>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartItem={cart.find((i) => i.product.id === product.id)}
              onAdd={addToCart}
            />
          ))}
        </div>
      </section>

      <CartSidebar
        items={cart}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
      />

      {toast && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}
