const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const pairModel = require("../../models/pairModel/currencyPairs");

const HuobiPairDb = async (req, res) => {
  try {
    const HuobiData = [
      {
        coinId: "bitcoin",
        rank: 1,
        coinName: "Bitcoin",
        symbol: "BTC",
        uniqueCoinId: "BTC_1",
        uniqueExchangeId: "huobi_4",
        circulatingSupply: 19460625,
        maxSupply: 21000000,
      },
      {
        coinId: "ethereum",
        rank: 2,
        coinName: "Ethereum",
        symbol: "ETH",
        uniqueCoinId: "ETH_2",
        uniqueExchangeId: "huobi_4",
        circulatingSupply: 120131756.16935974,
      },
      {
        coinId: "binance-coin",
        rank: 3,
        coinName: "BNB",
        symbol: "BNB",
        uniqueCoinId: "BNB_3",
        uniqueExchangeId: "huobi_4",
        circulatingSupply: 166801148,
        maxSupply: 166801148,
      },
      {
        coinId: "solana",
        rank: 4,
        coinName: "Solana",
        symbol: "SOL",
        uniqueCoinId: "SOL_4",
        uniqueExchangeId: "huobi_4",
        circulatingSupply: 82842337234.0993,
      },

      {
        coinId: "polkadot",
        rank: 5,
        symbol: "DOT",
        coinName: "Polkadot",
        uniqueCoinId: "DOT_5",
        uniqueExchangeId: "huobi_4",
        circulatingSupply: 1265884143.59824,
      },
      {
        coinId: "xrp",
        rank: 6,
        coinName: "XRP",
        symbol: "XRP",
        uniqueCoinId: "XRP_6",
        uniqueExchangeId: "huobi_4",
        circulatingSupply: 45404028640,
        maxSupply: 100000000000,
      },
    ];

    const coinPairName = HuobiData.map((e) => e.symbol);
    const coinSymbols = coinPairName.map((symbol) =>
      `${symbol}USDT`.toLowerCase()
    );

    for (const symbol of coinSymbols) {
      try {
        const response = await axios.get(
          `https://api.huobi.pro/market/detail?symbol=${symbol}`
        );

        const matchingDataIndex = HuobiData.findIndex(
          (data) => data.symbol === symbol.replace("usdt", "").toUpperCase()
        );

        if (matchingDataIndex !== -1) {
          const responseData = response.data.tick;

          const updatedData = HuobiData[matchingDataIndex];

          updatedData.pairName = symbol;

          updatedData.huobiId = parseFloat(responseData.id);
          updatedData.price = parseFloat(responseData.close);
          updatedData.lowPrice = parseFloat(responseData.low);
          updatedData.highPrice = parseFloat(responseData.high);
          updatedData.volume = parseFloat(responseData.vol);
          updatedData.tradeCount = parseFloat(responseData.count);

          updatedData.apiLink = `https://api.huobi.pro/market/detail?symbol=${symbol.toLowerCase()}`;

          HuobiData[matchingDataIndex] = updatedData;
        }
      } catch (error) {
        logger.error(`Error fetching data for ${symbol}:`, error.message);
      }
    }

    await pairModel.insertMany(HuobiData);

    return res.status(200).send({
      status: true,
      message: "Data updated successfully.",
      data: HuobiData,
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateHuobiPair = async () => {
  try {
    const documentsToUpdate = await pairModel.find({});

    for (const document of documentsToUpdate) {
      const symbol = document.symbol;
      const uniqueExchangeId = document.uniqueExchangeId;

      try {
        const response = await axios.get(
          `https://api.huobi.pro/market/detail?symbol=${symbol.toLowerCase()}usdt`
        );

        const responseData = response.data.tick;

        if (symbol && uniqueExchangeId === "huobi_4") {
          const updateData = {
            price: parseFloat(responseData.close),
            lowPrice: parseFloat(responseData.low),
            highPrice: parseFloat(responseData.high),
            openPrice: parseFloat(responseData.open),
            volume: parseFloat(responseData.vol),
            amout: parseFloat(responseData.amount),
            tradeCount: parseFloat(responseData.count),
          };

          await pairModel.updateOne(
            { _id: document._id },
            { $set: updateData, upsert: true, new: true }
          );

          // logger.info(`Updated data for ${symbol}`);
        }
      } catch (error) {
        // logger.error(`Error updating data for ${symbol}: ${error.message}`);
      }
    }
  } catch (error) {
    logger.error("Error updating Huobi data:", error.message);
  }
};

cron.schedule("*/1 * * * *", async () => {
  await updateHuobiPair();
  // logger.info("Huobi Pair Updated");
});

module.exports = { HuobiPairDb };
