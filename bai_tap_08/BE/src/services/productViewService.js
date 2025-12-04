const { ProductView, Product, User } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

// Ghi nhận lượt xem sản phẩm
const recordProductViewService = async (productId, userId = null, sessionId = null, ipAddress = null) => {
  try {
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findByPk(productId);
    if (!product) {
      return {
        EC: 1,
        EM: "Sản phẩm không tồn tại",
      };
    }

    // Tạo record xem sản phẩm
    await ProductView.create({
      productId,
      userId,
      sessionId,
      ipAddress,
    });

    // Cập nhật views counter trong Product
    await Product.increment("views", { where: { id: productId } });

    return {
      EC: 0,
      EM: "Đã ghi nhận lượt xem",
    };
  } catch (error) {
    console.error(">>> Error recordProductViewService:", error);
    throw error;
  }
};

// Lấy danh sách sản phẩm đã xem của user
const getViewedProductsService = async (userId, page = 1, limit = 12) => {
  try {
    const offset = (page - 1) * limit;

    // Lấy danh sách sản phẩm đã xem (unique)
    const viewedProducts = await ProductView.findAll({
      where: { userId },
      attributes: [[fn("MAX", col("id")), "id"], "productId", [fn("MAX", col("created_at")), "lastViewed"]],
      group: ["productId"],
      order: [[fn("MAX", col("created_at")), "DESC"]],
      limit,
      offset,
      raw: true,
    });

    const productIds = viewedProducts.map((v) => v.productId);

    // Lấy thông tin chi tiết sản phẩm
    const products = await Product.findAll({
      where: { id: productIds },
    });

    // Map sản phẩm theo thứ tự đã xem
    const orderedProducts = productIds.map((id) => products.find((p) => p.id === id));

    // Đếm tổng số sản phẩm đã xem (unique)
    const totalCount = await ProductView.count({
      where: { userId },
      distinct: true,
      col: "productId",
    });

    return {
      EC: 0,
      EM: "Lấy danh sách sản phẩm đã xem thành công",
      data: {
        items: orderedProducts,
        total: totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error(">>> Error getViewedProductsService:", error);
    throw error;
  }
};

module.exports = {
  recordProductViewService,
  getViewedProductsService,
};
