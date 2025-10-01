import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 py-4">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <h4 className="font-medium text-primary">{item.name}</h4>
          <button
            onClick={() =>
              removeFromCart(item.productId, item.size, item.color)
            }
            className="text-primary/40 hover:text-error transition-colors duration-200"
          >
            <ApperIcon name="X" size={18} />
          </button>
        </div>
        <div className="flex gap-4 text-sm text-primary/60">
          <span>Size: {item.size}</span>
          <span>Color: {item.color}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateQuantity(
                  item.productId,
                  item.size,
                  item.color,
                  item.quantity - 1
                )
              }
              className="w-8 h-8 border-2 border-secondary rounded hover:border-accent transition-colors duration-200 flex items-center justify-center"
            >
              <ApperIcon name="Minus" size={14} />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() =>
                updateQuantity(
                  item.productId,
                  item.size,
                  item.color,
                  item.quantity + 1
                )
              }
              className="w-8 h-8 border-2 border-secondary rounded hover:border-accent transition-colors duration-200 flex items-center justify-center"
            >
              <ApperIcon name="Plus" size={14} />
            </button>
          </div>
          <p className="font-display font-semibold text-accent">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;