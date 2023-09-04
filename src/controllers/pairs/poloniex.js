const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const pairModel = require("../../models/pairModel/currencyPairs");

const poloniexPairDb = async (req, res) => {
  try {
    const poloniexData = [
      {
        coinId: "bitcoin",
        rank: 1,
        coinName: "Bitcoin",
        symbol: "BTC",
        uniqueCoinId: "BTC_1",
        uniqueExchangeId: "poloniex_3",
        circulatingSupply: 19460625,
        maxSupply: 21000000,
      },
      {
        coinId: "ethereum",
        rank: 2,
        coinName: "Ethereum",
        symbol: "ETH",
        uniqueCoinId: "ETH_2",
        uniqueExchangeId: "poloniex_3",
        circulatingSupply: 120131756.16935974,
      },
      {
        coinId: "binance-coin",
        rank: 3,
        coinName: "BNB",
        symbol: "BNB",
        uniqueCoinId: "BNB_3",
        uniqueExchangeId: "poloniex_3",
        circulatingSupply: 166801148,
        maxSupply: 166801148,
      },
      {
        coinId: "solana",
        rank: 4,
        coinName: "Solana",
        symbol: "SOL",
        uniqueCoinId: "SOL_4",
        uniqueExchangeId: "poloniex_3",
        circulatingSupply: 82842337234.0993,
      },

      {
        coinId: "polkadot",
        rank: 5,
        symbol: "DOT",
        coinName: "Polkadot",
        uniqueCoinId: "DOT_5",
        uniqueExchangeId: "poloniex_3",
        circulatingSupply: 1265884143.59824,
      },
      {
        coinId: "xrp",
        rank: 6,
        coinName: "XRP",
        symbol: "XRP",
        uniqueCoinId: "XRP_6",
        uniqueExchangeId: "poloniex_3",
        circulatingSupply: 45404028640,
        maxSupply: 100000000000,
      },
    ];

    const coinPairName = poloniexData.map((e) => e.symbol);
    const coinSymbols = coinPairName.map((symbol) => `${symbol}_USDT`);

    for (const symbol of coinSymbols) {
      try {
        const response = await axios.get(
          `https://api.poloniex.com/markets/${symbol}/ticker24h`
        );

        const matchingDataIndex = poloniexData.findIndex(
          (data) => data.symbol === symbol.replace("_USDT", "")
        );

        if (matchingDataIndex !== -1) {
          const responseData = response.data;

          const updatedData = poloniexData[matchingDataIndex];

          updatedData.pairName = symbol;

          updatedData.openPrice = parseFloat(responseData.open);
          updatedData.price = parseFloat(responseData.close);
          updatedData.lowPrice = parseFloat(responseData.low);
          updatedData.highPrice = parseFloat(responseData.high);
          updatedData.volume = parseFloat(responseData.quantity);
          updatedData.amount = parseFloat(responseData.amount);

          updatedData.tradeCount = parseFloat(responseData.tradeCount);
          updatedData.openTime = parseFloat(responseData.startTime);
          updatedData.closeTime = parseFloat(responseData.closeTime);
          updatedData.bidPrice = parseFloat(responseData.bid);
          updatedData.bidQty = parseFloat(responseData.bidQuantity);
          updatedData.askPrice = responseData.askPrice;

          updatedData.askQty = parseFloat(responseData.askQuantity);
          updatedData.time = parseFloat(responseData.ts);
          updatedData.markPrice = parseFloat(responseData.markPrice);

          updatedData.apiLink = `https://api.poloniex.com/markets/${symbol}/ticker24h`;

          poloniexData[matchingDataIndex] = updatedData;
        }
      } catch (error) {
        logger.error(`Error fetching data for ${symbol}:`, error.message);
      }
    }

    await pairModel.insertMany(poloniexData);

    return res.status(200).send({
      status: true,
      message: "Data updated successfully.",
      data: poloniexData,
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updatePoloniexPair = async () => {
  try {
    const documentsToUpdate = await pairModel.find({});

    for (const document of documentsToUpdate) {
      const symbol = document.symbol;
      const uniqueExchangeId = document.uniqueExchangeId;

      try {
        const response = await axios.get(
          `https://api.poloniex.com/markets/${symbol}_USDT/ticker24h`
        );

        const responseData = response.data;

        if (
          symbol.toUpperCase() === responseData.symbol.replace("_USDT", "") &&
          uniqueExchangeId === "poloniex_3"
        ) {
          const updateData = {
            openPrice: parseFloat(responseData.open),
            price: parseFloat(responseData.close),
            lowPrice: parseFloat(responseData.low),
            highPrice: parseFloat(responseData.high),
            volume: parseFloat(responseData.quantity),
            amount: parseFloat(responseData.amount),
            tradeCount: parseFloat(responseData.tradeCount),
            openTime: parseFloat(responseData.startTime),
            closeTime: parseFloat(responseData.closeTime),
            bidPrice: parseFloat(responseData.bid),
            bidQty: parseFloat(responseData.bidQuantity),
            askPrice: responseData.askPrice,
            askQty: parseFloat(responseData.askQuantity),
            time: parseFloat(responseData.ts),
            markPrice: parseFloat(responseData.markPrice),
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
    logger.error("Error updating Poloniex data:", error.message);
  }
};

cron.schedule("*/1 * * * *", async () => {
  await updatePoloniexPair();
  // logger.info("Poloniex Pair Updated");
});

module.exports = { poloniexPairDb };
