const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const huobiModel = require("../../models/exchanges/huobi");

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
        if (symbolUpperCase.endsWith("USDT")) {
          const symbolWithoutUSDT = symbolUpperCase.replace("USDT", "");
          const fullPairName = symbolUpperCase;

          huobiApiData.push({
            symbol: symbolWithoutUSDT,
            pairName: fullPairName,

            price: parseFloat(element.close),
            amount: parseFloat(element.amount),
            bidPrice: parseFloat(element.bid),
            askPrice: parseFloat(element.ask),
            openPrice: parseFloat(element.open),
            highPrice: parseFloat(element.high),
            lowPrice: parseFloat(element.low),
            lastPrice: parseFloat(element.close),
            volume: parseFloat(element.vol),
            tradeCount: parseFloat(element.count),
            

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
  // logger.info("Saved");
});

module.exports = { HuobiInDb };
