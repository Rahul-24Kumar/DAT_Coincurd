const mongoose = require("mongoose");

const capCoinSchema = new mongoose.Schema(
  {
    coinId: {
      type: String,
      // default: null,
      unique: true,
    },

    rank: {
      type: String,
      default: null,
    },

    coinName: {
      type: String,
      default: null,
    },

    symbol: {
      type: String,
      default: null,
    },

    priceUsd: {
      type: Number,
      default: null,
    },

    volumeUsd24Hr: {
      type: Number,
      default: null,
    },

    supply: {
      type: Number,
      default: null,
    },

    maxSupply: {
      type: Number,
      default: null,
    },

    marketCapUsd: {
      type: Number,
      default: null,
    },

    changePercent24Hr: {
      type: Number,
      default: null,
    },

    logoLink: {
      type: String,
      default: null,
    },

    whitePaperLink: {
      type: String,
      default: null,
    },

    contractAddress: {
      type: [String],
    },

    issueDate: {
      type: Date,
    },

    coinDescription: {
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

    explorer: {
      type: String,
      default: null,
    },

    vwap24Hr: {
      type: Number,
      default: null,
    },

    time: {
      type: String,
      default: Date.now(),
    },
  },

  {
    timestamps: {
      type: String,
      default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
    },
  }
);

module.exports = mongoose.model("recentcoins", capCoinSchema);
