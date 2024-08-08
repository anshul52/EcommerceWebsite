const bcrypt = require("bcrypt");
const Seller = require("../models/sellerSchema");
const { generateToken } = require("../config/jwtToken.js");

const sellerRegister = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const seller = new Seller({ ...req.body, password: hashedPass });

    const existingSellerByEmail = await Seller.findOne({
      email: req.body.email,
    });
    const existingShop = await Seller.findOne({ shopName: req.body.shopName });

    if (existingSellerByEmail) {
      res.json({ message: "Email already exists!" });
    } else if (existingShop) {
      res.json({ message: "Shop name already exists" });
    } else {
      let result = await seller.save();
      result.password = undefined;
      const token = generateToken(result._id);

      result = {
        ...result._doc,
        token: token,
      };
      res.send(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const sellerLogIn = async (req, res) => {
  if (req.body.email && req.body.password) {
    try {
      let seller = await Seller.findOne({ email: req.body.email });
      if (seller) {
        const passwordMatch = await bcrypt.compare(
          req.body.password,
          seller.password
        );
        if (passwordMatch) {
          seller.password = undefined;
          const token = generateToken(seller._id);
          console.log("token:", token);
          console.log("seller1:::", seller._doc);
          seller = {
            ...seller._doc,
            token: token,
          };
          console.log("seller2:::", seller);
          res.send(seller);
        } else {
          res.send({ message: "Invalid password" });
        }
      } else {
        res.send({ message: "Seller Not Found!" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.send({ message: "Email and password are required" });
  }
};
module.exports = { sellerRegister, sellerLogIn };
