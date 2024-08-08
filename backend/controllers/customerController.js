const Customer = require("../models/customerSchema.js");
const { generateToken } = require("../config/jwtToken.js");
const bcrypt = require("bcrypt");

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
module.exports = {
  customerRegister,
  customerLogIn,
  //   getCartDetail,
  //   cartUpdate,
};
