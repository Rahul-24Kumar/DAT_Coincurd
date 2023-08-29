const axios = require("axios");
const logger = require("../../../logger");
const pairModel = require("../../models/pairModel/currencyPairs");

const BinancePairDb = async (req, res) => {
  try {
    const BinanceData = [
      {
        coinId: "bitcoin",
        rank: 1,
        coinName: "Bitcoin",
        symbol: "BTC",
        uniqueCoinId: "BTC_1",
        uniqueExchangeId: "binance_1",
        circulatingSupply: 19460625,
        maxSupply: 21000000,
      },
      {
        coinId: "ethereum",
        rank: 2,
        coinName: "Ethereum",
        symbol: "ETH",
        uniqueCoinId: "ETH_2",
        uniqueExchangeId: "binance_1",
        circulatingSupply: 120131756.16935974,
      },
      {
        coinId: "binance-coin",
        rank: 3,
        coinName: "BNB",
        symbol: "BNB",
        uniqueCoinId: "BNB_3",
        uniqueExchangeId: "binance_1",
        circulatingSupply: 166801148,
        maxSupply: 166801148,
      },
      {
        coinId: "solana",
        rank: 4,
        coinName: "Solana",
        symbol: "SOL",
        uniqueCoinId: "SOL_4",
        uniqueExchangeId: "binance_1",
        circulatingSupply: 82842337234.0993,
      },

      {
        coinId: "polkadot",
        rank: 5,
        symbol: "DOT",
        uniqueCoinId: "DOT_5",
        uniqueExchangeId: "binance_1",
        circulatingSupply: 1265884143.59824,
      },
      {
        coinId: "xrp",
        rank: 6,
        coinName: "XRP",
        symbol: "XRP",
        uniqueCoinId: "XRP_6",
        uniqueExchangeId: "binance_1",
        circulatingSupply: 45404028640,
        maxSupply: 100000000000,
      },
    ];

    const coinPairName = BinanceData.map((e) => e.symbol);
    const coinSymbols = coinPairName.map((symbol) => `${symbol}USDT`);

    for (const symbol of coinSymbols) {
      try {
        const response = await axios.get(
          `https://www.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
        );

        const matchingDataIndex = BinanceData.findIndex(
          (data) => data.symbol === symbol.replace("USDT", "")
        );

        if (matchingDataIndex !== -1) {
          const responseData = response.data;

          const updatedData = BinanceData[matchingDataIndex];

          updatedData.pairName = symbol;
          updatedData.price = parseFloat(responseData.lastPrice);
          updatedData.priceChange = parseFloat(responseData.priceChange);
          updatedData.changePercent24Hr = parseFloat(
            responseData.priceChangePercent
          );
          updatedData.weightedAvgPrice = parseFloat(
            responseData.weightedAvgPrice
          );
          updatedData.prevClosePrice = parseFloat(responseData.prevClosePrice);

          updatedData.lastQty = parseFloat(responseData.lastQty);

          updatedData.bidPrice = parseFloat(responseData.bidPrice);
          updatedData.bidQty = parseFloat(responseData.bidQty);
          updatedData.askPrice = parseFloat(responseData.askPrice);
          updatedData.askQty = parseFloat(responseData.askQty);
          updatedData.openPrice = parseFloat(responseData.openPrice);
          updatedData.highPrice = parseFloat(responseData.highPrice);
          updatedData.lowPrice = parseFloat(responseData.lowPrice);
          updatedData.quoteVolume = parseFloat(responseData.quoteVolume);

          updatedData.volume = parseFloat(responseData.volume);
          updatedData.openTime = parseFloat(responseData.openTime);
          updatedData.closeTime = parseFloat(responseData.closeTime);
          updatedData.firstId = parseFloat(responseData.firstId);
          updatedData.lastId = parseFloat(responseData.lastId);
          updatedData.tradeCount = parseFloat(responseData.count);

          updatedData.apiLink = `https://www.binance.com/api/v3/ticker/24hr?symbol=${symbol}`;

          BinanceData[matchingDataIndex] = updatedData;
        }
      } catch (error) {
        logger.error(`Error fetching data for ${symbol}:`, error.message);
      }
    }

    await pairModel.insertMany(BinanceData);

    return res.status(200).send({
      status: true,
      message: "Data updated successfully.",
      data: BinanceData,
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { BinancePairDb };
