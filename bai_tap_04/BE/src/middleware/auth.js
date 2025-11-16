require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const white_lists = ["/", "/register", "/login", "/forgot-password"];
  if (white_lists.find((item) => "/v1/api" + item === req.originalUrl)) {
    next();
  } else {
    if (req?.headers?.authorization?.split(" ")?.[1]) {
      const token = req.headers.authorization.split(" ")[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          email: decoded.email,
          name: decoded.name,
        };
        console.log(">>> decoded:", decoded);
        next();
      } catch (e) {
        return res.status(401).json({
          message: "Token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại",
        });
      }
    } else {
      return res.status(401).json({
        message: "Bạn chưa truyền access token ở header/ hoặc token bị hết hạn",
      });
    }
  }
};
module.exports = auth;
