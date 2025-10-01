import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const cartCount = getCartCount();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Women", path: "/category/women" },
    { label: "Men", path: "/category/men" },
    { label: "Accessories", path: "/category/accessories" },
    { label: "Sale", path: "/sale" }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setAccountDropdownOpen(false);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-secondary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary">
                Vogue Vault
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-primary hover:text-accent transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
<div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-primary hover:text-accent transition-colors duration-200"
              >
                <ApperIcon name="Search" size={22} />
              </button>

              <button
                onClick={() => navigate("/wishlist")}
                className="relative p-2 text-primary hover:text-accent transition-colors duration-200"
              >
                <ApperIcon name="Heart" size={22} />
                {wishlist.length > 0 && (
                  <Badge
                    variant="accent"
                    className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center"
                  >
                    {wishlist.length}
                  </Badge>
                )}
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 text-primary hover:text-accent transition-colors duration-200"
              >
                <ApperIcon name="ShoppingCart" size={22} />
                {cartCount > 0 && (
                  <Badge
                    variant="accent"
                    className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center"
                  >
                    {cartCount}
                  </Badge>
                )}
              </button>

<div className="relative hidden lg:block">
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="p-2 text-primary hover:text-accent transition-colors duration-200"
                >
                  <ApperIcon name="User" size={22} />
                </button>

                <AnimatePresence>
                  {accountDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary py-2 z-50"
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-2 border-b border-secondary">
                            <p className="font-semibold text-primary">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-primary/60">{user.email}</p>
                          </div>
                          <Link
                            to="/account"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-secondary transition-colors"
                          >
                            <ApperIcon name="LayoutDashboard" size={18} />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-secondary transition-colors"
                          >
                            <ApperIcon name="Package" size={18} />
                            <span>Orders</span>
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-secondary transition-colors"
                          >
                            <ApperIcon name="Settings" size={18} />
                            <span>Profile</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-secondary transition-colors w-full text-left border-t border-secondary mt-2 pt-2"
                          >
                            <ApperIcon name="LogOut" size={18} />
                            <span>Logout</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-secondary transition-colors"
                          >
                            <ApperIcon name="LogIn" size={18} />
                            <span>Login</span>
                          </Link>
                          <Link
                            to="/register"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-secondary transition-colors"
                          >
                            <ApperIcon name="UserPlus" size={18} />
                            <span>Register</span>
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-primary hover:text-accent transition-colors duration-200"
              >
                <ApperIcon
                  name={mobileMenuOpen ? "X" : "Menu"}
                  size={24}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="border-t border-secondary bg-white"
            >
              <div className="max-w-3xl mx-auto px-4 py-6">
                <SearchBar onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl">
              <div className="p-6">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-6 right-6 text-primary hover:text-accent"
                >
                  <ApperIcon name="X" size={24} />
                </button>
<nav className="mt-12 space-y-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xl font-display font-medium text-primary hover:text-accent transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

<div className="mt-8 pt-8 border-t border-secondary space-y-4">
                  {user ? (
                    <>
                      <div className="px-4 py-2 bg-secondary rounded-lg">
                        <p className="font-semibold text-primary">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-primary/60">{user.email}</p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-lg font-medium text-primary hover:text-accent transition-colors"
                      >
                        <ApperIcon name="LayoutDashboard" size={20} />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-lg font-medium text-primary hover:text-accent transition-colors"
                      >
                        <ApperIcon name="Package" size={20} />
                        <span>Orders</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-lg font-medium text-primary hover:text-accent transition-colors"
                      >
                        <ApperIcon name="Settings" size={20} />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 text-lg font-medium text-primary hover:text-accent transition-colors"
                      >
                        <ApperIcon name="LogOut" size={20} />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-lg font-medium text-primary hover:text-accent transition-colors"
                      >
                        <ApperIcon name="LogIn" size={20} />
                        <span>Login</span>
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-lg font-medium text-primary hover:text-accent transition-colors"
                      >
                        <ApperIcon name="UserPlus" size={20} />
                        <span>Register</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;