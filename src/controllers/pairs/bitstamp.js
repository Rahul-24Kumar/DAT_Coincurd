const axios = require("axios");
const logger = require("../../../logger");
const pairModel = require("../../models/pairModel/currencyPairs");

const bitstampPairDb = async (req, res) => {
  try {
    const bitstampData = [
      {
        coinId: "bitcoin",
        rank: 1,
        coinName: "Bitcoin",
        symbol: "BTC",
        uniqueCoinId: "BTC_1",
        uniqueExchangeId: "bitstamp_8",
        circulatingSupply: 19460625,
        maxSupply: 21000000,
      },
      {
        coinId: "ethereum",
        rank: 2,
        coinName: "Ethereum",
        symbol: "ETH",
        uniqueCoinId: "ETH_2",
        uniqueExchangeId: "bitstamp_8",
        circulatingSupply: 120131756.16935974,
      },
      {
        coinId: "binance-coin",
        rank: 3,
        coinName: "BNB",
        symbol: "BNB",
        uniqueCoinId: "BNB_3",
        uniqueExchangeId: "bitstamp_8",
        circulatingSupply: 166801148,
        maxSupply: 166801148,
      },
      {
        coinId: "solana",
        rank: 4,
        coinName: "Solana",
        symbol: "SOL",
        uniqueCoinId: "SOL_4",
        uniqueExchangeId: "bitstamp_8",
        circulatingSupply: 82842337234.0993,
      },

      {
        coinId: "polkadot",
        rank: 5,
        symbol: "DOT",
        uniqueCoinId: "DOT_5",
        uniqueExchangeId: "bitstamp_8",
        circulatingSupply: 1265884143.59824,
      },
      {
        coinId: "xrp",
        rank: 6,
        coinName: "XRP",
        symbol: "XRP",
        uniqueCoinId: "XRP_6",
        uniqueExchangeId: "bitstamp_8",
        circulatingSupply: 45404028640,
        maxSupply: 100000000000,
      },
    ];

    const coinPairName = bitstampData.map((e) => e.symbol);
    const coinSymbols = coinPairName.map((symbol) =>
      `${symbol}USDT`.toLowerCase()
    );

    for (const symbol of coinSymbols) {
      try {
        const response = await axios.get(
          `https://www.bitstamp.net/api/v2/ticker/${symbol}`
        );

        const matchingDataIndex = bitstampData.findIndex(
          (data) => data.symbol === symbol.replace("usdt", "").toUpperCase()
        );

        if (matchingDataIndex !== -1) {
          const responseData = response.data;

          const updatedData = bitstampData[matchingDataIndex];

          updatedData.pairName = symbol;

          updatedData.openPrice = parseFloat(responseData.open);
          updatedData.price = parseFloat(responseData.last);
          updatedData.lowPrice = parseFloat(responseData.low);
          updatedData.highPrice = parseFloat(responseData.high);
          updatedData.volume = parseFloat(responseData.volume);

          updatedData.changePercent24Hr = parseFloat(
            responseData.percent_change_24
          );

          updatedData.bidPrice = parseFloat(responseData.bid);

          updatedData.askPrice = responseData.ask;

          updatedData.time = parseFloat(responseData.timestamp);
          updatedData.weightedAvgPrice = parseFloat(responseData.vwap);

          updatedData.openPrice_24hr = parseFloat(responseData.open_24);
          updatedData.apiLink = `https://www.bitstamp.net/api/v2/ticker/${symbol}`;

          bitstampData[matchingDataIndex] = updatedData;
        }
      } catch (error) {
        logger.error(`Error fetching data for ${symbol}:`, error.message);
      }
    }

    await pairModel.insertMany(bitstampData);

    return res.status(200).send({
      status: true,
      message: "Data updated successfully.",
      data: bitstampData,
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { bitstampPairDb };
