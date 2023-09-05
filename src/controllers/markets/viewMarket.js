const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const BinanceMarket = require("../../models/marketModel/binanceMarket");
const BitstampMarket = require("../../models/marketModel/bitstampMarket");
const BybitModel = require("../../models/marketModel/bybitMarket");
const HuobiModel = require("../../models/marketModel/huobiMarket");
const OkxMarket = require("../../models/marketModel/okxMarket");
const PoloniexMarket = require("../../models/marketModel/poloniexMarket");

const exchangeModels = {
  binance: BinanceMarket,
  bitstamp: BitstampMarket,
  bybit: BybitModel,
  huobi: HuobiModel,
  okx: OkxMarket,
  poloniex: PoloniexMarket,
};

const getExchangeMarket = async (req, res) => {
  try {
    const { exchangeId } = req.params;
    const { page = 1, pageSize = 50 } = req.query;

    if (exchangeModels.hasOwnProperty(exchangeId)) {
      const ExchangeModel = exchangeModels[exchangeId];

      const skip = (page - 1) * pageSize;
      const limit = parseInt(pageSize);

      const uniquePairs = await ExchangeModel.aggregate([
        { $sort: { updatedAt: -1 } },
        { $group: { _id: "$pairName", latest: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$latest" } },
        { $skip: skip },
        { $limit: limit },
      ]);

      return res.status(200).send({ message: "successful", data: uniquePairs });
    } else {
      return res.status(404).json({ error: "Exchange not found" });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getCryptoMarket = async (req, res) => {
  try {
    const { symbol } = req.params;

    const pairRegex = new RegExp(`${symbol.toLowerCase()}/\\w+`, "i");

    const pipeline = [
      { $match: { pairName: pairRegex } },
      { $sort: { updatedAt: -1 } },
      {
        $group: {
          _id: { pairName: "$pairName", exchangeId: "$exchangeId" },
          latestDocument: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$latestDocument" } },
    ];

    const combinedData = await Promise.all([
      BinanceMarket.aggregate(pipeline).exec(),
      BitstampMarket.aggregate(pipeline).exec(),
      BybitModel.aggregate(pipeline).exec(),
      HuobiModel.aggregate(pipeline).exec(),
      OkxMarket.aggregate(pipeline).exec(),
      PoloniexMarket.aggregate(pipeline).exec(),
    ]);

    const flattenedData = combinedData.flat();

    return res.status(200).send({ message: "successful", data: flattenedData });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = { getCryptoMarket, getExchangeMarket };

// const getExchangeMarket = async (req, res) => {
//   try {
//     logger.info("api running");
//     const { exchangeId } = req.params;

//     if (exchangeModels.hasOwnProperty(exchangeId)) {
//       const ExchangeModel = exchangeModels[exchangeId];

//       const data = await ExchangeModel.find();

//       logger.info(data, "data");

//       return res.status(200).send({ message: "successful", data: data });
//     } else {
//       return res.status(404).json({ error: "Exchange not found" });
//     }
//   } catch (error) {
//     logger.error(error.message);
//     res.status(500).json({ error: "An error occurred" });
//   }
// };

// const getExchangeMarket = async (req, res) => {
//   try {
//     const { exchangeId } = req.params;
//     const { page = 1, pageSize = 100 } = req.query;

//     if (exchangeModels.hasOwnProperty(exchangeId)) {
//       const ExchangeModel = exchangeModels[exchangeId];

//       const skip = (page - 1) * pageSize;
//       const limit = parseInt(pageSize);

//       const data = await ExchangeModel.find().skip(skip).limit(limit);

//       res.status(200).json(data);
//     } else {
//       res.status(404).json({ error: "Exchange not found" });
//     }
//   } catch (error) {
//     logger.error(error.message);
//     res.status(500).json({ error: "An error occurred" });
//   }
// };

// const getCryptoMarket = async (req, res) => {
//   try {
//     const { symbol } = req.params;

//     const pairRegex = new RegExp(`${symbol.toLowerCase()}/\\w+`, "i");
//     const binanceData = await binanceMarket.find({ pairName: pairRegex });
//     const bitstampData = await bitstampMarket.find({ pairName: pairRegex });
//     const bybitData = await bybitModel.find({ pairName: pairRegex });
//     const huobiData = await huobiModel.find({ pairName: pairRegex });
//     const okxData = await okxMarket.find({ pairName: pairRegex });
//     const poloniexData = await poloniexMarket.find({ pairName: pairRegex });

//     const combinedData = [
//       ...binanceData,
//       ...bitstampData,
//       ...bybitData,
//       ...huobiData,
//       ...okxData,
//       ...poloniexData,
//     ];

//     return res.status(200).send({ message: "successful", data: combinedData });
//   } catch (error) {
//     logger.error(error.message);
//     res.status(500).json({ error: "An error occurred" });
//   }
// };
