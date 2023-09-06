const router = require("express").Router();

const { OkxPairDb } = require("../../controllers/pairs/okx");

const { bybitPairDb } = require("../../controllers/pairs/bybit");

const { HuobiPairDb } = require("../../controllers/pairs/Huobi");

const { kucoinPairDb } = require("../../controllers/pairs/kucoin");

const { BinancePairDb } = require("../../controllers/pairs/Binance");

const { poloniexPairDb } = require("../../controllers/pairs/poloniex");

const { DextradePairDb } = require("../../controllers/pairs/Dextrade");

const { bitstampPairDb } = require("../../controllers/pairs/bitstamp");

const {
  addNewPair,
  getAllPairs,
  UpdateExchangePair,
} = require("../../controllers/pairs/avgPrice");

router.post("/add/new/pair", addNewPair);

router.get("/pair/data/okx", OkxPairDb);

router.get("/pair/data/bybit", bybitPairDb);

router.get("/pair/data/huobi", HuobiPairDb);

router.get("/pair/data/kucoin", kucoinPairDb);

router.get("/pair/data/binance", BinancePairDb);

router.get("/pair/data/bitstamp", bitstampPairDb);

router.get("/pair/data/dextrade", DextradePairDb);

router.get("/pair/data/poloniex", poloniexPairDb);

router.get("/pairs/:uniqueCoinId", getAllPairs);

router.put(
  "/exchange/pair/update/:uniqueCoinId/:uniqueExchangeId",
  UpdateExchangePair
);

module.exports = router;
