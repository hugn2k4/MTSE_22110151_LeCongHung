const { gql } = require("apollo-server-express");

const typeDefs = gql`
  # Product type
  type Product {
    id: Int!
    name: String!
    description: String
    price: Float!
    category: String!
    image: String
    discount: Float
    views: Int
    stock: Int
    rating: Float
  }

  # CartItem type
  type CartItem {
    id: Int!
    cartId: Int!
    productId: Int!
    quantity: Int!
    selected: Boolean!
    product: Product!
    createdAt: String!
    updatedAt: String!
  }

  # Cart type
  type Cart {
    id: Int!
    userId: Int!
    items: [CartItem!]!
    totalItems: Int!
    totalPrice: Float!
    selectedTotalPrice: Float!
    createdAt: String!
    updatedAt: String!
  }

  # Response types
  type CartResponse {
    EC: Int!
    EM: String!
    data: Cart
  }

  type CartItemResponse {
    EC: Int!
    EM: String!
    data: CartItem
  }

  type DeleteResponse {
    EC: Int!
    EM: String!
  }

  type CheckoutResponse {
    EC: Int!
    EM: String!
    data: CheckoutData
  }

  type CheckoutData {
    selectedItems: [CartItem!]!
    totalAmount: Float!
    itemCount: Int!
  }

  # Input types
  input AddToCartInput {
    productId: Int!
    quantity: Int!
  }

  input UpdateCartItemInput {
    cartItemId: Int!
    quantity: Int!
  }

  input SelectCartItemsInput {
    cartItemIds: [Int!]!
    selected: Boolean!
  }

  # Queries
  type Query {
    # Xem giỏ hàng (yêu cầu authentication)
    getCart: CartResponse!
  }

  # Mutations
  type Mutation {
    # Thêm sản phẩm vào giỏ hàng
    addToCart(input: AddToCartInput!): CartItemResponse!

    # Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartItem(input: UpdateCartItemInput!): CartItemResponse!

    # Xóa sản phẩm khỏi giỏ hàng
    removeFromCart(cartItemId: Int!): DeleteResponse!

    # Chọn/bỏ chọn sản phẩm để thanh toán
    selectCartItems(input: SelectCartItemsInput!): CartResponse!

    # Thanh toán các sản phẩm đã chọn
    checkout: CheckoutResponse!
  }
`;

module.exports = typeDefs;
