const { listByCategory, getProductById } = require("../services/productService");

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

module.exports = {
  getProducts,
  getProductDetail,
};
