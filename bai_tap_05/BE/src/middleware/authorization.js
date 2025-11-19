// Middleware phân quyền dựa trên role
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Kiểm tra xem user đã được authenticated chưa
    if (!req.user) {
      return res.status(401).json({
        EC: 1,
        EM: "Bạn chưa đăng nhập, vui lòng đăng nhập để tiếp tục",
      });
    }

    // Kiểm tra role của user
    const userRole = req.user.role;

    if (!userRole) {
      return res.status(403).json({
        EC: 1,
        EM: "Không xác định được quyền của bạn",
      });
    }

    // Kiểm tra xem role của user có trong danh sách allowedRoles không
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        EC: 1,
        EM: `Bạn không có quyền truy cập tài nguyên này. Yêu cầu quyền: ${allowedRoles.join(" hoặc ")}`,
      });
    }

    // User có quyền, cho phép tiếp tục
    next();
  };
};

// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      EC: 1,
      EM: "Bạn chưa đăng nhập",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      EC: 1,
      EM: "Bạn không có quyền admin để thực hiện thao tác này",
    });
  }

  next();
};

// Middleware kiểm tra quyền user hoặc admin
const isUserOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      EC: 1,
      EM: "Bạn chưa đăng nhập",
    });
  }

  const allowedRoles = ["user", "admin"];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      EC: 1,
      EM: "Bạn không có quyền truy cập",
    });
  }

  next();
};

// Middleware kiểm tra quyền truy cập tài nguyên của chính user đó hoặc admin
const isSelfOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      EC: 1,
      EM: "Bạn chưa đăng nhập",
    });
  }

  const userId = req.params.id || req.body.id || req.query.id;

  // Admin có thể truy cập mọi tài nguyên
  if (req.user.role === "admin") {
    return next();
  }

  // User chỉ có thể truy cập tài nguyên của chính họ
  if (req.user.id && userId && req.user.id.toString() === userId.toString()) {
    return next();
  }

  return res.status(403).json({
    EC: 1,
    EM: "Bạn không có quyền truy cập tài nguyên của người khác",
  });
};

module.exports = {
  authorize,
  isAdmin,
  isUserOrAdmin,
  isSelfOrAdmin,
};
