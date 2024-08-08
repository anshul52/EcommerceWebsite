const mongoos = require("mongoose");
const MONGODBurl = process.env.MONGODB;
const connectDB = async () => {
  try {
    await mongoos.connect(MONGODBurl);
    console.log("connected to db");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
