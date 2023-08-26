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
            uniqueExchangeId: "bitstamp_8",
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
