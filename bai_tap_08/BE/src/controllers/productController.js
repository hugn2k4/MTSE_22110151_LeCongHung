const {
  listByCategory,
  getProductById,
  searchProducts,
  getSimilarProducts,
  getProductStatsService,
} = require("../services/productService");
const { recordProductViewService, getViewedProductsService } = require("../services/productViewService");

const getProducts = async (req, res) => {
  try {
    const { category, page, limit, cursor } = req.query;
    const data = await listByCategory(category, { page, limit, cursor });

    return res.status(200).json({ EC: 0, EM: "OK", data });
  } catch (e) {
    console.error(">>> Error getProducts:", e);
    return res.status(500).json({ EC: 1, EM: "Lỗi server" });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ EC: 1, EM: "Không tìm thấy sản phẩm" });
    }

    return res.status(200).json({ EC: 0, EM: "OK", data: product });
  } catch (e) {
    console.error(">>> Error getProductDetail:", e);
    return res.status(500).json({ EC: 1, EM: "Lỗi server" });
  }
};

/**
 * Advanced product search with fuzzy search and multiple filters
 * GET /api/products/search
 *
 * Query parameters:
 * - q: Search query (fuzzy search on name and description)
 * - category: Filter by category
 * - minPrice: Minimum price
 * - maxPrice: Maximum price
 * - minDiscount: Minimum discount percentage
 * - hasDiscount: Filter products with discount (true/false)
 * - minViews: Minimum views count
 * - minRating: Minimum rating
 * - inStock: Filter only in-stock products
 * - sortBy: Sort field (price, views, rating, discount, created_at)
 * - sortOrder: Sort order (asc, desc)
 * - page: Page number
 * - limit: Items per page
 */
const searchProductsController = async (req, res) => {
  try {
    const filters = {
      q: req.query.q,
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      minDiscount: req.query.minDiscount,
      hasDiscount: req.query.hasDiscount,
      minViews: req.query.minViews,
      minRating: req.query.minRating,
      inStock: req.query.inStock,
      sortBy: req.query.sortBy || "id",
      sortOrder: req.query.sortOrder || "DESC",
      page: req.query.page || 1,
      limit: req.query.limit || 12,
    };

    const data = await searchProducts(filters);

    return res.status(200).json({
      EC: 0,
      EM: "Tìm kiếm thành công",
      data,
    });
  } catch (e) {
    console.error(">>> Error searchProductsController:", e);
    return res.status(500).json({ EC: 1, EM: "Lỗi server" });
  }
};

// Lấy sản phẩm tương tự
const getSimilarProductsController = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit } = req.query;

    const products = await getSimilarProducts(parseInt(id), limit);

    return res.status(200).json({
      EC: 0,
      EM: "OK",
      data: products,
    });
  } catch (e) {
    console.error(">>> Error getSimilarProductsController:", e);
    return res.status(500).json({ EC: 1, EM: "Lỗi server" });
  }
};

// Ghi nhận lượt xem sản phẩm
const recordProductView = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;
    const sessionId = req.sessionID || req.headers["x-session-id"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    await recordProductViewService(parseInt(id), userId, sessionId, ipAddress);

    return res.status(200).json({
      EC: 0,
      EM: "Đã ghi nhận lượt xem",
    });
  } catch (e) {
    console.error(">>> Error recordProductView:", e);
    return res.status(500).json({ EC: 1, EM: "Lỗi server" });
  }
};

// Lấy danh sách sản phẩm đã xem
const getViewedProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;

    const result = await getViewedProductsService(userId, parseInt(page) || 1, parseInt(limit) || 12);

    return res.status(200).json(result);
  } catch (e) {
    console.error(">>> Error getViewedProducts:", e);
    return res.status(500).json({ EC: 1, EM: "Lỗi server" });
  }
};

// Lấy thống kê sản phẩm
const getProductStats = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getProductStatsService(parseInt(id));
    return res.status(200).json(result);
  } catch (e) {
    console.error(">>> Error getProductStats:", e);
    return res.status(500).json({ EC: 1, EM: "Lỗi server" });
  }
};

module.exports = {
  getProducts,
  getProductDetail,
  searchProductsController,
  getSimilarProductsController,
  recordProductView,
  getViewedProducts,
  getProductStats,
};
