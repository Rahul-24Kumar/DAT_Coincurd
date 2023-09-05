const router = require("express").Router();

const {
  addNewExchanges,
  insertExchanges,
  getAllExchanges,
  UpdateExchanges,
} = require("../../controllers/exchanges/allExchanges");

const { getAllExchangesCrypto } = require("../../controllers/pairs/avgPrice");

router.post("/insert/exchanges", insertExchanges);

router.post("/addNew/exchanges", addNewExchanges);

router.get("/view/allExchanges", getAllExchanges);

router.get("/crypto/:uniqueExchangeId", getAllExchangesCrypto);

router.put("/update/:uniqueExchangeId", UpdateExchanges);

module.exports = router;
