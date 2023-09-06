const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const pairModel = require("../../models/pairModel/currencyPairs");

const kucoinPairDb = async (req, res) => {
  try {
    const kucoinData = [
      // {
      //   coinId: "bitcoin",
      //   rank: 1,
      //   coinName: "Bitcoin",
      //   symbol: "BTC",
      //   uniqueCoinId: "BTC_1",
      //   uniqueExchangeId: "kucoin_5",
      //   circulatingSupply: 19460625,
      //   maxSupply: 21000000,
      // },
      // {
      //   coinId: "ethereum",
      //   rank: 2,
      //   coinName: "Ethereum",
      //   symbol: "ETH",
      //   uniqueCoinId: "ETH_2",
      //   uniqueExchangeId: "kucoin_5",
      //   circulatingSupply: 120131756.16935974,
      // },
      // {
      //   coinId: "binance-coin",
      //   rank: 3,
      //   coinName: "BNB",
      //   symbol: "BNB",
      //   uniqueCoinId: "BNB_3",
      //   uniqueExchangeId: "kucoin_5",
      //   circulatingSupply: 166801148,
      //   maxSupply: 166801148,
      // },
      // {
      //   coinId: "solana",
      //   rank: 4,
      //   coinName: "Solana",
      //   symbol: "SOL",
      //   uniqueCoinId: "SOL_4",
      //   uniqueExchangeId: "kucoin_5",
      //   circulatingSupply: 82842337234.0993,
      // },

      // {
      //   coinId: "polkadot",
      //   rank: 5,
      //   symbol: "DOT",
      //   coinName: "Polkadot",
      //   uniqueCoinId: "DOT_5",
      //   uniqueExchangeId: "kucoin_5",
      //   circulatingSupply: 1265884143.59824,
      // },
      // {
      //   coinId: "xrp",
      //   rank: 6,
      //   coinName: "XRP",
      //   symbol: "XRP",
      //   uniqueCoinId: "XRP_6",
      //   uniqueExchangeId: "kucoin_5",
      //   circulatingSupply: 45404028640,
      //   maxSupply: 100000000000,
      // },

      {
        coinId: "cardano",
        rank: 7,
        coinName: "Cardano",
        symbol: "ADA",
        uniqueCoinId: "ADA_7",
        uniqueExchangeId: "kucoin_5",
        circulatingSupply: 35048010482.352,
        maxSupply: 45000000000,
      },
      {
        coinId: "tron",
        rank: 8,
        coinName: "TRON",
        symbol: "TRX",
        uniqueCoinId: "TRX_8",
        uniqueExchangeId: "kucoin_5",
        circulatingSupply: 89442500282.20741,
      },

      {
        coinId: "litecoin",
        rank: 9,
        coinName: "Litecoin",
        symbol: "LTC",
        uniqueCoinId: "LTC_5",
        uniqueExchangeId: "kucoin_5",
        circulatingSupply: 73552914.22743528,
        maxSupply: 84000000,
      },
      {
        coinId: "polygon",
        rank: 10,
        coinName: "Polygon",
        symbol: "MATIC",
        uniqueCoinId: "MATIC_10",
        uniqueExchangeId: "kucoin_5",
        circulatingSupply: 9319469069.28493,
        maxSupply: 10000000000,
      },


    ];

    const coinPairName = kucoinData.map((e) => e.symbol);
    const coinSymbols = coinPairName.map((symbol) => `${symbol}-USDT`);

    for (const symbol of coinSymbols) {
      try {
        const response = await axios.get(
          `https://api.kucoin.com/api/v1/market/stats?symbol=${symbol}`
        );

        const matchingDataIndex = kucoinData.findIndex(
          (data) => data.symbol === symbol.replace("-USDT", "")
        );

        if (matchingDataIndex !== -1) {
          const responseData = response.data.data;

          const updatedData = kucoinData[matchingDataIndex];

          updatedData.pairName = symbol;
          updatedData.price = parseFloat(responseData.last);
          updatedData.priceChange = parseFloat(responseData.changePrice);
          updatedData.changePercent24Hr = parseFloat(responseData.changeRate);
          updatedData.weightedAvgPrice = parseFloat(responseData.averagePrice);

          updatedData.highPrice = parseFloat(responseData.high);
          updatedData.lowPrice = parseFloat(responseData.low);

          updatedData.volume = parseFloat(responseData.vol);

          updatedData.time = parseFloat(responseData.time);

          updatedData.buyPrice = parseFloat(responseData.buy);

          updatedData.sellPrice = parseFloat(responseData.sell);

          updatedData.apiLink = `https://api.kucoin.com/api/v1/market/stats?symbol=${symbol}`;

          kucoinData[matchingDataIndex] = updatedData;
        }
      } catch (error) {
        logger.error(`Error fetching data for ${symbol}:`, error.message);
      }
    }

    await pairModel.insertMany(kucoinData);

    return res.status(200).send({
      status: true,
      message: "Data updated successfully.",
      data: kucoinData,
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateKucoinPair = async () => {
  try {
    const documentsToUpdate = await pairModel.find({});

    for (const document of documentsToUpdate) {
      const symbol = document.symbol;
      const uniqueExchangeId = document.uniqueExchangeId;

      try {
        const response = await axios.get(
          `https://api.kucoin.com/api/v1/market/stats?symbol=${symbol}-USDT`
        );

        const responseData = response.data.data;

        if (
          symbol.toUpperCase() === responseData.symbol.replace("-USDT", "") &&
          uniqueExchangeId === "kucoin_5"
        ) {
          const updateData = {
            price: parseFloat(responseData.last),
            priceChange: parseFloat(responseData.changePrice),
            changePercent24Hr: parseFloat(responseData.changeRate),
            weightedAvgPrice: parseFloat(responseData.averagePrice),
            highPrice: parseFloat(responseData.high),
            lowPrice: parseFloat(responseData.low),
            volume: parseFloat(responseData.vol),
            time: parseFloat(responseData.time),
            buyPrice: parseFloat(responseData.buy),
            sellPrice: parseFloat(responseData.sell),
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
    logger.error("Error updating KuCoin data:", error.message);
  }
};

cron.schedule("*/1 * * * *", async () => {
  await updateKucoinPair();
  // logger.info("Kucoin Pair Updated");
});

module.exports = { kucoinPairDb };
