const router = require("express").Router();

const {
  getCryptoMarket,
  getExchangeMarket,
} = require("../../controllers/markets/viewMarket");

const marketControllers = [
  {
    name: "huobiMarket",
    controller: require("../../controllers/markets/huobiMarket").HuobiInDb,
  },
  {
    name: "okxMarket",
    controller: require("../../controllers/markets/okxMarket").OkxMarketInDb,
  },
  {
    name: "bybitMarket",
    controller: require("../../controllers/markets/bybitMarket")
      .BybitMarketInDb,
  },
  {
    name: "binanceMarket",
    controller: require("../../controllers/markets/binanceMarket")
      .BinanceMarketInDb,
  },
  {
    name: "poloniexMarket",
    controller: require("../../controllers/markets/poloniexMarket")
      .PoloniexMarketInDb,
  },
  {
    name: "bitstampMarket",
    controller: require("../../controllers/markets/bitstampMarket")
      .BitstampMarketInDb,
  },
];

marketControllers.forEach(({ name, controller }) => {
  router.post(`/${name}`, controller);
});

router.get("/viewCrypto/market/:symbol", getCryptoMarket);


router.get("/viewExchange/market/:exchangeId", getExchangeMarket);

module.exports = router;
