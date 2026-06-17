import { useEffect, useState } from 'react';
import { getProducts } from '../api/client';
import type { Product, CartItem } from '../types';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { useAuth } from '../context/AuthContext';

interface Props {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export default function ShopPage({ cart, onAddToCart, showToast }: Props) {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  function loadProducts() {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
    return 0;
  });

  if (loading) return <p className="state-message">Loading products...</p>;
  if (error) return <p className="state-message error">{error}</p>;

  return (
    <>
      {showAddModal && (
        <ProductModal
          onClose={() => setShowAddModal(false)}
          onSaved={(action) => {
            setShowAddModal(false);
            loadProducts();
            if (action === 'create') {
              showToast('Product added successfully!', 'success');
            }
          }}
        />
      )}
      {editProduct && (
        <ProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSaved={(action) => {
            setEditProduct(null);
            loadProducts();
            if (action === 'update') {
              showToast('Product updated successfully!', 'success');
            } else if (action === 'delete') {
              showToast('Product deleted successfully!', 'success');
            }
          }}
        />
      )}

      <div className="main-content">
        <section className="products-section">
          <div className="section-header">
            <h1 className="section-title">Products</h1>
            {isAdmin && (
              <button
                className="add-product-btn"
                onClick={() => setShowAddModal(true)}
              >
                + Add Product
              </button>
            )}
          </div>

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
                  onEdit={isAdmin ? () => setEditProduct(product) : undefined}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
