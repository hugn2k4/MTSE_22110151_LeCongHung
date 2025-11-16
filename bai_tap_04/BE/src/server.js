require("dotenv").config();

const express = require("express");
const configureViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/api");
const connection = require("./config/database");

const { getHomepage } = require("./controllers/homeController");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configureViewEngine(app);

const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use("/", webAPI);

app.use("/v1/api/", apiRoutes);
(async () => {
  try {
    await connection();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (e) {
    console.error(">>> Error connect to DB:", e);
  }
})();
