import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProductGrid from "@/components/organisms/ProductGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import productService from "@/services/api/productService";
import { useWishlist } from "@/hooks/useWishlist";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWishlistProducts();
  }, [wishlist]);

  const loadWishlistProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const allProducts = await productService.getAll();
      const wishlistProducts = allProducts.filter((product) =>
        wishlist.includes(product.Id)
      );
      setProducts(wishlistProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadWishlistProducts} />;

  if (products.length === 0) {
    return (
      <Empty
        icon="Heart"
        title="Your wishlist is empty"
        message="Start adding your favorite items to save them for later"
        action={{
          label: "Discover Products",
          onClick: () => navigate("/")
        }}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-primary mb-2">
              My Wishlist
            </h1>
            <p className="text-primary/60">{products.length} items saved</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate("/")}
          >
            <ApperIcon name="Plus" size={20} />
            Add More
          </Button>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default WishlistPage;