const { Comment, User, Product } = require("../models");
const { Op } = require("sequelize");

// Thêm bình luận
const addCommentService = async (userId, productId, content, rating = null) => {
  try {
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findByPk(productId);
    if (!product) {
      return {
        EC: 1,
        EM: "Sản phẩm không tồn tại",
      };
    }

    // Tạo comment
    const comment = await Comment.create({
      userId,
      productId,
      content,
      rating,
    });

    // Lấy thông tin comment với user
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // Cập nhật rating trung bình của sản phẩm nếu có rating
    if (rating) {
      await updateProductRating(productId);
    }

    return {
      EC: 0,
      EM: "Đã thêm bình luận",
      data: commentWithUser,
    };
  } catch (error) {
    console.error(">>> Error addCommentService:", error);
    throw error;
  }
};

// Cập nhật rating trung bình của sản phẩm
const updateProductRating = async (productId) => {
  try {
    const comments = await Comment.findAll({
      where: {
        productId,
        rating: { [Op.not]: null },
      },
      attributes: ["rating"],
    });

    if (comments.length > 0) {
      const avgRating = comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;
      await Product.update({ rating: avgRating }, { where: { id: productId } });
    }
  } catch (error) {
    console.error(">>> Error updateProductRating:", error);
  }
};

// Lấy danh sách bình luận của sản phẩm
const getProductCommentsService = async (productId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await Comment.findAndCountAll({
      where: { productId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return {
      EC: 0,
      EM: "Lấy danh sách bình luận thành công",
      data: {
        items: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.error(">>> Error getProductCommentsService:", error);
    throw error;
  }
};

// Xóa bình luận
const deleteCommentService = async (userId, commentId) => {
  try {
    const comment = await Comment.findOne({
      where: { id: commentId, userId },
    });

    if (!comment) {
      return {
        EC: 1,
        EM: "Không tìm thấy bình luận hoặc bạn không có quyền xóa",
      };
    }

    const productId = comment.productId;
    await comment.destroy();

    // Cập nhật lại rating
    await updateProductRating(productId);

    return {
      EC: 0,
      EM: "Đã xóa bình luận",
    };
  } catch (error) {
    console.error(">>> Error deleteCommentService:", error);
    throw error;
  }
};

// Cập nhật bình luận
const updateCommentService = async (userId, commentId, content, rating = null) => {
  try {
    const comment = await Comment.findOne({
      where: { id: commentId, userId },
    });

    if (!comment) {
      return {
        EC: 1,
        EM: "Không tìm thấy bình luận hoặc bạn không có quyền sửa",
      };
    }

    comment.content = content;
    if (rating !== null) {
      comment.rating = rating;
    }
    await comment.save();

    // Cập nhật rating
    if (rating !== null) {
      await updateProductRating(comment.productId);
    }

    // Lấy lại comment với user info
    const updatedComment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return {
      EC: 0,
      EM: "Đã cập nhật bình luận",
      data: updatedComment,
    };
  } catch (error) {
    console.error(">>> Error updateCommentService:", error);
    throw error;
  }
};

module.exports = {
  addCommentService,
  getProductCommentsService,
  deleteCommentService,
  updateCommentService,
};
