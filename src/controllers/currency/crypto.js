const cron = require("node-cron");
const logger = require("../../../logger");
const currencyModel = require("../../models/currencyModel/cryptocurrency");
const currencyPairs = require("../../models/pairModel/currencyPairs");

const currencyData = [
  {
    coinId: "bitcoin",
    rank: 1,
    coinName: "Bitcoin",
    symbol: "BTC",
    uniqueCoinId: "BTC_1",
    uniqueExchangeId: "binance_1",
    circulatingSupply: 19460625,
    maxSupply: 21000000,
  },

  {
    coinId: "ethereum",
    rank: 2,
    coinName: "Ethereum",
    symbol: "ETH",
    uniqueCoinId: "ETH_2",
    uniqueExchangeId: "binance_1",
    circulatingSupply: 120131756.16935974,
  },

  {
    coinId: "binance-coin",
    rank: 3,
    coinName: "BNB",
    symbol: "BNB",
    uniqueCoinId: "BNB_3",
    uniqueExchangeId: "binance_1",
    circulatingSupply: 166801148,
    maxSupply: 166801148,
  },

  {
    coinId: "solana",
    rank: 4,
    coinName: "Solana",
    symbol: "SOL",
    uniqueCoinId: "SOL_4",
    uniqueExchangeId: "binance_1",
    circulatingSupply: 82842337234.0993,
  },

  {
    coinId: "polkadot",
    rank: 5,
    coinName: "Polkadot",
    symbol: "DOT",
    uniqueCoinId: "DOT_5",
    uniqueExchangeId: "binance_1",
    circulatingSupply: 1265884143.59824,
  },

  {
    coinId: "xrp",
    rank: 6,
    coinName: "XRP",
    symbol: "XRP",
    uniqueCoinId: "XRP_6",
    uniqueExchangeId: "binance_1",
    circulatingSupply: 45404028640,
    maxSupply: 100000000000,
  },
];

const insertCurency = async (req, res) => {
  try {
    const addNewCurrency = await currencyModel.insertMany(currencyData);

    return res
      .status(201)
      .send({ message: "successful", data: addNewCurrency });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send({ message: error.message });
  }
};

const listCurrencyAdmin = async (req, res) => {
  try {
    const { price, circulatingSupply, symbol } = req.body;

    const getAllCoins = await currencyModel.find();

    const getAllCoinsLength = getAllCoins.length;

    const newRank = getAllCoinsLength + 1;

    const uniqueCoinId = symbol + "_" + newRank;

    const marketCap = parseFloat(price) * parseFloat(circulatingSupply);

    const insertInDb = await currencyModel.create({
      ...req.body,
      rank: newRank,
      marketCap: marketCap,
      uniqueCoinId: uniqueCoinId,
    });

    return res.status(201).json({ message: "Successful", data: insertInDb });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllCoins = async (req, res) => {
  try {
    const getCoins = await currencyModel.find({});
    return res.status(200).send({ message: "successful", data: getCoins });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const updateAutomatically = async () => {
  try {
    const getAllPairs = await currencyPairs.find({});

    const coinIdDataMap = new Map();

    for (const entry of getAllPairs) {
      const price = parseFloat(entry.price);
      const volume = parseFloat(entry.volume);

      if (!isNaN(price) && !isNaN(volume)) {
        if (!coinIdDataMap.has(entry.uniqueCoinId)) {
          coinIdDataMap.set(entry.uniqueCoinId, {
            totalPrice: 0,
            totalVolume: 0,
            validEntryCount: 0,
          });
        }

        const coinData = coinIdDataMap.get(entry.uniqueCoinId);
        coinData.totalPrice += price;
        coinData.totalVolume += volume;
        coinData.validEntryCount++;
      }
    }

    // Collect updates in an array
    const bulkUpdates = [];

    for (const [uniqueCoinId, coinData] of coinIdDataMap.entries()) {
      const averagePrice = coinData.totalPrice / coinData.validEntryCount;
      const marketCap = averagePrice * getAllPairs[0].circulatingSupply;

      // Push updates into the array
      bulkUpdates.push({
        updateOne: {
          filter: { uniqueCoinId },
          update: {
            $set: {
              price: averagePrice,
              volume: coinData.totalVolume,
              marketCap: marketCap,
            },
          },
          upsert: true,
        },
      });
    }

    // Use bulkWrite for efficient updates
    if (bulkUpdates.length > 0) {
      await currencyModel.bulkWrite(bulkUpdates);
    }
  } catch (error) {
    logger.error("Error updating currency data:", error);
  }
};

cron.schedule("*/2 * * * *", async () => {
  // logger.info("updating currencies");
  await updateAutomatically();
});

const UpdateCurrency = async (req, res) => {
  try {
    const { uniqueCoinId } = req.params;
    const updateFields = req.body;

    let existingAsset = await currencyModel.findOne({ uniqueCoinId });

    if (!existingAsset) {
      return res.status(404).json({ status: false, message: "Not Found!" });
    }

    const updateNestedFields = (existingObj, updateObj) => {
      for (const key in updateObj) {
        if (updateObj.hasOwnProperty(key)) {
          if (Array.isArray(updateObj[key])) {
            // Handle arrays separately
            if (!existingObj[key]) {
              existingObj[key] = [];
            }

            // Check each item in the array for uniqueness and insert if not found
            updateObj[key].forEach((item) => {
              const existingItem = existingObj[key].find(
                (existingItem) => existingItem === item
              );
              if (!existingItem) {
                existingObj[key].push(item);
              }
            });
          } else if (typeof updateObj[key] === "object") {
            if (!existingObj[key]) {
              existingObj[key] = {};
            }
            updateNestedFields(existingObj[key], updateObj[key]);
          } else {
            // For non-object and non-array fields, handle differently
            if (key === "category") {
              // Check if the key is "category"
              if (existingObj[key] && existingObj[key] === updateObj[key]) {
                // If the category matches, append to the "values" array
                if (
                  Array.isArray(existingObj["values"]) &&
                  Array.isArray(updateObj["values"])
                ) {
                  existingObj["values"].push(...updateObj["values"]);
                }
              } else {
                // If the category doesn't match, replace the entire object
                existingObj[key] = updateObj[key];
              }
            } else {
              // For other fields, simply update if different
              if (existingObj[key] !== updateObj[key]) {
                existingObj[key] = updateObj[key];
              }
            }
          }
        }
      }
    };

    updateNestedFields(existingAsset, updateFields);

    const updatedAssetDoc = await existingAsset.save();

    return res.status(200).json({
      status: true,
      message: "Update successful",
      data: updatedAssetDoc,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  insertCurency,
  getAllCoins,
  listCurrencyAdmin,
  UpdateCurrency,
};

// const UpdateCurrency = async (req, res) => {
//   try {
//     const { uniqueCoinId } = req.params;
//     const updateFields = req.body;

//     let existingAsset = await currencyModel.findOne({ uniqueCoinId });

//     if (!existingAsset) {
//       return res.status(404).json({ status: false, message: "Not Found!" });
//     }

//     const updateNestedFields = (existingObj, updateObj) => {
//       for (const key in updateObj) {
//         if (updateObj.hasOwnProperty(key)) {
//           if (Array.isArray(updateObj[key])) {
//             existingObj[key] = updateObj[key];
//           } else if (typeof updateObj[key] === "object") {
//             if (!existingObj[key]) {
//               existingObj[key] = {};
//             }
//             updateNestedFields(existingObj[key], updateObj[key]);
//           } else {
//             existingObj[key] = updateObj[key];
//           }
//         }
//       }
//     };

//     updateNestedFields(existingAsset, updateFields);

//     const updatedAssetDoc = await existingAsset.save();

//     return res.status(200).json({
//       status: true,
//       message: "Update successful",
//       data: updatedAssetDoc,
//     });
//   } catch (error) {

//     return res.status(500).json({ status: false, message: error.message });
//   }
// };

// const UpdateCurrency = async (req, res) => {
//   try {
//     const { uniqueCoinId } = req.params;
//     const updateFields = req.body;

//     let existingAsset = await currencyModel.findOne({ uniqueCoinId });

//     if (!existingAsset) {
//       return res.status(404).json({ status: false, message: "Not Found!" });
//     }

//     const updateNestedFields = (existingObj, updateObj) => {
//       for (const key in updateObj) {
//         if (updateObj.hasOwnProperty(key)) {
//           if (Array.isArray(updateObj[key])) {
//             // Handle arrays separately
//             if (!existingObj[key]) {
//               existingObj[key] = [];
//             }

//             // Check each item in the array for uniqueness and insert if not found
//             updateObj[key].forEach((item) => {
//               const existingItem = existingObj[key].find(
//                 (existingItem) => existingItem === item
//               );
//               if (!existingItem) {
//                 existingObj[key].push(item);
//               }
//             });
//           } else if (typeof updateObj[key] === "object") {
//             if (!existingObj[key]) {
//               existingObj[key] = {};
//             }
//             updateNestedFields(existingObj[key], updateObj[key]);
//           } else {
//             // For non-object and non-array fields, simply update if different
//             if (existingObj[key] !== updateObj[key]) {
//               existingObj[key] = updateObj[key];
//             }
//           }
//         }
//       }
//     };

//     updateNestedFields(existingAsset, updateFields);

//     const updatedAssetDoc = await existingAsset.save();

//     return res.status(200).json({
//       status: true,
//       message: "Update successful",
//       data: updatedAssetDoc,
//     });
//   } catch (error) {

//     return res.status(500).json({ status: false, message: error.message });
//   }
// };

// const UpdateCurrency = async (req, res) => {
//   try {
//     const { uniqueCoinId } = req.params;
//     const updateFields = req.body;

//     let existingAsset = await currencyModel.findOne({ uniqueCoinId });

//     if (!existingAsset) {
//       return res.status(404).json({ status: false, message: "Not Found!" });
//     }

//     const updateNestedFields = (existingObj, updateObj) => {
//       for (const key in updateObj) {
//         if (updateObj.hasOwnProperty(key)) {
//           if (Array.isArray(updateObj[key])) {
//             // Handle arrays separately
//             if (!existingObj[key]) {
//               existingObj[key] = [];
//             }

//             // Check each item in the array for uniqueness and insert if not found
//             updateObj[key].forEach((item) => {
//               const existingItem = existingObj[key].find(
//                 (existingItem) => existingItem === item
//               );
//               if (!existingItem) {
//                 existingObj[key].push(item);
//               }
//             });
//           } else if (typeof updateObj[key] === "object") {
//             if (!existingObj[key]) {
//               existingObj[key] = {};
//             }
//             updateNestedFields(existingObj[key], updateObj[key]);
//           } else {
//             // For non-object and non-array fields, handle differently
//             if (key === "values" && Array.isArray(existingObj[key])) {
//               // Special handling for "values" array
//               if (Array.isArray(updateObj[key])) {
//                 // Append values if the key is "values" and both are arrays
//                 existingObj[key].push(...updateObj[key]);
//               }
//             } else {
//               // For other fields, simply update if different
//               if (existingObj[key] !== updateObj[key]) {
//                 existingObj[key] = updateObj[key];
//               }
//             }
//           }
//         }
//       }
//     };

//     updateNestedFields(existingAsset, updateFields);

//     const updatedAssetDoc = await existingAsset.save();

//     return res.status(200).json({
//       status: true,
//       message: "Update successful",
//       data: updatedAssetDoc,
//     });
//   } catch (error) {

//     return res.status(500).json({ status: false, message: error.message });
//   }
// };
