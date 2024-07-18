const express = require("express");

const { check } = require("express-validator");

const authController = require("../controllers/auth-controller");

const router = express.Router();

router.post(
  "/register",
  [
    check("name").notEmpty().withMessage("Name is required"),

    check("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 character long"),

    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email address"),
  ],

  authController.register
);

router.post(
  "/login",
  [
    check("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 character long"),

    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email address"),
  ],

  authController.login
);

module.exports = router;
