const exchangeModel = require("../../models/exchanges/AllExchanges");

const exchangeData = [
  {
    rank: "1",
    exchangeId: "binance",
    exchangeName: "Binance",
    uniqueExchangeId: "binance_1",
    percentTotalVolume: "48.462058420265617262",
    volumeUsd: "4330040379.6483578831795349",
    tradingPairs: "828",
    exchangeUrl: "https://www.binance.com/",
    country: "Cayman Islands",
    year_established: "2017",
  },

  {
    rank: "2",
    exchangeId: "bybit",
    exchangeName: "Bybit",
    uniqueExchangeId: "bybit_2",
    exchangeUrl: "https://www.bybit.com",
    country: "Singapore",
    year_established: "2018",
  },

  {
    rank: "3",
    exchangeId: "poloniex",
    exchangeName: "Poloniex",
    uniqueExchangeId: "poloniex_3",
    exchangeUrl: "https://poloniex.com/",
    country: "Seychelles",
    description:
      "Poloniex was founded in January 2014 as a global cryptocurrency exchange. It provides spot trading, futures trading, staking, and various services to users in nearly 100 countries and regions with various languages available.\r\n\r\nIn 2022, Poloniex launched a brand new trading system to provide global retail and professional users with higher speed, as well as better stability and usability.",
    year_established: "2014",
  },

  {
    rank: "4",
    exchangeId: "huobi",
    exchangeName: "Huobi",
    uniqueExchangeId: "huobi_4",
    percentTotalVolume: "5.562057304204931763",
    volumeUsd: "504588176.0447381297196166",
    tradingPairs: "228",
    exchangeUrl: "https://www.hbg.com/",
    country: "Seychelles",
    year_established: "2013",
  },

  {
    rank: "5",
    exchangeId: "kucoin",
    exchangeName: "Kucoin",
    percentTotalVolume: "1.926628210141964726",
    volumeUsd: "174972439.0943541844626706",
    tradingPairs: "652",
    exchangeUrl: "https://www.kucoin.io/",
    country: "Seychelles",
    year_established: "2014",
  },

  {
    rank: "6",
    exchangeId: "okx",
    exchangeName: "Okx",
    uniqueExchangeId: "okx_6",
    exchangeUrl: "https://www.okx.com/",
    country: "Seychelles",
    year_established: "2017",
  },

  {
    rank: "7",
    exchangeId: "dextrade",
    exchangeName: "Dextrade",
    uniqueExchangeId: "dextrade_7",
    percentTotalVolume: "0.392663384457190133",
    volumeUsd: "34426990.2815215323094857",
    tradingPairs: "103",
    exchangeUrl: "https://dex-trade.com/",
  },

  {
    rank: "8",
    exchangeId: "bitstamp",
    exchangeName: "Bitstamp",
    uniqueExchangeId: "bitstamp_8",
    percentTotalVolume: "1.359354520604433387",
    volumeUsd: "123222720.8484107837269276",
    tradingPairs: "98",
    exchangeUrl: "https://www.bitstamp.net/",
    country: "Luxembourg",
    year_established: "2013",
  },
];

const insertExchanges = async (req, res) => {
  try {
    const insertInDb = await exchangeModel.insertMany(exchangeData);

    return res.status(201).send({ message: "successful", data: insertInDb });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const UpdateExchanges = async (req, res) => {
  try {
    const { uniqueExchangeId } = req.params;
    const updateFields = req.body;

    let existingExchange = await exchangeModel.findOne({ uniqueExchangeId });

    if (!existingExchange) {
      return res.status(404).json({ status: false, message: "Not Found!" });
    } else {
      Object.entries(updateFields).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          existingExchange[key] = value;
        }
      });
    }

    const updatedAssetDoc = await existingExchange.save();

    return res.status(200).json({
      status: true,
      message: "Update successful",
      data: updatedAssetDoc,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getAllExchanges = async (req, res) => {
  try {
    const viewExchanges = await exchangeModel.find({});
    return res.status(200).send({ message: "successful", data: viewExchanges });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = { insertExchanges, getAllExchanges, UpdateExchanges };
