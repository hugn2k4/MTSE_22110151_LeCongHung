import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import connect from "./config/configdb.js";
import viewEngine from "./config/viewEngine.js";
import initWebRoutes from "./route/web.js";

dotenv.config();

const app = express();

// config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
viewEngine(app);
initWebRoutes(app);
connect();

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Backend nodejs is running on the port: " + port);
});
