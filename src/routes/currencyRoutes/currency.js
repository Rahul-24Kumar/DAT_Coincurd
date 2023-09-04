const router = require("express").Router();

const {
  insertCurency,
  getAllCoins,
  listCurrencyAdmin,
  UpdateCurrency,
} = require("../../controllers/crypto/viewCoins");

router.get("/viewAllCoins", getAllCoins);

router.post("/insertCoins", insertCurency);

router.post("/addNewCurrency", listCurrencyAdmin);

router.put("/currency/:uniqueCoinId", UpdateCurrency);

module.exports = router;
