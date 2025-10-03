const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const transformProduct = (data) => {
  return {
    Id: data.Id,
    name: data.name_c,
    category: data.category_c,
    subcategory: data.subcategory_c,
    price: data.price_c,
images: data.images_c 
      ? (data.images_c.trim().startsWith('[') || data.images_c.trim().startsWith('{')
          ? JSON.parse(data.images_c)
          : [data.images_c])
      : [],
    sizes: data.sizes_c ? JSON.parse(data.sizes_c) : [],
    colors: data.colors_c ? JSON.parse(data.colors_c) : [],
    description: data.description_c,
    inStock: data.in_stock_c,
    stockCount: data.stock_count_c,
    featured: data.featured_c,
    trending: data.trending_c
  };
};

const getProductFields = () => [
  { field: { Name: "Id" } },
  { field: { Name: "name_c" } },
  { field: { Name: "category_c" } },
  { field: { Name: "subcategory_c" } },
  { field: { Name: "price_c" } },
  { field: { Name: "images_c" } },
  { field: { Name: "sizes_c" } },
  { field: { Name: "colors_c" } },
  { field: { Name: "description_c" } },
  { field: { Name: "in_stock_c" } },
  { field: { Name: "stock_count_c" } },
  { field: { Name: "featured_c" } },
  { field: { Name: "trending_c" } }
];

const productService = {
  getAll: async () => {
    const apperClient = getApperClient();

    const params = {
      fields: getProductFields(),
      pagingInfo: { limit: 100, offset: 0 }
    };

    const response = await apperClient.fetchRecords("product_c", params);

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch products");
    }

    return (response.data || []).map(transformProduct);
  },

  getById: async (id) => {
    const apperClient = getApperClient();

    const params = {
      fields: getProductFields()
    };

    const response = await apperClient.getRecordById("product_c", parseInt(id), params);

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch product");
    }

    if (!response.data) {
      throw new Error("Product not found");
    }

    return transformProduct(response.data);
  },

  getByCategory: async (category) => {
    const apperClient = getApperClient();

    const params = {
      fields: getProductFields(),
      where: [
        {
          FieldName: "category_c",
          Operator: "EqualTo",
          Values: [category],
          Include: true
        }
      ],
      pagingInfo: { limit: 100, offset: 0 }
    };

    const response = await apperClient.fetchRecords("product_c", params);

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch products by category");
    }

    return (response.data || []).map(transformProduct);
  },

  getFeatured: async () => {
    const apperClient = getApperClient();

    const params = {
      fields: getProductFields(),
      where: [
        {
          FieldName: "featured_c",
          Operator: "EqualTo",
          Values: [true],
          Include: true
        }
      ],
      pagingInfo: { limit: 100, offset: 0 }
    };

    const response = await apperClient.fetchRecords("product_c", params);

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch featured products");
    }

    return (response.data || []).map(transformProduct);
  },

  getTrending: async () => {
    const apperClient = getApperClient();

    const params = {
      fields: getProductFields(),
      where: [
        {
          FieldName: "trending_c",
          Operator: "EqualTo",
          Values: [true],
          Include: true
        }
      ],
      pagingInfo: { limit: 100, offset: 0 }
    };

    const response = await apperClient.fetchRecords("product_c", params);

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch trending products");
    }

    return (response.data || []).map(transformProduct);
  },

  search: async (query) => {
    const apperClient = getApperClient();

    const params = {
      fields: getProductFields(),
      whereGroups: [
        {
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "name_c",
                  operator: "Contains",
                  values: [query]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "category_c",
                  operator: "Contains",
                  values: [query]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "description_c",
                  operator: "Contains",
                  values: [query]
                }
              ]
            }
          ]
        }
      ],
      pagingInfo: { limit: 50, offset: 0 }
    };

    const response = await apperClient.fetchRecords("product_c", params);

    if (!response.success) {
      throw new Error(response.message || "Failed to search products");
    }

    return (response.data || []).map(transformProduct);
  }
};
export default productService;