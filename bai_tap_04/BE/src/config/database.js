<<<<<<< HEAD
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const dbState = [
  {
    value: 0,
    label: "Disconnected",
  },
  {
    value: 1,
    label: "Connected",
  },
  {
    value: 2,
    label: "Connecting",
  },
  {
    value: 3,
    label: "Disconnecting",
  },
];

const connection = async () => {
  await mongoose.connect(process.env.MONGO_DB_URL);
  const state = Number(mongoose.connection.readyState);
  console.log(dbState.find((f) => f.value === state).label, "to database");
};
module.exports = connection;
=======
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");

    // Sync all models with database (alter: true will modify existing tables)
    await sequelize.sync({ alter: true });
    console.log("Database synced");

    return sequelize;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

module.exports = connection;
module.exports.sequelize = sequelize;
>>>>>>> bai_tap_ca_nhan/bai_4
