const router = require("express").Router();

const { OkxInDb } = require("../controllers/okx");

const { HuobiInDb } = require("../controllers/huobi");

const { BybitInDb } = require("../controllers/bybit");

const { BankcexInDb } = require("../controllers/bankcex");

const { BinanceInDb } = require("../controllers/binance");

router.post("/insert/okx", OkxInDb);

router.post("/insert/huobi", HuobiInDb);

router.post("/insert/bybit", BybitInDb);

router.post("/insert/bankcex", BankcexInDb);

router.post("/insert/binance", BinanceInDb);

module.exports = router;
