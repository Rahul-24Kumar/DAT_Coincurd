const logger = require("../../../logger");
const currencyModel = require("../../models/currency/cryptocurrency");

const currencyData = [
  {
    coinId: "bitcoin",
    rank: 1,
    coinName: "Bitcoin",
    symbol: "BTC",
    uniqueCoinId: "BTC_1",
    uniqueExchangeId: "binance_1",
    circulatingSupply: 19460625,
    maxSupply: 21000000,
  },
  {
    coinId: "ethereum",
    rank: 2,
    coinName: "Ethereum",
    symbol: "ETH",
    uniqueCoinId: "ETH_2",
    uniqueExchangeId: "binance_1",
    circulatingSupply: 120131756.16935974,
  },
  {
    coinId: "binance-coin",
    rank: 3,
    coinName: "BNB",
    symbol: "BNB",
    uniqueCoinId: "BNB_3",
    uniqueExchangeId: "binance_1",
    circulatingSupply: 166801148,
    maxSupply: 166801148,
  },
  {
    coinId: "solana",
    rank: 4,
    coinName: "Solana",
    symbol: "SOL",
    uniqueCoinId: "SOL_4",
    uniqueExchangeId: "binance_1",
    circulatingSupply: 82842337234.0993,
  },

  {
    coinId: "polkadot",
    rank: 5,
    symbol: "DOT",
    uniqueCoinId: "DOT_5",
    uniqueExchangeId: "binance_1",
    circulatingSupply: 1265884143.59824,
  },

  {
    coinId: "xrp",
    rank: 6,
    coinName: "XRP",
    symbol: "XRP",
    uniqueCoinId: "XRP_6",
    uniqueExchangeId: "binance_1",
    circulatingSupply: 45404028640,
    maxSupply: 100000000000,
  },
];

const insertCurency = async (req, res) => {
  try {
    const addNewCurrency = await currencyModel.insertMany(currencyData);

    return res
      .status(201)
      .send({ message: "successful", data: addNewCurrency });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ message: error.message });
  }
};

const listCurrencyAdmin = async (req, res) => {
  try {
    const insertInDb = await currencyModel.create({ ...req.body });

    return res.status(201).send({ message: "successful", data: insertInDb });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getAllCoins = async (req, res) => {
  try {
    const getCoins = await currencyModel.find({});
    return res.status(200).send({ message: "successful", data: getCoins });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = { insertCurency, getAllCoins, listCurrencyAdmin };
