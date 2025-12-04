const { Favorite, Product, User } = require("../models");
const { Op } = require("sequelize");

// Thêm sản phẩm vào yêu thích
const addFavoriteService = async (userId, productId) => {
  try {
    // Kiểm tra sản phẩm có tồn tại
    const product = await Product.findByPk(productId);
    if (!product) {
      return {
        EC: 1,
        EM: "Sản phẩm không tồn tại",
      };
    }

    // Kiểm tra đã yêu thích chưa
    const existing = await Favorite.findOne({
      where: { userId, productId },
    });

    if (existing) {
      return {
        EC: 2,
        EM: "Sản phẩm đã có trong danh sách yêu thích",
      };
    }

    // Thêm vào yêu thích
    await Favorite.create({ userId, productId });

    return {
      EC: 0,
      EM: "Đã thêm vào danh sách yêu thích",
    };
  } catch (error) {
    console.error(">>> Error addFavoriteService:", error);
    throw error;
  }
};

// Xóa sản phẩm khỏi yêu thích
const removeFavoriteService = async (userId, productId) => {
  try {
    const favorite = await Favorite.findOne({
      where: { userId, productId },
    });

    if (!favorite) {
      return {
        EC: 1,
        EM: "Sản phẩm không có trong danh sách yêu thích",
      };
    }

    await favorite.destroy();

    return {
      EC: 0,
      EM: "Đã xóa khỏi danh sách yêu thích",
    };
  } catch (error) {
    console.error(">>> Error removeFavoriteService:", error);
    throw error;
  }
};

// Lấy danh sách sản phẩm yêu thích
const getFavoritesService = async (userId, page = 1, limit = 12) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await Favorite.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return {
      EC: 0,
      EM: "Lấy danh sách yêu thích thành công",
      data: {
        items: rows.map((fav) => fav.product),
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.error(">>> Error getFavoritesService:", error);
    throw error;
  }
};

// Kiểm tra sản phẩm có được yêu thích không
const checkFavoriteService = async (userId, productId) => {
  try {
    const favorite = await Favorite.findOne({
      where: { userId, productId },
    });

    return {
      EC: 0,
      data: {
        isFavorite: !!favorite,
      },
    };
  } catch (error) {
    console.error(">>> Error checkFavoriteService:", error);
    throw error;
  }
};

module.exports = {
  addFavoriteService,
  removeFavoriteService,
  getFavoritesService,
  checkFavoriteService,
};
