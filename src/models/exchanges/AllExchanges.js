const mongoose = require("mongoose");

let exchange = new mongoose.Schema(
  {
    rank: {
      type: String,
    },

    exchangeId: {
      type: String,
    },

    uniqueExchangeId: {
      type: String,
    },

    exchangeName: {
      type: String,
    },

    percentTotalVolume: {
      type: Number,
      default: 0,
    },

    volume: {
      type: Number,
    },

    tradingPairs: {
      type: Number,
      default: 0,
    },

    exchangeUrl: {
      type: String,
    },

    type: {
      type: String,
      enum: ["CEX", "DEX"],
    },

    AvgLiquidity: {
      type: String,
    },

    totalAssets: {
      type: Number,
    },

    issueDate: {
      type: Date,
    },

    developerApiLink: {
      type: String,
    },

    weeklyVisit: {
      type: Number,
    },

    year_established: {
      type: String,
    },

    country: {
      type: String,
    },

    description: {
      type: String,
    },

    socialLinks: {
      Website: {
        type: String,
        default: null,
      },

      Explorer: {
        type: String,
        default: null,
      },

      Facebook: {
        type: String,
        default: null,
      },

      Twitter: {
        type: String,
        default: null,
      },

      Reddit: {
        type: String,
        default: null,
      },

      Telegram: {
        type: String,
        default: null,
      },

      GitHub: {
        type: String,
        default: null,
      },

      Discord: {
        type: String,
        default: null,
      },

      Chat: {
        type: String,
        default: null,
      },

      Message_Board: {
        type: String,
        default: null,
      },

      Explorer1: {
        type: String,
        default: null,
      },

      Explorer2: {
        type: String,
        default: null,
      },

      Explorer3: {
        type: String,
        default: null,
      },

      Explorer4: {
        type: String,
        default: null,
      },
    },

    updated: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("allExchange", exchange);
