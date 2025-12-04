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

  # User type
  type User {
    id: Int!
    name: String!
    email: String!
  }

  # Comment type
  type Comment {
    id: Int!
    userId: Int!
    productId: Int!
    content: String!
    rating: Int
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  # Product Stats type
  type ProductStats {
    purchaseCount: Int!
    commentCount: Int!
    favoriteCount: Int!
  }

  # Response types for new features
  type ProductStatsResponse {
    EC: Int!
    EM: String
    data: ProductStats
  }

  type CommentsResponse {
    EC: Int!
    EM: String!
    data: CommentsPagination
  }

  type CommentsPagination {
    items: [Comment!]!
    total: Int!
    page: Int!
    totalPages: Int!
  }

  type CommentResponse {
    EC: Int!
    EM: String!
    data: Comment
  }

  type FavoriteResponse {
    EC: Int!
    EM: String!
  }

  type FavoritesResponse {
    EC: Int!
    EM: String!
    data: FavoritesPagination
  }

  type FavoritesPagination {
    items: [Product!]!
    total: Int!
    page: Int!
    totalPages: Int!
  }

  type CheckFavoriteResponse {
    EC: Int!
    data: CheckFavoriteData
  }

  type CheckFavoriteData {
    isFavorite: Boolean!
  }

  type ProductsResponse {
    EC: Int!
    EM: String!
    data: [Product!]
  }

  type ViewedProductsResponse {
    EC: Int!
    EM: String!
    data: ViewedProductsPagination
  }

  type ViewedProductsPagination {
    items: [Product!]!
    total: Int!
    page: Int!
    totalPages: Int!
  }

  # Input types for comments
  input AddCommentInput {
    productId: Int!
    content: String!
    rating: Int
  }

  input UpdateCommentInput {
    commentId: Int!
    content: String!
    rating: Int
  }

  # Queries
  type Query {
    # Xem giỏ hàng (yêu cầu authentication)
    getCart: CartResponse!

    # Lấy sản phẩm tương tự
    getSimilarProducts(productId: Int!, limit: Int): ProductsResponse!

    # Lấy thống kê sản phẩm
    getProductStats(productId: Int!): ProductStatsResponse!

    # Lấy bình luận của sản phẩm
    getProductComments(productId: Int!, page: Int, limit: Int): CommentsResponse!

    # Lấy danh sách yêu thích
    getFavorites(page: Int, limit: Int): FavoritesResponse!

    # Kiểm tra sản phẩm có được yêu thích không
    checkFavorite(productId: Int!): CheckFavoriteResponse!

    # Lấy danh sách sản phẩm đã xem
    getViewedProducts(page: Int, limit: Int): ViewedProductsResponse!
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

    # Thêm vào yêu thích
    addFavorite(productId: Int!): FavoriteResponse!

    # Xóa khỏi yêu thích
    removeFavorite(productId: Int!): FavoriteResponse!

    # Thêm bình luận
    addComment(input: AddCommentInput!): CommentResponse!

    # Cập nhật bình luận
    updateComment(input: UpdateCommentInput!): CommentResponse!

    # Xóa bình luận
    deleteComment(commentId: Int!): FavoriteResponse!

    # Ghi nhận lượt xem
    recordProductView(productId: Int!): FavoriteResponse!
  }
`;

module.exports = typeDefs;
