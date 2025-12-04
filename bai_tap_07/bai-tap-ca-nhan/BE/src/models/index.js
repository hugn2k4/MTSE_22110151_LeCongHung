const User = require("./user");
const Product = require("./product");
const Cart = require("./cart");
const CartItem = require("./cartItem");

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

module.exports = {
  User,
  Product,
  Cart,
  CartItem,
};
