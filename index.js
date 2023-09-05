const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./logger");

const exchangeRoutes = require("./src/routes/exchange/exchanges");

const marketRoutes = require("./src/routes/market/allMarket.js");

const pairRoutes = require("./src/routes/pair/cryptoPair");

const currecnyRoutes = require("./src/routes/currency/crypto");

const historyRoutes = require("./src/routes/history/cryptoHistory");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use("/exchange", pairRoutes);
app.use("/exchange", marketRoutes);
app.use("/exchange", exchangeRoutes);
app.use("/exchange", currecnyRoutes);
app.use("/exchange", historyRoutes);

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
