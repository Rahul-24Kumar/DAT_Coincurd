const mongoose = require("mongoose");

const Currency = new mongoose.Schema(
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

    coinName: {
      type: String,
    },

    symbol: {
      type: String,
    },

    logoLink: {
      type: String,
    },

    priceUsd: {
      type: Number,
    },

    marketCapUsd: {
      type: Number,
    },

    volumeUsd24Hr: {
      type: Number,
    },

    changePercent24Hr: {
      type: Number,
    },

    maxSupply: {
      type: String,
    },

    totalSupply: {
      type: String,
    },

    circulatingSupply: {
      type: String,
    },

    issueDate: {
      type: Date,
    },

    coinDescription: {
      type: String,
    },

    listedExchanges: [
      {
        exchangeUrl: {
          type: String,
        },

        apiUrl: {
          type: String,
        },

        _id: false,
      },
    ],

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

    dbtime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("currency", Currency);
