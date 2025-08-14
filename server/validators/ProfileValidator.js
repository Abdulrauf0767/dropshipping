// validators/ProfileUpdateValidator.js
const { check } = require("express-validator");

const ProfileUpdateValidator = [
  check("name")
    .optional()
    .notEmpty().withMessage("Name cannot be empty")
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long")
    .trim().escape(),

  check("email")
    .optional()
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  check("password")
    .optional()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .trim().escape(),

  check("bio")
    .optional()
    .isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters")
    .trim().escape(),

  check("phone")
    .optional()
    .matches(/^[0-9]{10,15}$/).withMessage("Phone must be 10–15 digits"),

  check("address")
    .optional()
    .isLength({ min: 5 }).withMessage("Address must be at least 5 characters long")
    .trim().escape(),

  check("gender")
    .optional()
    .isIn(["male", "female", "other"]).withMessage("Gender must be male, female, or other"),

  check("age")
    .optional()
    .isInt({ min: 0, max: 120 }).withMessage("Age must be between 0 and 120"),
];

module.exports = ProfileUpdateValidator;
