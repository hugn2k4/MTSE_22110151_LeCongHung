const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ProductView = sequelize.define(
  "ProductView",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
      comment: "Null if guest user",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "product_id",
      references: {
        model: "products",
        key: "id",
      },
    },
    sessionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "session_id",
      comment: "For tracking guest views",
    },
    ipAddress: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "ip_address",
    },
  },
  {
    tableName: "product_views",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["user_id", "product_id"],
      },
      {
        fields: ["session_id", "product_id"],
      },
    ],
  }
);

module.exports = ProductView;
