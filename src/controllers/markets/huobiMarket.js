const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const huobiModel = require("../../models/markets/huobiMarket");

const HuobiInDb = async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: "https://api.huobi.pro/market/tickers",
    });

    if (response && response.data) {
      const result = response.data.data;

      let huobiApiData = [];

      result.forEach((element) => {
        const symbolUpperCase = element.symbol.toUpperCase();
        if (symbolUpperCase) {
          const symbolWithoutUSDT = symbolUpperCase.replace("USDT", "");
          const fullPairName = symbolUpperCase;

          huobiApiData.push({
            symbol: symbolWithoutUSDT,
            pairName: fullPairName,
            price: element.close,
            amount: element.amount,
            bidPrice: element.bid,
            askPrice: element.ask,
            openPrice: element.open,
            highPrice: element.high,
            lowPrice: element.low,
            lastPrice: element.close,
            volume: element.vol,
            tradeCount: element.count,
            exchangeId: "huobi",
            exchangeName: "Huobi",
            uniqueExchangeId: "huobi_4",
          });
        }
      });

      await huobiModel.insertMany(huobiApiData);
    } else {
      logger.error("Invalid API response!");
    }
  } catch (err) {
    logger.error(err.message);
  }
};

cron.schedule("*/30 * * * *", async () => {
  await HuobiInDb();
  logger.info("Saved");
});

module.exports = { HuobiInDb };
