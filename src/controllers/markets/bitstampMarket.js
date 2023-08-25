const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const bitstampMarket = require("../../models/markets/bitstampMarket");

const BitstampMarketInDb = async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: "https://www.bitstamp.net/api/v2/ticker/",
    });

    if (response && response.data) {
      const result = response.data;

    

      let bitstampApiData = [];

      result.forEach((element) => {
        const symbolWithoutPair = element.pair.split("/")[0];

        bitstampApiData.push({
          symbol: symbolWithoutPair,
          pairName: element.pair,
          price: element.last,
          weightedAvgPrice: element.vwap,
          priceChangePercent: element.percent_change_24,
          bidPrice: element.bid,
          askPrice: element.ask,
          openPrice: element.open,
          highPrice: element.high,
          lowPrice: element.low,
          lastPrice: element.last,
          volume: element.volume,

          exchangeId: "bitstamp",
          exchangeName: "Bitstamp",
          uniqueExchangeId: "bitstamp_8",
        });
      });

      await bitstampMarket.insertMany(bitstampApiData);
    } else {
      logger.error("Invalid API response!");
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

cron.schedule("*/30 * * * *", async () => {
  await BitstampMarketInDb();
  logger.info("Bitstamp Market");
});

module.exports = { BitstampMarketInDb };
