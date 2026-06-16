import type { Product, CartItem } from '../types';

interface Props {
  product: Product;
  cartItem?: CartItem;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, cartItem, onAdd }: Props) {
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="product-card">
      <div className="product-name">{product.name}</div>
      <div className="product-desc">{product.description}</div>

      <div className="product-footer">
        <span className="product-price">${Number(product.price).toFixed(2)}</span>
        <span className={`product-stock ${lowStock ? 'low' : ''}`}>
          {outOfStock ? 'Out of stock' : `${product.stock} left`}
        </span>
      </div>

      <button
        className="add-btn"
        onClick={() => onAdd(product)}
        disabled={outOfStock}
      >
        {cartItem ? `In cart (${cartItem.quantity})` : 'Add to Cart'}
      </button>
    </div>
  );
}
