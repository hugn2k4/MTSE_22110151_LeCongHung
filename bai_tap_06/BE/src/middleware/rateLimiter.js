const rateLimit = require("express-rate-limit");

// Rate limiter chung cho tất cả API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 request mỗi windowMs
  message: {
    EC: 1,
    EM: "Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter nghiêm ngặt cho authentication endpoints (login, register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Giới hạn 5 request mỗi windowMs
  skipSuccessfulRequests: false, // Không bỏ qua request thành công
  message: {
    EC: 1,
    EM: "Quá nhiều lần đăng nhập/đăng ký từ IP này, vui lòng thử lại sau 15 phút",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho forgot password endpoint
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 3, // Giới hạn 3 request mỗi giờ
  skipSuccessfulRequests: false,
  message: {
    EC: 1,
    EM: "Quá nhiều yêu cầu khôi phục mật khẩu, vui lòng thử lại sau 1 giờ",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho các API cần bảo vệ đặc biệt (admin operations)
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 20, // Giới hạn 20 request mỗi windowMs
  message: {
    EC: 1,
    EM: "Quá nhiều request, vui lòng thử lại sau 15 phút",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  forgotPasswordLimiter,
  strictLimiter,
};
