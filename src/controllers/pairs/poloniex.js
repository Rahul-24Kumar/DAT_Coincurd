const axios = require("axios");
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
          updatedData.priceUsd = parseFloat(responseData.close);
          updatedData.lowPrice = parseFloat(responseData.low);
          updatedData.highPrice = parseFloat(responseData.high);
          updatedData.volumeUsd24Hr = parseFloat(responseData.quantity);
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

module.exports = { poloniexPairDb };
