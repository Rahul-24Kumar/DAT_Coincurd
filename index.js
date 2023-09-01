const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./logger");

const exchangeRoutes = require("./src/routes/exchangeRoutes");

const marketRoutes = require("./src/routes/market/allMarket.js");

const mainRoutes = require("./src/routes/pairRoutes/currencyPair");

const currecnyRoutes = require("./src/routes/currencyRoutes/currency");

const app = express();

app.use(
  cors({
    origin: [
      "/.coincurd.com$/",
      "https://coincurd.com",
      "https://user.coincurd.com",
      "https://admin.coincurd.com",
      "https://backenduser.coincurd.com",
      "https://beta.coincurd.com",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const port = process.env.PORT || 5001;

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://techAdmin:Siamaq%409@139.59.36.115:26018/ExchangeDB?authMechanism=DEFAULT&authSource=admin";

app.use("/exchange", mainRoutes);
app.use("/exchange", marketRoutes);
app.use("/exchange", exchangeRoutes);
app.use("/exchange", currecnyRoutes);

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
