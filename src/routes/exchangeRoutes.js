const router = require("express").Router();

const { OkxInDb } = require("../controllers/exchanges/okx");

const { HuobiInDb } = require("../controllers/exchanges/huobi");

const { BybitInDb } = require("../controllers/exchanges/bybit");

const { BankcexInDb } = require("../controllers/exchanges/bankcex");

const { BinanceInDb } = require("../controllers/exchanges/binance");

const { BitstampInDb } = require("../controllers/exchanges/bitstamp");

const {
  addNewExchanges,
  insertExchanges,
  getAllExchanges,
  UpdateExchanges,
} = require("../controllers/exchanges/allExchanges");

const { getAllExchangesCrypto } = require("../controllers/pairs/avgPrice");

router.post("/insert/okx", OkxInDb);

router.post("/insert/huobi", HuobiInDb);

router.post("/insert/bybit", BybitInDb);

router.post("/insert/bankcex", BankcexInDb);

router.post("/insert/binance", BinanceInDb);

router.post("/insert/bitstamp", BitstampInDb);

router.post("/insert/exchanges", insertExchanges);

router.post("/addNew/exchanges", addNewExchanges);

router.get("/view/allExchanges", getAllExchanges);

router.put("/update/exchange/:uniqueExchagneId", UpdateExchanges);

router.get("/crypto/:uniqueExchangeId", getAllExchangesCrypto);

module.exports = router;
