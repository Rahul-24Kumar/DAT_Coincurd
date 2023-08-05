const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("./logger");
const exchangeRoutes = require("./src/routes/exchangeRoutes");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

const port = process.env.PORT || 5000;

// const MONGODB_URI = process.env.LOCAL_MONGODB_URI;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://techAdmin:Siamaq%409@139.59.36.115:26018/ExchangeDB?authMechanism=DEFAULT&authSource=admin";

app.use("/exchanges", exchangeRoutes);

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("MongoDB connected");

    app.listen(port, () => {
      logger.info(`Server is running on ${port}`);
    });
  } catch (err) {
    logger.error(err.message);
  }
}

startServer();
