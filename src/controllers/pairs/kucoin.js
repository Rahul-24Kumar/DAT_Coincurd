const axios = require("axios");
const logger = require("../../../logger");
const pairModel = require("../../models/pairModel/currencyPairs");

const kucoinPairDb = async (req, res) => {
  try {
    const kucoinData = [
      {
        coinId: "bitcoin",
        rank: 1,
        coinName: "Bitcoin",
        symbol: "BTC",
        uniqueCoinId: "BTC_1",
        uniqueExchangeId: "kucoin_5",
        circulatingSupply: 19460625,
        maxSupply: 21000000,
      },
      {
        coinId: "ethereum",
        rank: 2,
        coinName: "Ethereum",
        symbol: "ETH",
        uniqueCoinId: "ETH_2",
        uniqueExchangeId: "kucoin_5",
        circulatingSupply: 120131756.16935974,
      },
      {
        coinId: "binance-coin",
        rank: 3,
        coinName: "BNB",
        symbol: "BNB",
        uniqueCoinId: "BNB_3",
        uniqueExchangeId: "kucoin_5",
        circulatingSupply: 166801148,
        maxSupply: 166801148,
      },
      {
        coinId: "solana",
        rank: 4,
        coinName: "Solana",
        symbol: "SOL",
        uniqueCoinId: "SOL_4",
        uniqueExchangeId: "kucoin_5",
        circulatingSupply: 82842337234.0993,
      },

      {
        coinId: "polkadot",
        rank: 5,
        symbol: "DOT",
        uniqueCoinId: "DOT_5",
        uniqueExchangeId: "kucoin_5",
        circulatingSupply: 1265884143.59824,
      },
      {
        coinId: "xrp",
        rank: 6,
        coinName: "XRP",
        symbol: "XRP",
        uniqueCoinId: "XRP_6",
        uniqueExchangeId: "kucoin_5",
        circulatingSupply: 45404028640,
        maxSupply: 100000000000,
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
          updatedData.priceUsd = parseFloat(responseData.last);
          updatedData.priceChange = parseFloat(responseData.changePrice);
          updatedData.changePercent24Hr = parseFloat(responseData.changeRate);
          updatedData.weightedAvgPrice = parseFloat(responseData.averagePrice);

          updatedData.highPrice = parseFloat(responseData.high);
          updatedData.lowPrice = parseFloat(responseData.low);

          updatedData.volumeUsd24Hr = parseFloat(responseData.vol);

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

module.exports = { kucoinPairDb };
