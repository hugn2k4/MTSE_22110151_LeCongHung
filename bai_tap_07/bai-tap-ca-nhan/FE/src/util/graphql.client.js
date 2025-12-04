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

export default cartAPI;
