import { useEffect, useState } from 'react';
import { getProducts } from '../api/client';
import type { Product, CartItem } from '../types';
import ProductCard from '../components/ProductCard';

interface Props {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
}

export default function ShopPage({ cart, onAddToCart }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
               onAdd={onAddToCart}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
