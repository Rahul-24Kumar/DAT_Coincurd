const router = require("express").Router();

const {
  insertCurency,
  getAllCoins,
  listCurrencyAdmin,
} = require("../../controllers/crypto/viewCoins");

router.post("/insertCoins", insertCurency);

router.post("/addNewCurrency", listCurrencyAdmin);

router.get("/viewAllCoins", getAllCoins);

module.exports = router;
