const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const poloniexMarket = require("../../models/markets/poloniexMarket");

const PoloniexMarketInDb = async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: "https://api.poloniex.com/markets/ticker24h",
    });

    if (response && response.data) {
      const result = response.data;

      let poloniexApiData = [];

      result.forEach((element) => {
        const symbolWithoutUSDT = element.symbol.replace("_", "");
        const fullPairName = element.displayName;

        poloniexApiData.push({
          symbol: symbolWithoutUSDT,
          pairName: fullPairName,
          price: element.close,

          priceChangePercent: element.dailyChange,

          bidPrice: element.bid,
          bidQty: element.bidQuantity,
          askPrice: element.ask,
          askQty: element.askQuantity,
          openPrice: element.open,
          highPrice: element.high,
          lowPrice: element.low,

          volume: element.volume,
          quoteVolume: element.quoteVolume,
          tradeCount: element.tradeCount,

          openTime: element.startTime,
          closeTime: element.closeTime,

          exchangeId: "poloniex",
          exchangeName: "Poloniex",
          uniqueExchangeId: "poloniex_3",
        });
      });

      await poloniexMarket.insertMany(poloniexApiData);
    } else {
      logger.error("Invalid API response!");
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

cron.schedule("*/30 * * * *", async () => {
  await PoloniexMarketInDb();
  logger.info("Saved");
});

module.exports = { PoloniexMarketInDb };
