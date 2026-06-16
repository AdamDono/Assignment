import type { CartItem } from '../types';
import CartItemRow from './CartItemRow';

interface Props {
  items: CartItem[];
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

export default function CartSidebar({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
  isCheckingOut,
}: Props) {
  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <aside className="cart-sidebar">
      <div className="cart-title">🛒 Your Cart</div>

      {items.length === 0 ? (
        <p className="cart-empty">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onRemove={onRemove}
              />
            ))}
          </div>

          <hr className="cart-divider" />

          <div className="cart-total">
            <span>Total</span>
            <span>R{total.toFixed(2)}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={onCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? 'Placing order...' : 'Checkout'}
          </button>
        </>
      )}
    </aside>
  );
}
