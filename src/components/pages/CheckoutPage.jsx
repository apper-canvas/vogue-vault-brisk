import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import orderService from "@/services/api/orderService";
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const { ApperClient } = window.ApperSDK || {};

  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"];
      const missingFields = requiredFields.filter((field) => !formData[field]);
      
      if (missingFields.length > 0) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      try {
        setLoading(true);

        if (!ApperClient) {
          toast.error("Payment system not initialized. Please refresh the page.");
          setLoading(false);
          return;
        }

        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        const orderData = {
          items: cart,
          subtotal,
          shipping,
          tax,
          total,
          shippingAddress: formData,
          returnUrl: window.location.origin,
          cancelUrl: window.location.origin
        };

        const result = await apperClient.functions.invoke(
          import.meta.env.VITE_PROCESS_PAYPAL_PAYMENT,
          {
            body: JSON.stringify(orderData),
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        const responseData = await result.json();

        if (responseData.success === false) {
          console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_PROCESS_PAYPAL_PAYMENT}. The response body is: ${JSON.stringify(responseData)}.`);
          toast.error(responseData.error || "Payment processing failed. Please try again.");
          setLoading(false);
          return;
        }

        if (responseData.approvalUrl) {
          const orderRecord = {
            items: cart,
            subtotal,
            shipping,
            tax,
            total,
            shippingAddress: formData,
            paymentMethod: "PayPal",
            transactionId: responseData.orderId
          };

          if (user) {
            await orderService.createOrder(orderRecord);
          }

          localStorage.setItem('pendingOrder', JSON.stringify(orderRecord));
          
          setPaymentUrl(responseData.approvalUrl);
        } else {
          toast.error("Payment approval URL not received. Please try again.");
          setLoading(false);
        }

      } catch (error) {
        console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_PROCESS_PAYPAL_PAYMENT}. The error is: ${error.message}`);
        toast.error("Failed to process payment. Please try again.");
        setLoading(false);
      }
    }
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-display font-bold text-primary mb-8">
          Checkout
        </h1>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= 1
                    ? "bg-accent text-white"
                    : "bg-secondary text-primary/60"
                }`}
              >
                {step > 1 ? (
                  <ApperIcon name="Check" size={20} />
                ) : (
                  <span className="font-medium">1</span>
                )}
              </div>
              <div className="hidden sm:block text-primary font-medium">
                Shipping
              </div>
              <div
                className={`w-16 sm:w-24 h-1 ${
                  step >= 2 ? "bg-accent" : "bg-secondary"
                }`}
              />
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= 2
                    ? "bg-accent text-white"
                    : "bg-secondary text-primary/60"
                }`}
              >
                <span className="font-medium">2</span>
              </div>
              <div className="hidden sm:block text-primary font-medium">
                Review
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 sm:p-8">
              {step === 1 ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-primary mb-6">
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="ZIP Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Select
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </Select>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-primary mb-6">
                    Review Your Order
                  </h2>

                  <div className="space-y-4">
                    <div className="border-b border-secondary pb-4">
                      <h3 className="font-semibold text-primary mb-2">
                        Shipping Address
                      </h3>
                      <p className="text-primary/60">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-primary/60">{formData.address}</p>
                      <p className="text-primary/60">
                        {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                      <p className="text-primary/60">{formData.country}</p>
                    </div>

                    <div className="border-b border-secondary pb-4">
                      <h3 className="font-semibold text-primary mb-2">
                        Contact Information
                      </h3>
                      <p className="text-primary/60">{formData.email}</p>
                      <p className="text-primary/60">{formData.phone}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary mb-4">
                        Order Items ({cart.length})
                      </h3>
                      <div className="space-y-4">
                        {cart.map((item, index) => (
                          <div key={`${item.productId}-${index}`} className="flex gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-primary">
                                {item.name}
                              </h4>
                              <p className="text-sm text-primary/60">
                                Size: {item.size}, Color: {item.color}
                              </p>
                              <p className="text-sm text-primary/60">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-accent">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

<div className="flex gap-4 mt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                    disabled={loading}
                  >
                    <ApperIcon name="ArrowLeft" size={20} />
                    Back
                  </Button>
                )}
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    "Processing..."
                  ) : step === 1 ? (
                    <>
                      Continue to Review
                      <ApperIcon name="ArrowRight" size={20} />
                    </>
                  ) : step === 2 ? (
                    <>
                      Continue to Payment
                      <ApperIcon name="ArrowRight" size={20} />
                    </>
                  ) : (
                    <>
                      Pay with PayPal
                      <ApperIcon name="CreditCard" size={20} />
                    </>
                  )}
                </Button>
              </div>
            </form>
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
                <div className="flex justify-between text-primary/60">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-secondary pt-4 flex justify-between text-xl font-display font-bold text-primary">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-primary/60">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Shield" size={16} className="text-accent" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Lock" size={16} className="text-accent" />
                  <span>Your data is protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;