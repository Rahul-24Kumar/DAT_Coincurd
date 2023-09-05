const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const bitstampMarket = require("../../models/marketModel/bitstampMarket");

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

          price: parseFloat(element.last),
          weightedAvgPrice: parseFloat(element.vwap),
          priceChangePercent: parseFloat(element.percent_change_24),
          bidPrice: parseFloat(element.bid),
          askPrice: parseFloat(element.ask),
          openPrice: parseFloat(element.open),
          highPrice: parseFloat(element.high),
          lowPrice: parseFloat(element.low),
          lastPrice: parseFloat(element.last),
          volume: parseFloat(element.volume),

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
  // logger.info("Bitstamp Market");
});

module.exports = { BitstampMarketInDb };
