const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const pairModel = require("../../models/pairModel/currencyPairs");

const OkxPairDb = async (req, res) => {
  try {
    const OkxData = [
      {
        coinId: "bitcoin",
        rank: 1,
        coinName: "Bitcoin",
        symbol: "BTC",
        uniqueCoinId: "BTC_1",
        uniqueExchangeId: "okx_6",
        circulatingSupply: 19460625,
        maxSupply: 21000000,
      },
      {
        coinId: "ethereum",
        rank: 2,
        coinName: "Ethereum",
        symbol: "ETH",
        uniqueCoinId: "ETH_2",
        uniqueExchangeId: "okx_6",
        circulatingSupply: 120131756.16935974,
      },
      {
        coinId: "binance-coin",
        rank: 3,
        coinName: "BNB",
        symbol: "BNB",
        uniqueCoinId: "BNB_3",
        uniqueExchangeId: "okx_6",
        circulatingSupply: 166801148,
        maxSupply: 166801148,
      },
      {
        coinId: "solana",
        rank: 4,
        coinName: "Solana",
        symbol: "SOL",
        uniqueCoinId: "SOL_4",
        uniqueExchangeId: "okx_6",
        circulatingSupply: 82842337234.0993,
      },

      {
        coinId: "polkadot",
        rank: 5,
        symbol: "DOT",
        coinName: "Polkadot",
        uniqueCoinId: "DOT_5",
        uniqueExchangeId: "okx_6",
        circulatingSupply: 1265884143.59824,
      },
      {
        coinId: "xrp",
        rank: 6,
        coinName: "XRP",
        symbol: "XRP",
        uniqueCoinId: "XRP_6",
        uniqueExchangeId: "okx_6",
        circulatingSupply: 45404028640,
        maxSupply: 100000000000,
      },
    ];

    const coinPairName = OkxData.map((e) => e.symbol);
    const coinSymbols = coinPairName.map((symbol) => `${symbol}-USDT`);

    for (const symbol of coinSymbols) {
      try {
        const response = await axios.get(
          `https://www.okx.com/api/v5/market/index-tickers?instId=${symbol}`
        );

        const matchingDataIndex = OkxData.findIndex(
          (data) => data.symbol === symbol.replace("-USDT", "")
        );

        if (matchingDataIndex !== -1) {
          const responseData = response.data.data[0];

          const updatedData = OkxData[matchingDataIndex];

          updatedData.pairName = symbol;

          updatedData.price = parseFloat(responseData.idxPx);
          updatedData.lowPrice = parseFloat(responseData.low24h);
          updatedData.highPrice = parseFloat(responseData.high24h);
          updatedData.openPrice = parseFloat(responseData.open24h);
          updatedData.apiLink = `https://www.okx.com/api/v5/market/index-tickers?instId=${symbol}`;

          OkxData[matchingDataIndex] = updatedData;
        }
      } catch (error) {
        logger.error(`Error fetching data for ${symbol}:`, error.message);
      }
    }

    await pairModel.insertMany(OkxData);

    return res.status(200).send({
      status: true,
      message: "Data updated successfully.",
      data: OkxData,
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateOkxPair = async () => {
  try {
    const documentsToUpdate = await pairModel.find({});

    for (const document of documentsToUpdate) {
      const symbol = document.symbol;
      const uniqueExchangeId = document.uniqueExchangeId;

      try {
        const response = await axios.get(
          `https://www.okx.com/api/v5/market/index-tickers?instId=${symbol}-USDT`
        );

        const responseData = response.data.data[0];

        if (
          symbol.toUpperCase() === responseData.instId.replace("-USDT", "") &&
          uniqueExchangeId === "okx_6"
        ) {
          const updateData = {
            price: parseFloat(responseData.idxPx),
            lowPrice: parseFloat(responseData.low24h),
            highPrice: parseFloat(responseData.high24h),
            openPrice: parseFloat(responseData.open24h),
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
    logger.error("Error updating Okx data:", error.message);
  }
};

cron.schedule("*/1 * * * *", async () => {
  await updateOkxPair();
  // logger.info("Okx Pair Updated");
});

module.exports = { OkxPairDb };
