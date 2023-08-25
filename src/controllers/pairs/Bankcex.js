const axios = require("axios");
const cron = require("node-cron");
const logger = require("../../../logger");
const pairModel = require("../../models/pairModel/currencyPairs");

const BankcexPairDb = async (req, res) => {
  try {
    const bankcexData = [
      {
        coinId: "bitcoin",
        rank: 1,
        coinName: "Bitcoin",
        symbol: "BTC",
        uniqueCoinId: "BTC_1",
        uniqueExchangeId: "bankcex",
        circulatingSupply: 19460625,
        maxSupply: 21000000,
      },
      {
        coinId: "ethereum",
        rank: 2,
        coinName: "Ethereum",
        symbol: "ETH",
        uniqueCoinId: "ETH_2",
        uniqueExchangeId: "bankcex",
        circulatingSupply: 120131756.16935974,
      },
      {
        coinId: "binance-coin",
        rank: 3,
        coinName: "BNB",
        symbol: "BNB",
        uniqueCoinId: "BNB_3",
        uniqueExchangeId: "bankcex",
        circulatingSupply: 166801148,
        maxSupply: 166801148,
      },
      {
        coinId: "solana",
        rank: 4,
        coinName: "Solana",
        symbol: "SOL",
        uniqueCoinId: "SOL_4",
        uniqueExchangeId: "bankcex",
        circulatingSupply: 82842337234.0993,
      },

      {
        coinId: "usd-coin",
        rank: 5,
        coinName: "USD Coin",
        symbol: "USDC",
        uniqueCoinId: "USDC_5",
        uniqueExchangeId: "bankcex",
        circulatingSupply: 26258163462.121563,
      },
      {
        coinId: "xrp",
        rank: 6,
        coinName: "XRP",
        symbol: "XRP",
        uniqueCoinId: "XRP_6",
        uniqueExchangeId: "bankcex",
        circulatingSupply: 45404028640,
        maxSupply: 100000000000,
      },
    ];

    const coinPairName = bankcexData.map((e) => e.symbol);
    const coinSymbols = coinPairName.map((symbol) => `${symbol}USDT`);

    for (const symbol of coinSymbols) {
      try {
        const response = await axios.get(
          `https://api.bankcex.com/api/v1/returnTicker?symbol=${symbol}`
        );

        const matchingDataIndex = bankcexData.findIndex(
          (data) => data.symbol === symbol.replace("USDT", "")
        );

        if (matchingDataIndex !== -1) {
          const responseData = response.data[symbol];
          const updatedData = bankcexData[matchingDataIndex];

          updatedData.pairName = symbol;
          updatedData.priceUsd = responseData.last;
          updatedData.lowsetAsk = responseData.lowsetAsk;
          updatedData.highestBid = responseData.highestBid;
          updatedData.priceChangePercent = responseData.percentChange;
          updatedData.baseVolume = responseData.baseVolume;
          updatedData.quoteVolume = responseData.quoteVolume;

          updatedData.openTime = responseData.openTime;
          updatedData.closeTime = responseData.closeTime;
          updatedData.low24hr = responseData.low24hr;
          updatedData.high24hr = responseData.high24hr;
          updatedData.isFrozen = responseData.isFrozen;

          updatedData.apiLink = `https://api.bankcex.com/api/v1/returnTicker?symbol=${symbol}`;
          bankcexData[matchingDataIndex] = updatedData;
        }
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error.message);
      }
    }

    await pairModel.insertMany(bankcexData);

    return res
      .status(200)
      .send({ status: true, message: "Data updated successfully." });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { BankcexPairDb };
