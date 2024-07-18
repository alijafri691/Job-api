const User = require("../models/User");
const HttpError = require("../models/httpError");

const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");

exports.register = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError(error.array()[0].msg, 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Registering up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User exist already,Please login instead", 422);
    return next(error);
  }

  const hashPassword = await bycrypt.hash(password, 12);

  const newUser = new User({
    name,
    email,
    password: hashPassword,
  });

  let user;

  try {
    user = await newUser.save();
  } catch (err) {
    const error = new HttpError(err.message, 500);
    return next(error);
  }

  let token;

  token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.MY_SCERET,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({ userId: user.id, email: user.email, token: token });
};

exports.login = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError(error.array()[0].msg, 422));
  }
  const { email, password } = req.body;

  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login Failed Please try again later", 500);
    return next(error);
  }

  if (!user) {
    return next(
      new HttpError(
        "Invalid credentials Please enter right email and password",
        403
      )
    );
  }

  let isMatch;

  try {
    isMatch = await bycrypt.compare(password, user.password);
  } catch (err) {
    return next(
      new HttpError(
        "Could not log you in please check your crediential and try again later",
        500
      )
    );
  }
  if (!isMatch) {
    return next(new HttpError("Invalid crediential Could not log you in", 401));
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        token: token,
      },
      process.env.MY_SCERET,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    return next(new HttpError("Could not Login please try again later", 500));
  }

  res
    .status(200)
    .json({ user: { userId: user.id, email: user.email, token: token } });
};
