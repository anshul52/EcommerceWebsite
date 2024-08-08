const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");
const { JWT_EXPIRED_ERR } = require("./errors");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

const VerifyJwtToken = (token, next) => {
  try {
    var user = jwt.verify(token, JWT_SECRET);
    console.log(user);
    return user?.id;
  } catch (error) {
    next({ status: 401, message: JWT_EXPIRED_ERR });
  }
};

module.exports = { generateToken, VerifyJwtToken };
