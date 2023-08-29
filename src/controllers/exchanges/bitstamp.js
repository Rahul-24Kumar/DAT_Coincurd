const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const bitstampModel = require("../../models/exchanges/bitstamp");

const BitstampInDb = async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: "https://www.bitstamp.net/api/v2/ticker/",
    });

    if (response && response.data) {
      const result = response.data;

      let bitstampApiData = [];

      result.forEach((element) => {
        if (element.pair.endsWith("/USDT")) {
          const symbolWithoutUSDT = element.pair.replace("/USDT", "");
          const fullPairName = element.pair;

          bitstampApiData.push({
            symbol: symbolWithoutUSDT,
            pairName: fullPairName,

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
        }
      });

      await bitstampModel.insertMany(bitstampApiData);
    } else {
      logger.error("Invalid API response!");
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

cron.schedule("*/30 * * * *", async () => {
  await BitstampInDb();
  logger.info("Bitstamp Saved");
});

module.exports = { BitstampInDb };
