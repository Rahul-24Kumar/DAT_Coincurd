const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const kucoinModel = require("../../models/marketModel/kucoinMarket");

const KucoinInDb = async () => {
  try {
    const response = await axios({
      method: "get",
      url: "https://api.kucoin.com/api/v1/market/allTickers",
    });

    if (response && response.data) {
      const result = response.data.data.ticker;

      let kucoinApiData = [];

      result.forEach((element) => {
        const symbolUpperCase = element.symbol.toUpperCase();
        if (symbolUpperCase) {
          const symbolWithoutUSDT = symbolUpperCase.replace("-USDT", "");
          const fullPairName = symbolUpperCase;

          kucoinApiData.push({
            symbol: symbolWithoutUSDT,
            pairName: fullPairName,

            price: parseFloat(element.last),
            priceChange: Number(element.changePrice),

            changePercent24Hr: parseFloat(element.changeRate),
            weightedAvgPrice: Number(element.averagePrice),

            highPrice: parseFloat(element.high),
            lowPrice: parseFloat(element.low),
            volume: parseFloat(element.vol),

            buyPrice: parseFloat(element.buy),
            sellPrice: parseFloat(element.sell),

            exchangeId: "kucoin",
            exchangeName: "Kucoin",
            uniqueExchangeId: "kucoin_5",
          });
        }
      });

      await kucoinModel.insertMany(kucoinApiData);
    } else {
      logger.error("Invalid API response!");
    }
  } catch (err) {
    logger.error(err.message);
  }
};

cron.schedule("*/30 * * * *", async () => {
  await KucoinInDb();
  // logger.info("Kucoin Market Saved");
});

module.exports = { KucoinInDb };
