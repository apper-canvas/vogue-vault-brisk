import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import productService from "@/services/api/productService";

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await productService.search(query);
        setResults(searchResults.slice(0, 5));
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose?.();
  };

  return (
    <div className="w-full">
      <div className="relative">
        <ApperIcon
          name="Search"
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-secondary rounded-lg text-primary placeholder:text-primary/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {query.length >= 2 && (
        <div className="mt-4 bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-primary/60">Searching...</div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-secondary">
              {results.map((product) => (
                <div
                  key={product.Id}
                  className="p-4 flex items-center gap-4 hover:bg-secondary cursor-pointer transition-colors duration-200"
                  onClick={() => handleProductClick(product.Id)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-primary">{product.name}</h4>
                    <p className="text-sm text-primary/60">{product.category}</p>
                  </div>
                  <p className="font-display font-semibold text-accent">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-primary/60">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;