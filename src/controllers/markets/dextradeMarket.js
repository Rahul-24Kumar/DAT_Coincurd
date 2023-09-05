const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const dextradeModel = require("../../models/marketModel/dextradeMarket");

const dextradeInDb = async () => {
  try {
    const response = await axios({
      method: "get",
      url: "https://api.dex-trade.com/v1/public/tickers",
    });

    if (response && response.data) {
      const result = response.data.data;

      let dextradeApiData = [];

      result.forEach((element) => {
        const symbolUpperCase = element.pair.toUpperCase();
        if (symbolUpperCase) {
          const symbolWithoutUSDT = symbolUpperCase.replace("USDT", "");
          const fullPairName = symbolUpperCase;

          dextradeApiData.push({
            symbol: symbolWithoutUSDT,
            pairName: fullPairName,

            price: parseFloat(element.last),

            highPrice: parseFloat(element.high),
            lowPrice: parseFloat(element.low),

            volume: parseFloat(element.volume_24H),

            exchangeId: "dextrade",
            exchangeName: "Dextrade",
            uniqueExchangeId: "dextrade_7",
          });
        }
      });

      await dextradeModel.insertMany(dextradeApiData);
    } else {
      logger.error("Invalid API response!");
    }
  } catch (err) {
    logger.error(err.message);
  }
};

cron.schedule("*/30 * * * *", async () => {
  await dextradeInDb();
  // logger.info("Saved dextrade Market");
});


module.exports = { dextradeInDb }