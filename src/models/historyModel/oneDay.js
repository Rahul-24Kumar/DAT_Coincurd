const mongoose = require("mongoose");

const oneDayData = new mongoose.Schema(
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

    price: {
      type: Number,
    },

    marketCap: {
      type: Number,
    },

    volume: {
      type: Number,
    },

    changePercent24Hr: {
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
            "Others",
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
    },

    insertedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

oneDayData.index(
  { insertedDate: 1 },
  { expireAfterSeconds: 259200 } // 3 day in seconds
);

module.exports = mongoose.model("oneDaydata", oneDayData);
