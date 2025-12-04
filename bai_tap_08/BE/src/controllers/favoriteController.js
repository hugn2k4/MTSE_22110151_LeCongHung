const {
  addFavoriteService,
  removeFavoriteService,
  getFavoritesService,
  checkFavoriteService,
} = require("../services/favoriteService");

// Thêm sản phẩm vào yêu thích
const addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const result = await addFavoriteService(userId, productId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(">>> Error addFavorite:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
    });
  }
};

// Xóa sản phẩm khỏi yêu thích
const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await removeFavoriteService(userId, parseInt(productId));
    return res.status(200).json(result);
  } catch (error) {
    console.error(">>> Error removeFavorite:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
    });
  }
};

// Lấy danh sách yêu thích
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;

    const result = await getFavoritesService(userId, parseInt(page) || 1, parseInt(limit) || 12);
    return res.status(200).json(result);
  } catch (error) {
    console.error(">>> Error getFavorites:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
    });
  }
};

// Kiểm tra sản phẩm có được yêu thích không
const checkFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await checkFavoriteService(userId, parseInt(productId));
    return res.status(200).json(result);
  } catch (error) {
    console.error(">>> Error checkFavorite:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
    });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
};
