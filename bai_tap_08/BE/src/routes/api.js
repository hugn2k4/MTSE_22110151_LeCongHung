const express = require("express");
const { createUser, handleLogin, getUser, getAccount, forgotPassword } = require("../controllers/userController");
const {
  getProducts,
  getProductDetail,
  searchProductsController,
  getSimilarProductsController,
  recordProductView,
  getViewedProducts,
  getProductStats,
} = require("../controllers/productController");
const { addFavorite, removeFavorite, getFavorites, checkFavorite } = require("../controllers/favoriteController");
const { addComment, getProductComments, deleteComment, updateComment } = require("../controllers/commentController");
const auth = require("../middleware/authenticate");
const delay = require("../middleware/delay");
const { isAdmin, isUserOrAdmin } = require("../middleware/authorize");
const { registerValidation, loginValidation, forgotPasswordValidation } = require("../validations/userValidation");
const { generalLimiter, authLimiter, forgotPasswordLimiter, strictLimiter } = require("../middleware/rateLimiter");

const routerAPI = express.Router();

// Áp dụng rate limiter chung cho tất cả các routes
routerAPI.use(generalLimiter);

// Routes công khai (không cần authentication)
routerAPI.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello world api",
    security:
      "This API is protected with 4 layers: Input Validation, Rate Limiting, Authentication (JWT), Authorization (Role-based)",
  });
});

// Public products endpoint (supports `category`, `page`, `limit`, `cursor`)
routerAPI.get("/products/search", searchProductsController);
routerAPI.get("/products", getProducts);
routerAPI.get("/products/:id", getProductDetail);
routerAPI.get("/products/:id/similar", getSimilarProductsController);
routerAPI.get("/products/:id/stats", getProductStats);
routerAPI.get("/products/:id/comments", getProductComments);
routerAPI.post("/products/:id/view", recordProductView);

// Authentication endpoints - có validation và rate limiting nghiêm ngặt
routerAPI.post("/register", authLimiter, registerValidation, createUser);
routerAPI.post("/login", authLimiter, loginValidation, handleLogin);
routerAPI.post("/forgot-password", forgotPasswordLimiter, forgotPasswordValidation, forgotPassword);

// Áp dụng authentication middleware cho các routes bên dưới
routerAPI.use(auth);

// Routes yêu cầu authentication và authorization
// GET /user - Chỉ admin mới xem được danh sách tất cả users
routerAPI.get("/user", strictLimiter, isAdmin, getUser);

// GET /account - User và admin đều có thể xem thông tin tài khoản của mình
routerAPI.get("/account", delay, isUserOrAdmin, getAccount);

// Favorites routes
routerAPI.post("/favorites", addFavorite);
routerAPI.delete("/favorites/:productId", removeFavorite);
routerAPI.get("/favorites", getFavorites);
routerAPI.get("/favorites/check/:productId", checkFavorite);

// Viewed products
routerAPI.get("/viewed-products", getViewedProducts);

// Comments routes
routerAPI.post("/comments", addComment);
routerAPI.delete("/comments/:commentId", deleteComment);
routerAPI.put("/comments/:commentId", updateComment);

module.exports = routerAPI;
