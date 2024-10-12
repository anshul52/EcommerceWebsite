const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { INVALID_CREDENTAILS } = require("../config/errors");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth2 credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/auth/google/callback";

// sign up
const createUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;
    const user = await new User({ username, email, mobile, password });
    await user.save();

    res.status(201).send(user);
  } catch (err) {
    res.status(500).json(err);
    console.error(err);
  }
});

// sign in OR log in

const LoginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    const test = await foundUser.isPasswordMatched(password);
    console.log("test::", test);
    if (foundUser && (await foundUser.isPasswordMatched(password))) {
      res.status(200).send({
        message: "User Login Successful !",
        username: foundUser?.username,
        // password: foundUser?.password,
        mobile: foundUser?.mobile,
        token: generateToken(foundUser?._id),
        role: foundUser?.role,
      });
    } else {
      res.json({ message: INVALID_CREDENTAILS });
      throw new Error({ message: INVALID_CREDENTAILS });
    }
  } catch (err) {
    res.status(500).json(err);
    console.error(err);
  }
});

// google auth sign in / sign up
const googleAuthHandler = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("No authorization code found");
  }

  try {
    // Step 3: Exchange authorization code for access token and ID token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );

    const { id_token, access_token } = tokenResponse.data;

    // Step 4: Decode and verify the ID token
    const ticket = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`
    );
    const payload = ticket.data;

    // Check if user exists in the database
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        // googleId: payload.sub, // Google's unique user ID
        username: payload.name,
        email: payload.email,
        // avatar: payload.picture,
      });
      await user.save();
    }

    // Step 5: Create a JWT for your app
    const jwtToken = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 6: Redirect the user to the client app with the JWT token
    res.redirect(`http://localhost:3000?token=${jwtToken}`);
  } catch (error) {
    console.error("Error during token exchange:", error);
    res.status(500).send("Authentication failed");
  }
};

// -------------------------------------------------------------
// Get All Users

const GetAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
    console.error(err);
  }
});

// Get a single Users

const GetSingleUsers = asyncHandler(async (req, res) => {
  const userId = req.userId;
  try {
    const users = await User.findById(userId);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching Users" });
    console.error(err);
  }
});

module.exports = {
  createUser,
  LoginUser,
  GetAllUsers,
  GetSingleUsers,
  googleAuthHandler,
};
