const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../logger");
const binanceModel = require("../models/binance");

const BinanceInDb = async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: "https://www.binance.com/api/v3/ticker/24hr",
    });

    if (response && response.data) {
      const result = response.data;

      let binanceApiData = [];

      result.forEach((element) => {
        if (element.symbol.endsWith("USDT")) {
          const symbolWithoutUSDT = element.symbol.replace("USDT", "");
          const fullPairName = element.symbol;

          binanceApiData.push({
            symbol: symbolWithoutUSDT,
            pairName: fullPairName,
            price: element.lastPrice,
            priceChange: element.priceChange,
            weightedAvgPrice: element.weightedAvgPrice,
            priceChangePercent: element.priceChangePercent,
            prevClosePrice: element.prevClosePrice,
            lastQty: element.lastQty,
            bidPrice: element.bidPrice,
            bidQty: element.bidQty,
            askPrice: element.askPrice,
            askQty: element.askQty,
            openPrice: element.openPrice,
            highPrice: element.highPrice,
            lowPrice: element.lowPrice,
            lastPrice: element.lastPrice,
            volume: element.volume,
            quoteVolume: element.quoteVolume,
            tradeCount: element.count,
            firstId: element.firstId,
            lastId: element.lastId,
            openTime: element.openTime,
            closeTime: element.closeTime,
          });
        }
      });

      await binanceModel.insertMany(binanceApiData);
    } else {
      logger.error("Invalid API response!");
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

cron.schedule("*/30 * * * *", async () => {
  await BinanceInDb();
  logger.info("Saved");
});


module.exports = { BinanceInDb }