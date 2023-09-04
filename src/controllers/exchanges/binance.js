const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const binanceModel = require("../../models/exchanges/binance");

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

            price: parseFloat(element.lastPrice),
            priceChange: parseFloat(element.priceChange),
            weightedAvgPrice: parseFloat(element.weightedAvgPrice),
            priceChangePercent: parseFloat(element.priceChangePercent),
            prevClosePrice: parseFloat(element.prevClosePrice),
            lastQty: parseFloat(element.lastQty),
            bidPrice: parseFloat(element.bidPrice),
            bidQty: parseFloat(element.bidQty),
            askPrice: parseFloat(element.askPrice),
            askQty: parseFloat(element.askQty),
            openPrice: parseFloat(element.openPrice),
            highPrice: parseFloat(element.highPrice),
            lowPrice: parseFloat(element.lowPrice),
            lastPrice: parseFloat(element.lastPrice),
            volume: parseFloat(element.volume),
            quoteVolume: parseFloat(element.quoteVolume),
            tradeCount: parseFloat(element.count),

            firstId: element.firstId,
            lastId: element.lastId,
            openTime: element.openTime,
            closeTime: element.closeTime,

            exchangeId: "binance",
            exchangeName: "Binance",
            uniqueExchangeId: "binance_1",
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
  // logger.info("Saved");
});

module.exports = { BinanceInDb };
