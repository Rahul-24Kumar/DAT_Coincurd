const router = require("express").Router();

const {
  insertCurency,
  getAllCoins,
  listCurrencyAdmin,
} = require("../../controllers/crypto/viewCoins");


router.get("/viewAllCoins", getAllCoins);

router.post("/insertCoins", insertCurency);

router.post("/addNewCurrency", listCurrencyAdmin);

module.exports = router;
