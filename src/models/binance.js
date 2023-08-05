const mongoose = require("mongoose");

const binanceSchema = new mongoose.Schema(
  {
    coinId: {
      type: String,
    },

    coinName: {
      type: String,
    },

    symbol: {
      type: String,
    },

    pairName: {
      type: String,
    },

    volume: {
      type: String,
    },

    baseVolume: {
      type: String,
    },

    quoteVolume: {
      type: String,
    },

    lastPrice: {
      type: String,
    },

    prevClosePrice: {
      type: String,
    },

    lastPrice1h: {
      type: String,
    },

    highPrice: {
      type: String,
    },

    lowPrice: {
      type: String,
    },

    price: {
      type: String,
    },

    openPrice: {
      type: String,
    },

    askPrice: {
      type: String,
    },

    baseCurrency: {
      type: String,
    },

    quoteCurrency: {
      type: String,
    },

    askQty: {
      type: String,
    },

    lastQty: {
      type: String,
    },

    bidQty: {
      type: String,
    },

    amount: {
      type: String,
    },

    bidPrice: {
      type: String,
    },

    priceChange: {
      type: String,
    },

    priceChangePercent: {
      type: String,
    },

    weightedAvgPrice: {
      type: String,
    },

    change1h: {
      type: String,
    },


    minBuy: {
      type: String,
    },

    minSell: {
      type: String,
    },

    sellFee: {
      type: String,
    },

    buyFee: {
      type: String,
    },

    firstId: {
      type: Number,
    },

    lastId: {
      type: Number,
    },

    count: {
      type: Number,
    },
    openTime: {
      type: Number,
    },

    closeTime: {
      type: Number,
    },

    time: {
      type: String,
    },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("binance", binanceSchema);
