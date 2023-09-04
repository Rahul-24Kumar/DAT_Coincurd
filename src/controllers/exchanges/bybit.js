const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const bybitModel = require("../../models/exchanges/bybit");

const BybitInDb = async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: "https://api-testnet.bybit.com/v2/public/tickers",
    });

    if (response && response.data) {
      const result = response.data.result;

      let bybitApiData = [];

      result.forEach((element) => {
        if (element.symbol.endsWith("USDT")) {
          const symbolWithoutUSDT = element.symbol.replace("USDT", "");
          const fullPairName = element.symbol;

          bybitApiData.push({
            symbol: symbolWithoutUSDT,
            pairName: fullPairName,

            price: parseFloat(element.last_price),
            priceChangePercent: parseFloat(element.price_24h_pcnt),
            prevClosePrice: parseFloat(element.prev_price_24h),
            bidPrice: parseFloat(element.bid_price),
            askPrice: parseFloat(element.ask_price),
            highPrice: parseFloat(element.high_price_24h),
            lowPrice: parseFloat(element.low_price_24h),
            lastPrice: parseFloat(element.last_price),
            lastPrice1h: parseFloat(element.prev_price_1h),
            volume: parseFloat(element.volume_24h),
            change1h: parseFloat(element.price_1h_pcnt),
            
            exchangeId: "bybit",
            exchangeName: "Bybit",
            uniqueExchangeId: "bybit_2",
          });
        }
      });

      await bybitModel.insertMany(bybitApiData);
    } else {
      logger.error("Invalid API response!");
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

cron.schedule("*/30 * * * *", async () => {
  await BybitInDb();
  // logger.info("Saved");
});

module.exports = { BybitInDb };
