const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const okxModel = require("../../models/exchanges/okx");

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

            bidQty: element.bidQty,
            askQty: element.askQty,

            price: parseFloat(element.last),
            lastQty: parseFloat(element.lastQty),
            bidPrice: parseFloat(element.bidPx),

            askPrice: parseFloat(element.askPx),

            openPrice: parseFloat(element.open24h),
            highPrice: parseFloat(element.high24h),
            lowPrice: parseFloat(element.low24h),
            lastPrice: parseFloat(element.last),
            volume: parseFloat(element.vol24h),

            time: element.ts,
            exchangeId: "okx",
            exchangeName: "Okx",
            uniqueExchangeId: "okx_6",
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
