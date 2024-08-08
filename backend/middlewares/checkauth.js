const { VerifyJwtToken } = require("../config/jwtToken");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const User = require("../models/user.model");
const {
  AUTH_HEADER_MISSING_ERR,
  AUTH_TOKEN_MISSING_ERR,
  JWT_DECODE_ERR,
  USER_NOT_FOUND_ERR,
} = require("../config/errors");

const rateLimiter = new RateLimiterMemory({
  points: 15,
  duration: 60,
});

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    // check for auth header from client
    if (!header) {
      return res
        .status(403)
        .json({ status: 403, message: AUTH_HEADER_MISSING_ERR });
    }
    console.log("header:::", header);
    // verify  auth token
    const token = header.split("Bearer ")[1];
    if (!token) {
      next({ status: 401, message: AUTH_TOKEN_MISSING_ERR });
      return;
    }
    console.log("token:::", token);
    const userId = VerifyJwtToken(token, next);
    if (!userId) {
      next({ status: 401, message: JWT_DECODE_ERR });
      return;
    }
    const user = await User.findById(userId);
    console.log("user:::", user);
    if (!user) {
      next({ status: 404, message: USER_NOT_FOUND_ERR });
      return;
    }
    try {
      await rateLimiter.consume(user._id.toString());
      req.userId = user?._id;
      next();
    } catch (rateLimiterRes) {
      res.status(429).json({
        message: "You have exceeded the 5 requests in a minute limit!",
        code: 429,
        data: { rateLimit: "Exceeded" },
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};
