require("dotenv").config();

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const createUserService = async (name, email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      console.log(`>>> user exist, chọn 1 email khác: ${email}`);
      return {
        EC: 1,
        EM: "Email đã tồn tại trong hệ thống",
      };
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    let result = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
    return {
      EC: 0,
      EM: "Tạo user thành công",
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
      },
    };
  } catch (e) {
    console.error(">>> Error createUserService:", e);
    throw e;
  }
};

const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: "Email/Password không hợp lệ",
        };
      } else {
        const payload = {
          email: user.email,
          name: user.name,
        };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        return {
          EC: 0,
          id: user.id,
          access_token,
          user: {
            name: user.name,
            email: user.email,
          },
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email/Password không hợp lệ",
      };
    }
  } catch (e) {
    console.error(">>> Error loginService:", e);
    throw e;
  }
};

const forgotPasswordService = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return {
        EC: 1,
        EM: "Email không tồn tại trong hệ thống",
      };
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

    // Update user password
    await User.update({ password: hashedPassword }, { where: { email } });

    // In production, you should send this via email
    console.log(`Temporary password for ${email}: ${tempPassword}`);

    return {
      EC: 0,
      EM: "Mật khẩu mới đã được tạo. Vui lòng kiểm tra console (trong thực tế sẽ gửi qua email)",
      tempPassword: tempPassword, // Remove this in production
    };
  } catch (e) {
    console.error(">>> Error forgotPasswordService:", e);
    throw e;
  }
};

const getUserService = async () => {
  try {
    let result = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    return result;
  } catch (e) {
    console.error(">>> Error getUserService:", e);
    throw e;
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
  forgotPasswordService,
};
