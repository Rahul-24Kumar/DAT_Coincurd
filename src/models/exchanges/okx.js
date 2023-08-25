const mongoose = require("mongoose");

const okxSchema = new mongoose.Schema(
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


    exchangeName: {
      type: String,
    },


    exchangeId: {
      type: String,
    },

    uniqueExchangeId: {
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
      type: String,
    },

    lastId: {
      type: String,
    },

    count: {
      type: String,
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

    dbtime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("okx", okxSchema);
