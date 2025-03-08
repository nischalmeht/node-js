const Joi = require("joi");

const ValidatorSchema = Joi.object({
    username: Joi.string().min(3).max(50).trim().required()
    .messages({
      "string.empty": "Name is required.",
      "string.min": "Name must be at least 3 characters.",
      "string.max": "Name cannot exceed 50 characters."
    }),

  email: Joi.string().email().lowercase().trim().required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Email must be a valid email address."
    }),

  password: Joi.string()
    .min(8) // Minimum 8 characters
    .max(30) // Maximum 30 characters
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .required()
    .messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters.",
      "string.max": "Password cannot exceed 30 characters.",
      "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    }),
});

const validatelogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};
module.exports = {ValidatorSchema,validatelogin};
