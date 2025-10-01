import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ProductGrid from "@/components/organisms/ProductGrid";
import productService from "@/services/api/productService";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getById(id);
      setProduct(data);
      setSelectedSize(data.sizes[0]);
      setSelectedColor(data.colors[0]);

      const related = await productService.getByCategory(data.category);
      setRelatedProducts(related.filter((p) => p.Id !== data.Id).slice(0, 4));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    navigate("/cart");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProduct} />;
  if (!product) return null;

  const inWishlist = isInWishlist(product.Id);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-primary/60 mb-8">
          <button onClick={() => navigate("/")} className="hover:text-accent">
            Home
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <button
            onClick={() => navigate(`/category/${product.category}`)}
            className="hover:text-accent capitalize"
          >
            {product.category}
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-primary">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[3/4] bg-white rounded-lg overflow-hidden"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                    selectedImage === index
                      ? "border-accent"
                      : "border-secondary hover:border-accent/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-primary/60 capitalize">
                {product.category}
              </p>
            </div>

            <p className="text-4xl font-display font-bold text-accent">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-primary/80 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4">
              <Select
                label="Size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>

              <Select
                label="Color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                {product.colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </Select>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-secondary rounded hover:border-accent transition-colors duration-200 flex items-center justify-center"
                  >
                    <ApperIcon name="Minus" size={18} />
                  </button>
                  <span className="w-12 text-center font-medium text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border-2 border-secondary rounded hover:border-accent transition-colors duration-200 flex items-center justify-center"
                  >
                    <ApperIcon name="Plus" size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ApperIcon name="ShoppingCart" size={20} />
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                onClick={() => toggleWishlist(product.Id)}
              >
                <ApperIcon
                  name="Heart"
                  size={20}
                  className={inWishlist ? "fill-accent text-accent" : ""}
                />
              </Button>
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              Buy Now
            </Button>

            {!product.inStock && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-center gap-3">
                <ApperIcon name="AlertCircle" size={20} className="text-error" />
                <span className="text-error font-medium">
                  Currently out of stock
                </span>
              </div>
            )}

            <div className="border-t border-secondary pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <ApperIcon name="Truck" size={20} className="text-accent mt-1" />
                <div>
                  <h4 className="font-medium text-primary mb-1">
                    Free Shipping
                  </h4>
                  <p className="text-sm text-primary/60">
                    On orders over $100
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ApperIcon name="RefreshCw" size={20} className="text-accent mt-1" />
                <div>
                  <h4 className="font-medium text-primary mb-1">
                    Easy Returns
                  </h4>
                  <p className="text-sm text-primary/60">
                    30-day return policy
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ApperIcon name="Shield" size={20} className="text-accent mt-1" />
                <div>
                  <h4 className="font-medium text-primary mb-1">
                    Secure Checkout
                  </h4>
                  <p className="text-sm text-primary/60">
                    Your information is protected
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-display font-bold text-primary mb-8">
              You May Also Like
            </h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;