import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useWishlist } from "@/hooks/useWishlist";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.Id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product.Id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer"
      onClick={() => navigate(`/product/${product.Id}`)}
    >
      <div className="relative bg-white rounded-lg overflow-hidden mb-4">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <button
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-110"
        >
          <ApperIcon
            name="Heart"
            size={20}
            className={`transition-colors duration-200 ${
              inWishlist ? "fill-accent text-accent" : "text-primary"
            }`}
          />
        </button>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-primary font-medium">Out of Stock</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="primary"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.Id}`);
            }}
          >
            Quick View
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-medium text-primary group-hover:text-accent transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-sm text-primary/60">{product.category}</p>
        <p className="font-display font-semibold text-lg text-primary">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;