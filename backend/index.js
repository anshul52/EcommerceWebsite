const express = require("express");
const cors = require("cors");
var morgan = require("morgan");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
const bodyparser = require("body-parser");
const routes = require("./routes/route");
const dbConnection = require("./config/dbConnection");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

app.use(cors());
dbConnection();
app.use(bodyparser.json());
app.use(morgan("combined"));
app.use("/", routes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running at the port ${PORT}`);
});
