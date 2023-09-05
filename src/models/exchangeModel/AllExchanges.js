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
    },

    volume: {
      type: Number,
    },

    tradingPairs: {
      type: Number,
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
      },

      Explorer: {
        type: String,
      },

      Facebook: {
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

      GitHub: {
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

    updated: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("allExchange", exchange);
