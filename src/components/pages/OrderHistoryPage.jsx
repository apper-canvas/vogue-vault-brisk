import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import orderService from "@/services/api/orderService";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const userOrders = await orderService.getUserOrders();
      setOrders(userOrders);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (orders.length === 0) {
    return (
      <Empty
        icon="ShoppingBag"
        title="No Orders Yet"
        message="Start shopping to see your order history here"
        actionLabel="Browse Products"
        actionPath="/"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-display font-bold text-primary mb-8">
          Order History
        </h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.Id} className="bg-white rounded-lg shadow-sm">
              <div
                className="p-6 cursor-pointer"
                onClick={() => toggleOrderDetails(order.Id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-display font-bold text-primary">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-primary/60">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "success"
                          : order.status === "Shipped"
                          ? "info"
                          : "warning"
                      }
                    >
                      {order.status}
                    </Badge>
                    <ApperIcon
                      name={expandedOrder === order.Id ? "ChevronUp" : "ChevronDown"}
                      size={20}
                      className="text-primary/60"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-primary/60">
                    {order.items.length} item(s)
                  </p>
                  <p className="text-2xl font-display font-bold text-accent">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {expandedOrder === order.Id && (
                <div className="border-t border-secondary p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-3">
                        Shipping Address
                      </h4>
                      <div className="text-primary/60">
                        <p>
                          {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName}
                        </p>
                        <p>{order.shippingAddress.address}</p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary mb-3">
                        Order Summary
                      </h4>
                      <div className="space-y-2 text-primary/60">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>
                            {order.shipping === 0
                              ? "FREE"
                              : `$${order.shipping.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-primary text-lg pt-2 border-t border-secondary">
                          <span>Total</span>
                          <span className="text-accent">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-4">
                      Order Items
                    </h4>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={`${item.productId}-${index}`}
                          className="flex gap-4 border border-secondary rounded-lg p-4"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h5 className="font-semibold text-primary mb-1">
                              {item.name}
                            </h5>
                            <div className="text-sm text-primary/60 space-y-1">
                              <p>Size: {item.size}</p>
                              <p>Color: {item.color}</p>
                              <p>Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-accent">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-primary/60">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;