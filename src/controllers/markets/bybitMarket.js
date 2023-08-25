const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const bybitModel = require("../../models/markets/bybitMarket");

const BybitMarketInDb = async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: "https://api-testnet.bybit.com/v2/public/tickers",
    });

    if (response && response.data) {
      const result = response.data.result;

      let bybitApiData = [];

      result.forEach((element) => {
        const symbolWithoutUSDT = element.symbol.replace("USDT", "");
        const fullPairName = element.symbol;

        bybitApiData.push({
          symbol: symbolWithoutUSDT,
          pairName: fullPairName,
          price: element.last_price,
          priceChangePercent: element.price_24h_pcnt,
          prevClosePrice: element.prev_price_24h,
          bidPrice: element.bid_price,
          askPrice: element.ask_price,
          highPrice: element.high_price_24h,
          lowPrice: element.low_price_24h,
          lastPrice: element.last_price,
          lastPrice1h: element.prev_price_1h,
          volume: element.volume_24h,
          change1h: element.price_1h_pcnt,

          exchangeId: "bybit",
          exchangeName: "Bybit",
          uniqueExchangeId: "bybit_2",
        });
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
  await BybitMarketInDb();
  logger.info("Bybit Market Saved");
});

module.exports = { BybitMarketInDb };
