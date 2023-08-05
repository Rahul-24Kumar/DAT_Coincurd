const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../logger");
const okxModel = require("../models/okx");

const OkxInDb = async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: "https://www.okx.com/api/v5/market/tickers?instType=SWAP",
    });

    if (response && response.data) {
      const result = response.data.data;

      let okxApiData = [];

      result.forEach((element) => {
        let symbolWithoutUSDT;
        let pairName;

        if (element.instId.includes("-USDT-SWAP")) {
          symbolWithoutUSDT = element.instId.replace("-USDT-SWAP", "");
          pairName = `${symbolWithoutUSDT}USDT`;

          okxApiData.push({
            symbol: symbolWithoutUSDT,
            pairName: pairName,
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
          });
        }
      });

      await okxModel.insertMany(okxApiData);
    } else {
      logger.error("Invalid API response!");
    }
  } catch (err) {
    logger.error(err.message);
  }
};

cron.schedule("*/30 * * * *", async () => {
  await OkxInDb();
  logger.info("Saved");
});

module.exports = { OkxInDb };
