import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Empty from "@/components/ui/Empty";
import { useCart } from "@/hooks/useCart";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <Empty
        icon="ShoppingCart"
        title="Your cart is empty"
        message="Add some items to your cart to get started"
        action={{
          label: "Start Shopping",
          onClick: () => navigate("/")
        }}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-display font-bold text-primary mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 divide-y divide-secondary">
              {cart.map((item, index) => (
                <CartItem key={`${item.productId}-${item.size}-${item.color}-${index}`} item={item} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-display font-bold text-primary mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-primary/60">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-primary/60">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <div className="text-sm text-accent">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
                <div className="border-t border-secondary pt-4 flex justify-between text-xl font-display font-bold text-primary">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full mb-4"
                onClick={() => navigate("/checkout")}
              >
                <ApperIcon name="CreditCard" size={20} />
                Proceed to Checkout
              </Button>

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>

              <div className="mt-6 pt-6 border-t border-secondary space-y-3 text-sm">
                <div className="flex items-center gap-2 text-primary/60">
                  <ApperIcon name="Shield" size={16} className="text-accent" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-primary/60">
                  <ApperIcon name="Truck" size={16} className="text-accent" />
                  <span>Free shipping over $100</span>
                </div>
                <div className="flex items-center gap-2 text-primary/60">
                  <ApperIcon name="RefreshCw" size={16} className="text-accent" />
                  <span>Easy 30-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;