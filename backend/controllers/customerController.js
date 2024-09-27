const Customer = require("../models/customerSchema.js");
const { generateToken } = require("../config/jwtToken.js");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");

// Google OAuth2 credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/auth/google/callback";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const customerRegister = async (req, res) => {
  try {
    console.log("req.body::", req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const customer = new Customer({
      ...req.body,
      password: hashedPass,
    });

    const existingcustomerByEmail = await Customer.findOne({
      email: req.body.email,
    });

    if (existingcustomerByEmail) {
      res.send({ message: "Email already exists" });
    } else {
      let result = await customer.save();
      result.password = undefined;

      const token = generateToken(result._id);

      result = {
        ...result._doc,
        token: token,
      };

      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
const customerLogIn = async (req, res) => {
  if (req.body.email && req.body.password) {
    let customer = await Customer.findOne({ email: req.body.email });
    if (customer) {
      const validated = await bcrypt.compare(
        req.body.password,
        customer.password
      );
      if (validated) {
        customer.password = undefined;

        const token = generateToken(customer._id);

        customer = {
          ...customer._doc,
          token: token,
        };

        res.send(customer);
      } else {
        res.send({ message: "Invalid password" });
      }
    } else {
      res.send({ message: "User not found" });
    }
  } else {
    res.send({ message: "Email and password are required" });
  }
};

// google auth sign in / sign up
const googleAuthHandler = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({
      success: false,
      message: "No credential (ID token) found",
    });
  }

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("payload::", payload);

    // Check if the user already exists in the database
    let user = await Customer.findOne({ email: payload.email });
    if (!user) {
      // If user doesn't exist, create a new customer
      user = new Customer({
        name: payload.name,
        email: payload.email,
      });
      await user.save();
      console.log("New user created:", user);
    } else {
      console.log("Existing user found:", user);
    }

    // Generate a JWT token
    const token = generateToken(user._id);
    const resultss = {
      ...user._doc,
      token,
    };
    // Send success response with JWT and user details
    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      resultss,
    });
  } catch (error) {
    console.error("Error during token exchange:", error);

    // Handle Google verification errors
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID token",
      });
    }

    // Handle all other errors
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error.message || "Internal server error",
    });
  }
};

module.exports = {
  customerRegister,
  customerLogIn,
  googleAuthHandler,
  //   getCartDetail,
  //   cartUpdate,
};
