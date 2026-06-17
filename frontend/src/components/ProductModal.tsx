import { useState } from 'react';
import type { Product } from '../types';
import { apiCreateProduct, apiUpdateProduct, apiDeleteProduct } from '../api/auth';

interface Props {
  product?: Product; // undefined = create mode
  onClose: () => void;
  onSaved: (action: 'create' | 'update' | 'delete') => void;
}

export default function ProductModal({ product, onClose, onSaved }: Props) {
  const isEdit = !!product;
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [stock, setStock] = useState(product?.stock?.toString() ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
      };
      if (isEdit && product) {
        await apiUpdateProduct(product.id, data);
        onSaved('update');
      } else {
        await apiCreateProduct(data);
        onSaved('create');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await apiDeleteProduct(product.id);
      onSaved('delete');
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-header">
          <span className="modal-logo">📦</span>
          <h2 className="modal-title">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <p className="modal-subtitle">
            {isEdit ? `Editing "${product?.name}"` : 'Fill in product details below'}
          </p>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="prod-name">Name</label>
            <input
              id="prod-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prod-desc">Description</label>
            <input
              id="prod-desc"
              type="text"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="prod-price">Price (R)</label>
              <input
                id="prod-price"
                type="number"
                min="0"
                step="0.01"
                className="form-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="prod-stock">Stock</label>
              <input
                id="prod-stock"
                type="number"
                min="0"
                step="1"
                className="form-input"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            {isEdit && (
              <button
                type="button"
                className="delete-product-btn"
                onClick={handleDelete}
                disabled={loading}
              >
                🗑 Delete
              </button>
            )}
            <button type="submit" className="form-submit-btn" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
