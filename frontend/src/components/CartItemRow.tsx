import type { CartItem } from '../types';

interface Props {
  item: CartItem;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItemRow({ item, onIncrease, onDecrease, onRemove }: Props) {
  const lineTotal = Number(item.product.price) * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-name">{item.product.name}</div>

      <div className="cart-item-controls">
        <div className="qty-controls">
          <button className="qty-btn" onClick={() => onDecrease(item.product.id)}>−</button>
          <span className="qty-value">{item.quantity}</span>
          <button
            className="qty-btn"
            onClick={() => onIncrease(item.product.id)}
            // can't add more than available stock
            disabled={item.quantity >= item.product.stock}
          >
            +
          </button>
        </div>

        <span className="cart-item-line-total">R{lineTotal.toFixed(2)}</span>
      </div>

      <button className="remove-btn" onClick={() => onRemove(item.product.id)}>
        Remove
      </button>
    </div>
  );
}
