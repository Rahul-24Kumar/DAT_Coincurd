const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const pairModel = require("../../models/pairModel/currencyPairs");

const DextradePairDb = async (req, res) => {
  try {
    const DextradeData = [
      // {
      //   coinId: "bitcoin",
      //   rank: 1,
      //   coinName: "Bitcoin",
      //   symbol: "BTC",
      //   uniqueCoinId: "BTC_1",
      //   uniqueExchangeId: "dextrade_7",
      //   circulatingSupply: 19460625,
      //   maxSupply: 21000000,
      // },
      // {
      //   coinId: "ethereum",
      //   rank: 2,
      //   coinName: "Ethereum",
      //   symbol: "ETH",
      //   uniqueCoinId: "ETH_2",
      //   uniqueExchangeId: "dextrade_7",
      //   circulatingSupply: 120131756.16935974,
      // },
      // {
      //   coinId: "binance-coin",
      //   rank: 3,
      //   coinName: "BNB",
      //   symbol: "BNB",
      //   uniqueCoinId: "BNB_3",
      //   uniqueExchangeId: "dextrade_7",
      //   circulatingSupply: 166801148,
      //   maxSupply: 166801148,
      // },
      // {
      //   coinId: "solana",
      //   rank: 4,
      //   coinName: "Solana",
      //   symbol: "SOL",
      //   uniqueCoinId: "SOL_4",
      //   uniqueExchangeId: "dextrade_7",
      //   circulatingSupply: 82842337234.0993,
      // },

      // {
      //   coinId: "polkadot",
      //   rank: 5,
      //   symbol: "DOT",
      //   coinName: "Polkadot",
      //   uniqueCoinId: "DOT_5",
      //   uniqueExchangeId: "dextrade_7",
      //   circulatingSupply: 1265884143.59824,
      // },
      // {
      //   coinId: "xrp",
      //   rank: 6,
      //   coinName: "XRP",
      //   symbol: "XRP",
      //   uniqueCoinId: "XRP_6",
      //   uniqueExchangeId: "dextrade_7",
      //   circulatingSupply: 45404028640,
      //   maxSupply: 100000000000,
      // },

      {
        coinId: "cardano",
        rank: 7,
        coinName: "Cardano",
        symbol: "ADA",
        uniqueCoinId: "ADA_7",
        uniqueExchangeId: "dextrade_7",
        circulatingSupply: 35048010482.352,
        maxSupply: 45000000000,
      },
      {
        coinId: "tron",
        rank: 8,
        coinName: "TRON",
        symbol: "TRX",
        uniqueCoinId: "TRX_8",
        uniqueExchangeId: "dextrade_7",
        circulatingSupply: 89442500282.20741,
      },

      {
        coinId: "litecoin",
        rank: 9,
        coinName: "Litecoin",
        symbol: "LTC",
        uniqueCoinId: "LTC_5",
        uniqueExchangeId: "dextrade_7",
        circulatingSupply: 73552914.22743528,
        maxSupply: 84000000,
      },
      {
        coinId: "polygon",
        rank: 10,
        coinName: "Polygon",
        symbol: "MATIC",
        uniqueCoinId: "MATIC_10",
        uniqueExchangeId: "dextrade_7",
        circulatingSupply: 9319469069.28493,
        maxSupply: 10000000000,
      },

    ];

    const coinPairName = DextradeData.map((e) => e.symbol);
    const coinSymbols = coinPairName.map((symbol) => `${symbol}USDT`);

    for (const symbol of coinSymbols) {
      try {
        const response = await axios.get(
          `https://api.dex-trade.com/v1/public/ticker?pair=${symbol}`
        );

        const matchingDataIndex = DextradeData.findIndex(
          (data) => data.symbol === symbol.replace("USDT", "")
        );

        if (matchingDataIndex !== -1) {
          const responseData = response.data.data;

          const updatedData = DextradeData[matchingDataIndex];

          updatedData.pairName = symbol;

          updatedData.dextradeId = parseFloat(responseData.id);
          updatedData.price = parseFloat(responseData.last);
          updatedData.lowPrice = parseFloat(responseData.low);
          updatedData.highPrice = parseFloat(responseData.high);
          updatedData.volume = parseFloat(responseData.volume_24H);
          updatedData.min_trade = parseFloat(responseData.min_trade);

          updatedData.apiLink = `https://api.dex-trade.com/v1/public/ticker?pair=${symbol}`;

          DextradeData[matchingDataIndex] = updatedData;
        }
      } catch (error) {
        logger.error(`Error fetching data for ${symbol}:`, error.message);
      }
    }

    await pairModel.insertMany(DextradeData);

    return res.status(200).send({
      status: true,
      message: "Data updated successfully.",
      data: DextradeData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateDextradePair = async () => {
  try {
    const documentsToUpdate = await pairModel.find({});

    for (const document of documentsToUpdate) {
      const symbol = document.symbol;
      const uniqueExchangeId = document.uniqueExchangeId;

      try {
        const response = await axios.get(
          `https://api.dex-trade.com/v1/public/ticker?pair=${symbol}USDT`
        );

        const responseData = response.data.data;

        if (
          symbol.toUpperCase() === responseData.pair.replace("USDT", "") &&
          uniqueExchangeId === "dextrade_7"
        ) {
          const updateData = {
            price: parseFloat(responseData.last),
            lowPrice: parseFloat(responseData.low),
            highPrice: parseFloat(responseData.high),
            volume: parseFloat(responseData.volume_24H),
            min_trade: parseFloat(responseData.min_trade),
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
    logger.error("Error updating Dextrade data:", error.message);
  }
};

cron.schedule("*/1 * * * *", async () => {
  await updateDextradePair();
  // logger.info("Dextrade Pair Updated");
});

module.exports = { DextradePairDb };
