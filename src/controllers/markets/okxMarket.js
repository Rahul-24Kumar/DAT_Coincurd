const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const okxMarket = require("../../models/marketModel/okxMarket");

const OkxMarketInDb = async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: "https://www.okx.com/api/v5/market/tickers?instType=SWAP",
    });

    if (response && response.data) {
      const result = response.data.data;

      let okxApiData = [];

      result.forEach((element) => {
        let symbolWithoutPair;

        symbolWithoutPair = element.instId.split("-SWAP")[0];

        okxApiData.push({
          symbol: symbolWithoutPair,
          pairName: element.instId,

          price: parseFloat(element.last),

          bidPrice: parseFloat(element.bidPx),

          askPrice: parseFloat(element.askPx),

          openPrice: parseFloat(element.open24h),
          highPrice: parseFloat(element.high24h),
          lowPrice: parseFloat(element.low24h),

          lastPrice: parseFloat(element.last),
          volume: parseFloat(element.vol24h),

          askQty: element.askQty,
          lastQty: element.lastQty,
          bidQty: element.bidQty,

          time: element.ts,

          exchangeId: "okx",
          exchangeName: "Okx",
          uniqueExchangeId: "okx_6",
        });
      });

      await okxMarket.insertMany(okxApiData);
    } else {
      logger.error("Invalid API response!");
    }
  } catch (err) {
    logger.error(err.message);
  }
};

cron.schedule("*/30 * * * *", async () => {
  await OkxMarketInDb();
  // logger.info("Saved");
});

module.exports = { OkxMarketInDb };
