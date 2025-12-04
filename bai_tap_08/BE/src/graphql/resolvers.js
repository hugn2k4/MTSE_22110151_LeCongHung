const {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeFromCartService,
  selectCartItemsService,
  checkoutService,
} = require("../services/cartService");
const { getSimilarProducts, getProductStatsService } = require("../services/productService");
const {
  addFavoriteService,
  removeFavoriteService,
  getFavoritesService,
  checkFavoriteService,
} = require("../services/favoriteService");
const {
  addCommentService,
  getProductCommentsService,
  deleteCommentService,
  updateCommentService,
} = require("../services/commentService");
const { recordProductViewService, getViewedProductsService } = require("../services/productViewService");

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

    // Lấy sản phẩm tương tự
    getSimilarProducts: async (parent, { productId, limit }, context) => {
      try {
        const products = await getSimilarProducts(productId, limit || 6);
        return {
          EC: 0,
          EM: "OK",
          data: products,
        };
      } catch (error) {
        console.error(">>> Error in getSimilarProducts resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi lấy sản phẩm tương tự",
          data: null,
        };
      }
    },

    // Lấy thống kê sản phẩm
    getProductStats: async (parent, { productId }, context) => {
      try {
        return await getProductStatsService(productId);
      } catch (error) {
        console.error(">>> Error in getProductStats resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi lấy thống kê sản phẩm",
          data: null,
        };
      }
    },

    // Lấy bình luận của sản phẩm
    getProductComments: async (parent, { productId, page, limit }, context) => {
      try {
        return await getProductCommentsService(productId, page || 1, limit || 10);
      } catch (error) {
        console.error(">>> Error in getProductComments resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi lấy bình luận",
          data: null,
        };
      }
    },

    // Lấy danh sách yêu thích
    getFavorites: async (parent, { page, limit }, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            EM: "Bạn cần đăng nhập",
            data: null,
          };
        }

        return await getFavoritesService(context.user.id, page || 1, limit || 12);
      } catch (error) {
        console.error(">>> Error in getFavorites resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi lấy danh sách yêu thích",
          data: null,
        };
      }
    },

    // Kiểm tra sản phẩm có được yêu thích không
    checkFavorite: async (parent, { productId }, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            data: { isFavorite: false },
          };
        }

        return await checkFavoriteService(context.user.id, productId);
      } catch (error) {
        console.error(">>> Error in checkFavorite resolver:", error);
        return {
          EC: 1,
          data: { isFavorite: false },
        };
      }
    },

    // Lấy danh sách sản phẩm đã xem
    getViewedProducts: async (parent, { page, limit }, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            EM: "Bạn cần đăng nhập",
            data: null,
          };
        }

        return await getViewedProductsService(context.user.id, page || 1, limit || 12);
      } catch (error) {
        console.error(">>> Error in getViewedProducts resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi lấy sản phẩm đã xem",
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

    // Thêm sản phẩm vào yêu thích
    addFavorite: async (parent, { productId }, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            EM: "Bạn cần đăng nhập",
            data: null,
          };
        }

        return await addFavoriteService(context.user.id, productId);
      } catch (error) {
        console.error(">>> Error in addFavorite resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi thêm vào yêu thích",
          data: null,
        };
      }
    },

    // Xóa sản phẩm khỏi yêu thích
    removeFavorite: async (parent, { productId }, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            EM: "Bạn cần đăng nhập",
            data: null,
          };
        }

        return await removeFavoriteService(context.user.id, productId);
      } catch (error) {
        console.error(">>> Error in removeFavorite resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi xóa khỏi yêu thích",
          data: null,
        };
      }
    },

    // Thêm bình luận
    addComment: async (parent, { productId, content, rating }, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            EM: "Bạn cần đăng nhập để bình luận",
            data: null,
          };
        }

        return await addCommentService(context.user.id, productId, content, rating);
      } catch (error) {
        console.error(">>> Error in addComment resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi thêm bình luận",
          data: null,
        };
      }
    },

    // Cập nhật bình luận
    updateComment: async (parent, { commentId, content, rating }, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            EM: "Bạn cần đăng nhập",
            data: null,
          };
        }

        return await updateCommentService(commentId, context.user.id, content, rating);
      } catch (error) {
        console.error(">>> Error in updateComment resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi cập nhật bình luận",
          data: null,
        };
      }
    },

    // Xóa bình luận
    deleteComment: async (parent, { commentId }, context) => {
      try {
        if (!context.user) {
          return {
            EC: 1,
            EM: "Bạn cần đăng nhập",
            data: null,
          };
        }

        return await deleteCommentService(commentId, context.user.id);
      } catch (error) {
        console.error(">>> Error in deleteComment resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi xóa bình luận",
          data: null,
        };
      }
    },

    // Ghi lại lượt xem sản phẩm
    recordProductView: async (parent, { productId }, context) => {
      try {
        const userId = context.user ? context.user.id : null;
        // sessionId và ipAddress sẽ được xử lý ở service layer
        return await recordProductViewService(productId, userId, null, null);
      } catch (error) {
        console.error(">>> Error in recordProductView resolver:", error);
        return {
          EC: 1,
          EM: "Lỗi khi ghi lại lượt xem",
          data: null,
        };
      }
    },
  },
};

module.exports = resolvers;
