const {
  addCommentService,
  getProductCommentsService,
  deleteCommentService,
  updateCommentService,
} = require("../services/commentService");

// Thêm bình luận
const addComment = async (req, res) => {
  try {
    const { productId, content, rating } = req.body;
    const userId = req.user.id;

    const result = await addCommentService(userId, productId, content, rating);
    return res.status(200).json(result);
  } catch (error) {
    console.error(">>> Error addComment:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
    });
  }
};

// Lấy bình luận của sản phẩm
const getProductComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page, limit } = req.query;

    const result = await getProductCommentsService(parseInt(productId), parseInt(page) || 1, parseInt(limit) || 10);
    return res.status(200).json(result);
  } catch (error) {
    console.error(">>> Error getProductComments:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
    });
  }
};

// Xóa bình luận
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const result = await deleteCommentService(userId, parseInt(commentId));
    return res.status(200).json(result);
  } catch (error) {
    console.error(">>> Error deleteComment:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
    });
  }
};

// Cập nhật bình luận
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;

    const result = await updateCommentService(userId, parseInt(commentId), content, rating);
    return res.status(200).json(result);
  } catch (error) {
    console.error(">>> Error updateComment:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
    });
  }
};

module.exports = {
  addComment,
  getProductComments,
  deleteComment,
  updateComment,
};
