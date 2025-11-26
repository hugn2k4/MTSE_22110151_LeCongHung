const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(500),
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      comment: "Discount percentage (0-100)",
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Number of product views",
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Available stock quantity",
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      comment: "Product rating (0-5)",
    },
  },
  {
    tableName: "products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Product;
