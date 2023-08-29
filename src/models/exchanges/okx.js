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
      type: String,
    },

    quoteCurrency: {
      type: String,
    },

    askQty: {
      type: Number,
    },

    lastQty: {
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

    change1h: {
      type: Number,
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
