const User = require("./user");
const Product = require("./product");
const Cart = require("./cart");
const CartItem = require("./cartItem");
const Favorite = require("./favorite");
const ProductView = require("./productView");
const Comment = require("./comment");
const Purchase = require("./purchase");

// Thiết lập mối quan hệ giữa các models

// User - Cart (1:1)
User.hasOne(Cart, { foreignKey: "userId", as: "cart" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

// Cart - CartItem (1:N)
Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

// Product - CartItem (1:N)
Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// User - Favorite (N:M through Favorite)
User.belongsToMany(Product, {
  through: Favorite,
  foreignKey: "userId",
  otherKey: "productId",
  as: "favoriteProducts",
});
Product.belongsToMany(User, {
  through: Favorite,
  foreignKey: "productId",
  otherKey: "userId",
  as: "favoritedByUsers",
});

// Direct associations for Favorite
Favorite.belongsTo(User, { foreignKey: "userId", as: "user" });
Favorite.belongsTo(Product, { foreignKey: "productId", as: "product" });
User.hasMany(Favorite, { foreignKey: "userId", as: "favorites" });
Product.hasMany(Favorite, { foreignKey: "productId", as: "favorites" });

// User - ProductView (1:N)
User.hasMany(ProductView, { foreignKey: "userId", as: "productViews" });
ProductView.belongsTo(User, { foreignKey: "userId", as: "user" });

// Product - ProductView (1:N)
Product.hasMany(ProductView, { foreignKey: "productId", as: "viewRecords" });
ProductView.belongsTo(Product, { foreignKey: "productId", as: "product" });

// User - Comment (1:N)
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

// Product - Comment (1:N)
Product.hasMany(Comment, { foreignKey: "productId", as: "comments" });
Comment.belongsTo(Product, { foreignKey: "productId", as: "product" });

// User - Purchase (1:N)
User.hasMany(Purchase, { foreignKey: "userId", as: "purchases" });
Purchase.belongsTo(User, { foreignKey: "userId", as: "user" });

// Product - Purchase (1:N)
Product.hasMany(Purchase, { foreignKey: "productId", as: "purchases" });
Purchase.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = {
  User,
  Product,
  Cart,
  CartItem,
  Favorite,
  ProductView,
  Comment,
  Purchase,
};
