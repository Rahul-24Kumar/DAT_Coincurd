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
          price: parseFloat(element.close),

          priceChangePercent: parseFloat(element.dailyChange),

          bidPrice: parseFloat(element.bid),
          bidQty: parseFloat(element.bidQuantity),
          askPrice: parseFloat(element.ask),
          askQty: parseFloat(element.askQuantity),
          openPrice: parseFloat(element.open),
          highPrice: parseFloat(element.high),
          lowPrice: parseFloat(element.low),

          volume: parseFloat(element.volume),
          quoteVolume: parseFloat(element.quoteVolume),
          tradeCount: parseFloat(element.tradeCount),

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
