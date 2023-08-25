const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const okxMarket = require("../../models/markets/okxMarket");

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
          price: element.last,
          lastQty: element.lastQty,
          bidPrice: element.bidPx,
          bidQty: element.bidQty,
          askPrice: element.askPx,
          askQty: element.askQty,
          openPrice: element.open24h,
          highPrice: element.high24h,
          lowPrice: element.low24h,
          lastPrice: element.last,
          volume: element.vol24h,
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
  logger.info("Saved");
});

module.exports = { OkxMarketInDb };
