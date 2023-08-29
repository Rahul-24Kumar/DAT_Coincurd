const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const bankcexModel = require("../../models/exchanges/bankcex");

const BankcexInDb = async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: "https://api.bankcex.com/api/v1/ticker/24hr",
    });

    if (response && response.data) {
      const result = response.data;

      let bankCexApiData = [];

      result.forEach((element) => {
        if (element.symbol.endsWith("USDT")) {
          const symbolWithoutUSDT = element.symbol.replace("USDT", "");
          const fullPairName = element.symbol;

          bankCexApiData.push({
            symbol: symbolWithoutUSDT,
            pairName: fullPairName,

            price: parseFloat(element.lastPrice),
            priceChange: parseFloat(element.priceChange),
            weightedAvgPrice: parseFloat(element.weightedAvgPrice),
            priceChangePercent: parseFloat(element.priceChangePercent),
            prevClosePrice: parseFloat(element.prevClosePrice),
            lastQty: parseFloat(element.lastQty),
            bidPrice: parseFloat(element.bidPrice),
            bidQty: parseFloat(element.bidQty),
            askPrice: parseFloat(element.askPrice),
            askQty: parseFloat(element.askQty),
            openPrice: parseFloat(element.openPrice),
            highPrice: parseFloat(element.highPrice),
            lowPrice: parseFloat(element.lowPrice),
            lastPrice: parseFloat(element.lastPrice),
            volume: parseFloat(element.volume),
            quoteVolume: parseFloat(element.quoteVolume),
            tradeCount: parseInt(element.count),

            firstId: element.firstId,
            lastId: element.lastId,
            openTime: element.openTime,
            closeTime: element.closeTime,
          });
        }
      });

      await bankcexModel.insertMany(bankCexApiData);
    } else {
      logger.error("Invalid API response!");
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

cron.schedule("*/30 * * * *", async () => {
  await BankcexInDb();
  logger.info("Saved");
});

module.exports = { BankcexInDb };
