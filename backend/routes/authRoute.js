// const router = require("express").Router();
// const {
//   createUser,
//   LoginUser,
//   GetAllUsers,
//   GetSingleUsers,
// } = require("../controllers/userCtrl");
// const checkauth = require("../middlewares/checkauth");
// const API_VERSION = process.env.API_VERSION;

// // get api for check
// router.get("/", (req, res) => {
//   res.json({ name: "anshul", role: "mern stack dev" });
// });

// // sign up api
// router.post(API_VERSION + "/signup", createUser);

// // sign in OR log in
// router.post(API_VERSION + "/login", LoginUser);

// // get all user
// router.get(API_VERSION + "/get-all-user", GetAllUsers);

// // get single user
// router.get(API_VERSION + "/user", checkauth, GetSingleUsers);

// // Customer
// // router.post(API_VERSION + "/CustomerRegister", customerRegister);
// // router.post(API_VERSION + "/CustomerLogin", customerLogIn);
// // router.get(API_VERSION + "/getCartDetail/:id", getCartDetail);
// // router.put(API_VERSION + "/CustomerUpdate/:id", cartUpdate);

// module.exports = router;
