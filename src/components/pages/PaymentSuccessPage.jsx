import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useCart } from "@/hooks/useCart";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const pendingOrder = localStorage.getItem('pendingOrder');
    
    if (pendingOrder) {
      try {
        const order = JSON.parse(pendingOrder);
        setOrderDetails(order);
        localStorage.removeItem('pendingOrder');
        clearCart();
        toast.success("Payment completed successfully!");
      } catch (error) {
        toast.error("Failed to retrieve order details");
      }
    }
  }, [clearCart]);

  const paypalOrderId = searchParams.get('token');

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <ApperIcon name="Loader" size={48} className="animate-spin mx-auto mb-4 text-accent" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Check" size={32} className="text-white" />
          </div>
          
          <h1 className="text-3xl font-display font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="bg-secondary rounded-lg p-6 mb-8 text-left">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <span className="font-semibold">PayPal Transaction ID</span>
              <span className="text-sm text-gray-600 font-mono">{paypalOrderId}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${orderDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">${orderDetails.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${orderDetails.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-300">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-secondary rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ApperIcon name="Package" size={20} />
              Shipping Address
            </h3>
            <div className="text-gray-600 space-y-1">
              <p>{orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}</p>
              <p>{orderDetails.shippingAddress.address}</p>
              <p>
                {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}
              </p>
              <p className="pt-2">{orderDetails.shippingAddress.email}</p>
              <p>{orderDetails.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate("/")}
              className="flex-1"
            >
              Continue Shopping
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/orders")}
              className="flex-1"
            >
              View Orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;