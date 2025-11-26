const Joi = require("joi");

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    "string.empty": "Tên không được để trống",
    "string.min": "Tên phải có ít nhất 3 ký tự",
    "string.max": "Tên không được vượt quá 255 ký tự",
    "any.required": "Tên là bắt buộc",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email không được để trống",
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.empty": "Password không được để trống",
    "string.min": "Password phải có ít nhất 6 ký tự",
    "string.max": "Password không được vượt quá 100 ký tự",
    "any.required": "Password là bắt buộc",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email không được để trống",
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password không được để trống",
    "any.required": "Password là bắt buộc",
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email không được để trống",
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional().messages({
    "string.min": "Tên phải có ít nhất 3 ký tự",
    "string.max": "Tên không được vượt quá 255 ký tự",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Email không hợp lệ",
  }),
  role: Joi.string().valid("user", "admin").optional().messages({
    "any.only": "Role chỉ có thể là user hoặc admin",
  }),
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message,
      }));

      return res.status(400).json({
        EC: 1,
        EM: "Dữ liệu đầu vào không hợp lệ",
        errors: errors,
      });
    }

    // Replace req.body with validated value
    req.body = value;
    next();
  };
};

module.exports = {
  registerValidation: validate(registerSchema),
  loginValidation: validate(loginSchema),
  forgotPasswordValidation: validate(forgotPasswordSchema),
  updateUserValidation: validate(updateUserSchema),
};
