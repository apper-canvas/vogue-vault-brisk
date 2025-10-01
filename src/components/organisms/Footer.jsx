import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
const quickLinks = [
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Account", path: "/account" },
    { label: "Shipping Policy", path: "/shipping" },
    { label: "Returns", path: "/returns" }
  ];

  const categories = [
    { label: "Women's Fashion", path: "/category/women" },
    { label: "Men's Fashion", path: "/category/men" },
    { label: "Accessories", path: "/category/accessories" },
    { label: "Sale Items", path: "/sale" }
  ];

  const socialLinks = [
    { icon: "Instagram", href: "#" },
    { icon: "Facebook", href: "#" },
    { icon: "Twitter", href: "#" },
    { icon: "Youtube", href: "#" }
  ];

  return (
    <footer className="bg-primary text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold text-accent">
              Vogue Vault
            </h3>
            <p className="text-white/80 leading-relaxed">
              Curated luxury fashion for the modern sophisticate. Discover
              timeless pieces that elevate your wardrobe.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-200"
                >
                  <ApperIcon name={social.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/80 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">
              Shop
            </h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link
                    to={category.path}
                    className="text-white/80 hover:text-accent transition-colors duration-200"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">
              Stay Updated
            </h4>
            <p className="text-white/80 mb-4">
              Subscribe to receive updates on new arrivals and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-accent"
              />
              <button className="px-6 py-2 bg-accent text-white rounded hover:brightness-110 transition-all duration-200">
                <ApperIcon name="Send" size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Vogue Vault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;