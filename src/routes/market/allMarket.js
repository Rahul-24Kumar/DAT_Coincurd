const router = require("express").Router();

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

module.exports = router;
