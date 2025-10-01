import productsData from "../mockData/products.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const productService = {
  getAll: async () => {
    await delay(300);
    return [...productsData];
  },

  getById: async (id) => {
    await delay(200);
    const product = productsData.find((p) => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  getByCategory: async (category) => {
    await delay(300);
    return productsData.filter((p) => p.category === category);
  },

  getFeatured: async () => {
    await delay(300);
    return productsData.filter((p) => p.featured);
  },

  getTrending: async () => {
    await delay(300);
    return productsData.filter((p) => p.trending);
  },

  search: async (query) => {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return productsData.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    );
  }
};

export default productService;