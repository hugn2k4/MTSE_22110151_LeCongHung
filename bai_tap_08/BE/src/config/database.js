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
    try {
      await sequelize.sync({ alter: true });
      console.log("Database synced");
    } catch (syncError) {
      console.warn("Database sync warning (non-critical):", syncError.message);
      // Continue even if sync fails - tables might already exist
    }

    return sequelize;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

module.exports = connection;
module.exports.sequelize = sequelize;
