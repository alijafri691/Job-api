const jwt = require("jsonwebtoken");
const HttpError = require("../models/httpError");
module.exports = (req, res, next) => {
  try {
    const token = req.get("Authorization").split(" ")[1];
    if (!token) {
      throw new Error("error");
    }
    const decode_Token = jwt.verify(token, process.env.MY_SCERET);

    req.userData = { userId: decode_Token.userId, email: decode_Token.email };

    next();
  } catch (err) {
    const error = new HttpError("Authorization Fail", 401);
    return next(error);
  }
};
