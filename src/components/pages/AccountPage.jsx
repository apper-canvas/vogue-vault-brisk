import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useAuth } from "@/hooks/useAuth";
import orderService from "@/services/api/orderService";

const AccountPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const userOrders = await orderService.getUserOrders();
      setOrders(userOrders.slice(0, 3));
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-primary mb-2">
            My Account
          </h1>
          <p className="text-primary/60">
            Welcome back, {user?.firstName || "Valued Customer"}!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-primary">
                  Recent Orders
                </h2>
                <Link to="/orders">
                  <Button variant="secondary" size="sm">
                    View All
                    <ApperIcon name="ArrowRight" size={16} />
                  </Button>
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon
                    name="ShoppingBag"
                    size={48}
                    className="mx-auto mb-4 text-primary/30"
                  />
                  <p className="text-primary/60 mb-4">No orders yet</p>
                  <Link to="/">
                    <Button variant="primary">Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      key={order.Id}
                      to={`/orders`}
                      className="block border border-secondary rounded-lg p-4 hover:border-accent transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-primary">
                            Order #{order.orderNumber}
                          </p>
                          <p className="text-sm text-primary/60">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
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
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-primary/60">
                          {order.items.length} item(s)
                        </p>
                        <p className="font-semibold text-accent">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-display font-bold text-primary mb-4">
                Account Details
              </h2>
              <div className="space-y-3 text-primary/60">
                <div>
                  <p className="text-sm">Name</p>
                  <p className="font-medium text-primary">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm">Email</p>
                  <p className="font-medium text-primary">{user?.email}</p>
                </div>
                {user?.phone && (
                  <div>
                    <p className="text-sm">Phone</p>
                    <p className="font-medium text-primary">{user.phone}</p>
                  </div>
                )}
              </div>
              <Link to="/profile">
                <Button variant="secondary" className="w-full mt-4">
                  <ApperIcon name="Edit" size={16} />
                  Edit Profile
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-display font-bold text-primary mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link to="/orders">
                  <Button variant="secondary" className="w-full">
                    <ApperIcon name="Package" size={16} />
                    Order History
                  </Button>
                </Link>
                <Link to="/wishlist">
                  <Button variant="secondary" className="w-full">
                    <ApperIcon name="Heart" size={16} />
                    Wishlist
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="secondary" className="w-full">
                    <ApperIcon name="ShoppingBag" size={16} />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;