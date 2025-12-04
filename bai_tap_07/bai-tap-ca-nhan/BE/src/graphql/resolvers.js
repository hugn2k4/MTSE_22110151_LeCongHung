const {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeFromCartService,
  selectCartItemsService,
  checkoutService,
} = require("../services/cartService");

const resolvers = {
  Query: {
    // Lấy giỏ hàng (yêu cầu authentication)
    getCart: async (parent, args, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            EM: "Bạn cần đăng nhập để xem giỏ hàng",
            data: null,
          };
        }

        return await getCartService(context.user.id);
      } catch (error) {
        console.error(">>> Error in getCart resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi lấy giỏ hàng",
          data: null,
        };
      }
    },
  },

  Mutation: {
    // Thêm sản phẩm vào giỏ hàng
    addToCart: async (parent, { input }, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            EM: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng",
            data: null,
          };
        }

        const { productId, quantity } = input;

        if (quantity < 1) {
          return {
            EC: 1,
            EM: "Số lượng phải lớn hơn 0",
            data: null,
          };
        }

        return await addToCartService(context.user.id, productId, quantity);
      } catch (error) {
        console.error(">>> Error in addToCart resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi thêm sản phẩm vào giỏ hàng",
          data: null,
        };
      }
    },

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartItem: async (parent, { input }, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            EM: "Bạn cần đăng nhập để cập nhật giỏ hàng",
            data: null,
          };
        }

        const { cartItemId, quantity } = input;

        if (quantity < 1) {
          return {
            EC: 1,
            EM: "Số lượng phải lớn hơn 0",
            data: null,
          };
        }

        return await updateCartItemService(context.user.id, cartItemId, quantity);
      } catch (error) {
        console.error(">>> Error in updateCartItem resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi cập nhật giỏ hàng",
          data: null,
        };
      }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: async (parent, { cartItemId }, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            EM: "Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng",
          };
        }

        return await removeFromCartService(context.user.id, cartItemId);
      } catch (error) {
        console.error(">>> Error in removeFromCart resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi xóa sản phẩm khỏi giỏ hàng",
        };
      }
    },

    // Chọn/bỏ chọn sản phẩm để thanh toán
    selectCartItems: async (parent, { input }, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            EM: "Bạn cần đăng nhập để chọn sản phẩm",
            data: null,
          };
        }

        const { cartItemIds, selected } = input;

        if (!cartItemIds || cartItemIds.length === 0) {
          return {
            EC: 1,
            EM: "Vui lòng chọn ít nhất một sản phẩm",
            data: null,
          };
        }

        return await selectCartItemsService(context.user.id, cartItemIds, selected);
      } catch (error) {
        console.error(">>> Error in selectCartItems resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi chọn sản phẩm",
          data: null,
        };
      }
    },

    // Thanh toán các sản phẩm đã chọn
    checkout: async (parent, args, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            EM: "Bạn cần đăng nhập để thanh toán",
            data: null,
          };
        }

        return await checkoutService(context.user.id);
      } catch (error) {
        console.error(">>> Error in checkout resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi thanh toán",
          data: null,
        };
      }
    },
  },
};

module.exports = resolvers;
