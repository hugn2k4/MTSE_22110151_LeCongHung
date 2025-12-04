import { GraphQLClient } from "graphql-request";

const GRAPHQL_ENDPOINT = `${import.meta.env.VITE_BACKEND_URL}/graphql`;

// Tạo GraphQL client
const createGraphQLClient = () => {
  const token = localStorage.getItem("access_token");

  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
};

// GraphQL Queries & Mutations
export const GET_CART_QUERY = `
  query GetCart {
    getCart {
      EC
      EM
      data {
        id
        userId
        totalItems
        totalPrice
        selectedTotalPrice
        items {
          id
          cartId
          productId
          quantity
          selected
          product {
            id
            name
            description
            price
            image
            stock
            category
            discount
          }
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const ADD_TO_CART_MUTATION = `
  mutation AddToCart($productId: Int!, $quantity: Int!) {
    addToCart(input: { productId: $productId, quantity: $quantity }) {
      EC
      EM
      data {
        id
        quantity
        selected
        product {
          id
          name
          price
          image
          stock
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM_MUTATION = `
  mutation UpdateCartItem($cartItemId: Int!, $quantity: Int!) {
    updateCartItem(input: { cartItemId: $cartItemId, quantity: $quantity }) {
      EC
      EM
      data {
        id
        quantity
        product {
          name
          price
        }
      }
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = `
  mutation RemoveFromCart($cartItemId: Int!) {
    removeFromCart(cartItemId: $cartItemId) {
      EC
      EM
    }
  }
`;

export const SELECT_CART_ITEMS_MUTATION = `
  mutation SelectCartItems($cartItemIds: [Int!]!, $selected: Boolean!) {
    selectCartItems(input: { cartItemIds: $cartItemIds, selected: $selected }) {
      EC
      EM
      data {
        id
        totalItems
        selectedTotalPrice
        items {
          id
          selected
          quantity
          product {
            name
            price
          }
        }
      }
    }
  }
`;

export const CHECKOUT_MUTATION = `
  mutation Checkout {
    checkout {
      EC
      EM
      data {
        totalAmount
        itemCount
        selectedItems {
          id
          quantity
          product {
            name
            price
          }
        }
      }
    }
  }
`;

// Favorites Queries & Mutations
export const GET_FAVORITES_QUERY = `
  query GetFavorites($page: Int, $limit: Int) {
    getFavorites(page: $page, limit: $limit) {
      EC
      EM
      data {
        favorites {
          id
          productId
          product {
            id
            name
            description
            price
            image
            category
            discount
            stock
            views
          }
          createdAt
        }
        totalItems
        currentPage
        totalPages
      }
    }
  }
`;

export const CHECK_FAVORITE_QUERY = `
  query CheckFavorite($productId: Int!) {
    checkFavorite(productId: $productId) {
      EC
      data {
        isFavorite
      }
    }
  }
`;

export const ADD_FAVORITE_MUTATION = `
  mutation AddFavorite($productId: Int!) {
    addFavorite(productId: $productId) {
      EC
      EM
      data {
        id
        productId
      }
    }
  }
`;

export const REMOVE_FAVORITE_MUTATION = `
  mutation RemoveFavorite($productId: Int!) {
    removeFavorite(productId: $productId) {
      EC
      EM
    }
  }
`;

// Product Stats & Similar Products
export const GET_PRODUCT_STATS_QUERY = `
  query GetProductStats($productId: Int!) {
    getProductStats(productId: $productId) {
      EC
      EM
      data {
        productId
        purchaseCount
        commentCount
        favoriteCount
        viewCount
      }
    }
  }
`;

export const GET_SIMILAR_PRODUCTS_QUERY = `
  query GetSimilarProducts($productId: Int!, $limit: Int) {
    getSimilarProducts(productId: $productId, limit: $limit) {
      EC
      EM
      data {
        id
        name
        description
        price
        image
        category
        discount
        stock
        views
      }
    }
  }
`;

// Comments
export const GET_PRODUCT_COMMENTS_QUERY = `
  query GetProductComments($productId: Int!, $page: Int, $limit: Int) {
    getProductComments(productId: $productId, page: $page, limit: $limit) {
      EC
      EM
      data {
        comments {
          id
          userId
          productId
          content
          rating
          user {
            id
            name
            email
          }
          createdAt
          updatedAt
        }
        totalItems
        currentPage
        totalPages
      }
    }
  }
`;

export const ADD_COMMENT_MUTATION = `
  mutation AddComment($productId: Int!, $content: String!, $rating: Int!) {
    addComment(productId: $productId, content: $content, rating: $rating) {
      EC
      EM
      data {
        id
        content
        rating
        createdAt
      }
    }
  }
`;

export const UPDATE_COMMENT_MUTATION = `
  mutation UpdateComment($commentId: Int!, $content: String, $rating: Int) {
    updateComment(commentId: $commentId, content: $content, rating: $rating) {
      EC
      EM
      data {
        id
        content
        rating
        updatedAt
      }
    }
  }
`;

export const DELETE_COMMENT_MUTATION = `
  mutation DeleteComment($commentId: Int!) {
    deleteComment(commentId: $commentId) {
      EC
      EM
    }
  }
`;

// Product Views
export const RECORD_PRODUCT_VIEW_MUTATION = `
  mutation RecordProductView($productId: Int!) {
    recordProductView(productId: $productId) {
      EC
      EM
    }
  }
`;

export const GET_VIEWED_PRODUCTS_QUERY = `
  query GetViewedProducts($page: Int, $limit: Int) {
    getViewedProducts(page: $page, limit: $limit) {
      EC
      EM
      data {
        products {
          id
          name
          description
          price
          image
          category
          discount
          stock
          views
          lastViewedAt
        }
        totalItems
        currentPage
        totalPages
      }
    }
  }
`;

// API Functions
export const cartAPI = {
  // Lấy giỏ hàng
  getCart: async () => {
    const client = createGraphQLClient();
    const data = await client.request(GET_CART_QUERY);
    return data.getCart;
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (productId, quantity = 1) => {
    const client = createGraphQLClient();
    const data = await client.request(ADD_TO_CART_MUTATION, { productId, quantity });
    return data.addToCart;
  },

  // Cập nhật số lượng
  updateCartItem: async (cartItemId, quantity) => {
    const client = createGraphQLClient();
    const data = await client.request(UPDATE_CART_ITEM_MUTATION, { cartItemId, quantity });
    return data.updateCartItem;
  },

  // Xóa sản phẩm
  removeFromCart: async (cartItemId) => {
    const client = createGraphQLClient();
    const data = await client.request(REMOVE_FROM_CART_MUTATION, { cartItemId });
    return data.removeFromCart;
  },

  // Chọn/bỏ chọn sản phẩm
  selectCartItems: async (cartItemIds, selected) => {
    const client = createGraphQLClient();
    const data = await client.request(SELECT_CART_ITEMS_MUTATION, { cartItemIds, selected });
    return data.selectCartItems;
  },

  // Thanh toán
  checkout: async () => {
    const client = createGraphQLClient();
    const data = await client.request(CHECKOUT_MUTATION);
    return data.checkout;
  },
};

// Favorites API
export const favoritesAPI = {
  // Lấy danh sách yêu thích
  getFavorites: async (page = 1, limit = 12) => {
    const client = createGraphQLClient();
    const data = await client.request(GET_FAVORITES_QUERY, { page, limit });
    return data.getFavorites;
  },

  // Kiểm tra sản phẩm có được yêu thích không
  checkFavorite: async (productId) => {
    const client = createGraphQLClient();
    const data = await client.request(CHECK_FAVORITE_QUERY, { productId });
    return data.checkFavorite;
  },

  // Thêm vào yêu thích
  addFavorite: async (productId) => {
    const client = createGraphQLClient();
    const data = await client.request(ADD_FAVORITE_MUTATION, { productId });
    return data.addFavorite;
  },

  // Xóa khỏi yêu thích
  removeFavorite: async (productId) => {
    const client = createGraphQLClient();
    const data = await client.request(REMOVE_FAVORITE_MUTATION, { productId });
    return data.removeFavorite;
  },
};

// Products API
export const productsAPI = {
  // Lấy thống kê sản phẩm
  getProductStats: async (productId) => {
    const client = createGraphQLClient();
    const data = await client.request(GET_PRODUCT_STATS_QUERY, { productId });
    return data.getProductStats;
  },

  // Lấy sản phẩm tương tự
  getSimilarProducts: async (productId, limit = 6) => {
    const client = createGraphQLClient();
    const data = await client.request(GET_SIMILAR_PRODUCTS_QUERY, {
      productId,
      limit,
    });
    return data.getSimilarProducts;
  },

  // Ghi lại lượt xem
  recordProductView: async (productId) => {
    const client = createGraphQLClient();
    const data = await client.request(RECORD_PRODUCT_VIEW_MUTATION, {
      productId,
    });
    return data.recordProductView;
  },

  // Lấy sản phẩm đã xem
  getViewedProducts: async (page = 1, limit = 12) => {
    const client = createGraphQLClient();
    const data = await client.request(GET_VIEWED_PRODUCTS_QUERY, {
      page,
      limit,
    });
    return data.getViewedProducts;
  },
};

// Comments API
export const commentsAPI = {
  // Lấy bình luận sản phẩm
  getProductComments: async (productId, page = 1, limit = 10) => {
    const client = createGraphQLClient();
    const data = await client.request(GET_PRODUCT_COMMENTS_QUERY, {
      productId,
      page,
      limit,
    });
    return data.getProductComments;
  },

  // Thêm bình luận
  addComment: async (productId, content, rating) => {
    const client = createGraphQLClient();
    const data = await client.request(ADD_COMMENT_MUTATION, {
      productId,
      content,
      rating,
    });
    return data.addComment;
  },

  // Cập nhật bình luận
  updateComment: async (commentId, content, rating) => {
    const client = createGraphQLClient();
    const data = await client.request(UPDATE_COMMENT_MUTATION, {
      commentId,
      content,
      rating,
    });
    return data.updateComment;
  },

  // Xóa bình luận
  deleteComment: async (commentId) => {
    const client = createGraphQLClient();
    const data = await client.request(DELETE_COMMENT_MUTATION, { commentId });
    return data.deleteComment;
  },
};

export default cartAPI;
