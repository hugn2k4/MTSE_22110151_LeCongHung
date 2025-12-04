require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const white_lists = ["/", "/register", "/login", "/forgot-password"];

  // Kiểm tra xem URL có trong white list không
  if (white_lists.find((item) => "/v1/api" + item === req.originalUrl)) {
    return next();
  }

  // Kiểm tra header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      EC: 1,
      EM: "Bạn chưa truyền access token ở header hoặc token không đúng định dạng (Bearer token)",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      EC: 1,
      EM: "Token không hợp lệ",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lưu thông tin user vào request để sử dụng ở các middleware/controller tiếp theo
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };

    console.log(">>> JWT decoded:", decoded);
    next();
  } catch (error) {
    console.error(">>> JWT verification error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        EC: 1,
        EM: "Token đã hết hạn, vui lòng đăng nhập lại",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        EC: 1,
        EM: "Token không hợp lệ, vui lòng đăng nhập lại",
      });
    }

    return res.status(401).json({
      EC: 1,
      EM: "Lỗi xác thực token, vui lòng đăng nhập lại",
    });
  }
};

module.exports = auth;
