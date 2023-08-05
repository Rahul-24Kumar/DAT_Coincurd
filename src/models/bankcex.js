const mongoose = require("mongoose");

const bankCexSchema = new mongoose.Schema(
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
      type: Number,
    },

    baseVolume: {
      type: Number,
    },

    quoteVolume: {
      type: Number,
    },

    lastPrice: {
      type: Number,
    },

    prevClosePrice: {
      type: Number,
    },

    lastPrice1h: {
      type: Number,
    },

    highPrice: {
      type: Number,
    },

    lowPrice: {
      type: Number,
    },

    price: {
      type: Number,
    },

    openPrice: {
      type: Number,
    },

    askPrice: {
      type: Number,
    },

    baseCurrency: {
      type: Number,
    },

    quoteCurrency: {
      type: Number,
    },

    askQty: {
      type: Number,
    },

    lastQty: {
      type: Number,
    },

    bidQty: {
        type: Number,
      },

    amount: {
      type: Number,
    },

    bidPrice: {
      type: Number,
    },

    priceChange: {
      type: Number,
    },

    priceChangePercent: {
      type: Number,
    },

    weightedAvgPrice: {
      type: Number,
    },

    openTime: {
      type: Number,
    },

    closeTime: {
      type: Number,
    },

    change1h: {
      type: Number,
    },

    minBuy: {
      type: Number,
    },

    minSell: {
      type: Number,
    },

    sellFee: {
      type: Number,
    },

    buyFee: {
      type: Number,
    },

    firstId: {
      type: String,
    },

    lastId: {
      type: String,
    },

    tradeCount: {
      type: Number,
    },

    openTime: {
      type: String,
    },

    closeTime: {
      type: String,
    },

    time: {
      type: String,
    },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("bankcex", bankCexSchema);
