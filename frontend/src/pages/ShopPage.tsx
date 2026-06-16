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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return Number(a.price) - Number(b.price);
    }
    if (sortBy === 'price-desc') {
      return Number(b.price) - Number(a.price);
    }
    return 0; // default order
  });

  if (loading) return <p className="state-message">Loading products...</p>;
  if (error) return <p className="state-message error">{error}</p>;

  return (
    <div className="main-content">
      <section className="products-section">
        <h1 className="section-title">Products</h1>

        <div className="shop-controls">
          <div className="search-bar-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                ✕
              </button>
            )}
          </div>

          <div className="sort-container">
            <label htmlFor="sort-select" className="sort-label">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="no-results">
            <p>No products found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="products-grid">
            {sortedProducts.map((product) => (
              <ProductCard
                 key={product.id}
                 product={product}
                 cartItem={cart.find((i) => i.product.id === product.id)}
                 onAdd={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
