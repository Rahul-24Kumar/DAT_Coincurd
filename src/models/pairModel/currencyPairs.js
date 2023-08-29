const mongoose = require("mongoose");

const pairCurrency = new mongoose.Schema(
  {
    rank: {
      type: Number,
    },

    coinId: {
      type: String,
    },

    uniqueCoinId: {
      type: String,
    },

    uniqueExchangeId: {
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

    price: {
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

    markPrice: {
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

    bidQty: {
      type: Number,
    },

    amount: {
      type: Number,
    },

    bidPrice: {
      type: Number,
    },

    logoLink: {
      type: String,
    },

    marketCap: {
      type: Number,
    },

    volume: {
      type: Number,
    },

    weightedAvgPrice: {
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

    buyPrice: {
      type: Number,
    },

    sellPrice: {
      type: Number,
    },

    firstId: {
      type: String,
    },

    lastId: {
      type: String,
    },

    dextradeId: {
      type: Number,
    },

    huobiId: {
      type: Number,
    },

    tradeCount: {
      type: Number,
    },

    min_trade: {
      type: Number,
    },

    openTime: {
      type: Number,
    },

    priceChange: {
      type: Number,
    },

    changePercent24Hr: {
      type: Number,
    },

    openPrice_24hr: {
      type: Number,
    },

    maxSupply: {
      type: Number,
    },

    totalSupply: {
      type: Number,
    },

    circulatingSupply: {
      type: Number,
    },

    issueDate: {
      type: Date,
    },

    coinDescription: {
      type: String,
    },

    apiLink: {
      type: String,
    },

    whitePaperLink: [
      {
        type: String,
      },
    ],

    gitHubLink: [
      {
        type: String,
      },
    ],

    listedExchanges: [
      {
        type: String,
      },
    ],

    tags: [
      {
        category: {
          type: String,
          enum: [
            "Category",
            "Algorithm",
            "Industry",
            "Platform",
            "Self-Reported Tags",
          ],
        },
        values: [String],

        _id: false,
      },
    ],

    contractAddress: [
      {
        Network: {
          type: String,
        },

        Address: {
          type: String,
        },

        _id: false,
      },
    ],

    chainExlorers: [
      {
        type: String,
      },
    ],

    supportedWallet: [
      {
        walletName: {
          type: String,
        },

        link: {
          type: String,
        },
        _id: false,
      },
    ],

    officialLinks: [
      {
        type: String,
      },
    ],

    socialLinks: {
      Facebook: {
        type: String,
      },

      Instagram: {
        type: String,
      },

      Twitter: {
        type: String,
      },

      Reddit: {
        type: String,
      },

      Telegram: {
        type: String,
      },

      LinkedIn: {
        type: String,
      },

      YouTube: {
        type: String,
      },

      Quora: {
        type: String,
      },

      Messenger: {
        type: String,
      },

      TikTok: {
        type: String,
      },

      Tumblr: {
        type: String,
      },

      Pinterest: {
        type: String,
      },

      Discord: {
        type: String,
      },

      Chat: {
        type: String,
      },

      Message_Board: {
        type: String,
      },

      Explorer1: {
        type: String,
      },

      Explorer2: {
        type: String,
      },

      Explorer3: {
        type: String,
      },

      Explorer4: {
        type: String,
      },
    },

    time: {
      type: Number,
    },

    dbtime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("currencyPair", pairCurrency);
