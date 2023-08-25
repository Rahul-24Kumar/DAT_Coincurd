const axios = require("axios");
const logger = require("../../../logger");
const pairModel = require("../../models/pairModel/currencyPairs");

const bybitPairDb = async (req, res) => {
  try {
    const bybitData = [
      {
        coinId: "bitcoin",
        rank: 1,
        coinName: "Bitcoin",
        symbol: "BTC",
        uniqueCoinId: "BTC_1",
        uniqueExchangeId: "bybit_2",
        circulatingSupply: 19460625,
        maxSupply: 21000000,
      },
      {
        coinId: "ethereum",
        rank: 2,
        coinName: "Ethereum",
        symbol: "ETH",
        uniqueCoinId: "ETH_2",
        uniqueExchangeId: "bybit_2",
        circulatingSupply: 120131756.16935974,
      },
      {
        coinId: "binance-coin",
        rank: 3,
        coinName: "BNB",
        symbol: "BNB",
        uniqueCoinId: "BNB_3",
        uniqueExchangeId: "bybit_2",
        circulatingSupply: 166801148,
        maxSupply: 166801148,
      },
      {
        coinId: "solana",
        rank: 4,
        coinName: "Solana",
        symbol: "SOL",
        uniqueCoinId: "SOL_4",
        uniqueExchangeId: "bybit_2",
        circulatingSupply: 82842337234.0993,
      },

      {
        coinId: "polkadot",
        rank: 5,
        symbol: "DOT",
        uniqueCoinId: "DOT_5",
        uniqueExchangeId: "bybit_2",
        circulatingSupply: 1265884143.59824,
      },
      {
        coinId: "xrp",
        rank: 6,
        coinName: "XRP",
        symbol: "XRP",
        uniqueCoinId: "XRP_6",
        uniqueExchangeId: "bybit_2",
        circulatingSupply: 45404028640,
        maxSupply: 100000000000,
      },
    ];

    const coinPairName = bybitData.map((e) => e.symbol);
    const coinSymbols = coinPairName.map((symbol) => `${symbol}USDT`);

    for (const symbol of coinSymbols) {
      try {
        const response = await axios.get(
          `https://api-testnet.bybit.com/spot/v3/public/quote/ticker/24hr?symbol=${symbol}`
        );

        const matchingDataIndex = bybitData.findIndex(
          (data) => data.symbol === symbol.replace("USDT", "")
        );

        if (matchingDataIndex !== -1) {
          const responseData = response.data.result;

          const updatedData = bybitData[matchingDataIndex];

          updatedData.pairName = symbol;
          updatedData.priceUsd = parseFloat(responseData.lp);

          updatedData.highPrice = parseFloat(responseData.h);
          updatedData.lowPrice = parseFloat(responseData.l);

          updatedData.volumeUsd24Hr = parseFloat(responseData.v);
          updatedData.time = parseFloat(responseData.t);
          updatedData.quoteVolume = parseFloat(responseData.qv);

          updatedData.askPrice = parseFloat(responseData.ap);
          updatedData.bidPrice = parseFloat(responseData.bp);
          updatedData.openPrice = parseFloat(responseData.o);

          updatedData.apiLink = `https://api-testnet.bybit.com/spot/v3/public/quote/ticker/24hr?symbol=${symbol}`;

          bybitData[matchingDataIndex] = updatedData;
        }
      } catch (error) {
        logger.error(`Error fetching data for ${symbol}:`, error.message);
      }
    }

    await pairModel.insertMany(bybitData);

    return res.status(200).send({
      status: true,
      message: "Data updated successfully.",
      data: bybitData,
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { bybitPairDb };
