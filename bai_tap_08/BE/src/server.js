require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const configureViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/api");
const connection = require("./config/database");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const { getHomepage } = require("./controllers/homeController");

const app = express();

const port = process.env.PORT || 8080;

// ========== LỚP BẢO MẬT 1: HELMET - Bảo vệ các HTTP headers ==========
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: "10mb" })); // Giới hạn kích thước request body
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// View engine
configureViewEngine(app);

// Web routes
const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use("/", webAPI);

// API routes với đầy đủ 4 lớp bảo mật:
// 1. Input Validation (express-validation + Joi)
// 2. Rate Limiting (express-rate-limit)
// 3. Authentication (JWT)
// 4. Authorization (Role-based)
app.use("/v1/api/", apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(">>> Server Error:", err);
  res.status(err.status || 500).json({
    EC: 1,
    EM: err.message || "Lỗi server không xác định",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    EC: 1,
    EM: "Không tìm thấy đường dẫn này",
  });
});

// Start server with Apollo Server
(async () => {
  try {
    await connection();

    // Khởi tạo các models với relationships
    require("./models");

    // Tạo Apollo Server
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        // Lấy token từ header
        const authHeader = req.headers.authorization || "";
        let user = null;

        if (authHeader.startsWith("Bearer ")) {
          const token = authHeader.split(" ")[1];
          try {
            user = jwt.verify(token, process.env.JWT_SECRET);
          } catch (error) {
            console.error(">>> GraphQL JWT verification error:", error.message);
          }
        }

        return { user };
      },
      formatError: (error) => {
        console.error(">>> GraphQL Error:", error);
        return error;
      },
    });

    // Start Apollo Server
    await apolloServer.start();

    // Apply Apollo middleware
    apolloServer.applyMiddleware({
      app,
      path: "/graphql",
      cors: corsOptions,
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`GraphQL endpoint: http://localhost:${port}${apolloServer.graphqlPath}`);
      console.log("========================================");
      console.log("Security Layers Activated:");
      console.log("✓ Layer 1: Input Validation (Joi)");
      console.log("✓ Layer 2: Rate Limiting (express-rate-limit)");
      console.log("✓ Layer 3: Authentication (JWT)");
      console.log("✓ Layer 4: Authorization (Role-based Access Control)");
      console.log("✓ Additional: Helmet for HTTP headers security");
      console.log("✓ GraphQL API with Authentication");
      console.log("========================================");
    });
  } catch (e) {
    console.error(">>> Error connect to DB:", e);
  }
})();
