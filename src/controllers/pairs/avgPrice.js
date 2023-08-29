const cron = require("node-cron");
const logger = require("../../../logger");
const currencyModel = require("../../models/currency/cryptocurrency");
const currencyPairs = require("../../models/pairModel/currencyPairs");

const updateAutomatically = async () => {
  try {
    const getAllPairs = await currencyPairs.find();

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

    const updatedCurrencies = [];

    for (const [uniqueCoinId, coinData] of coinIdDataMap.entries()) {
      const averagePrice = coinData.totalPrice / coinData.validEntryCount;
      const marketCap = averagePrice * getAllPairs[0].circulatingSupply;

      const updateCurrency = await currencyModel.findOneAndUpdate(
        { uniqueCoinId },
        {
          $set: {
            price: averagePrice,
            volume: coinData.totalVolume,
            marketCap: marketCap,
          },
        },
        { upsert: true, new: true }
      );

      updatedCurrencies.push(updateCurrency);
    }
  } catch (error) {
    logger.error(error.message);
  }
};

cron.schedule("*/1 * * * *", async () => {
  await updateAutomatically();
});

const addNewPair = async (req, res) => {
  try {
    const addPairInDb = new currencyPairs({ ...req.body });

    if (addPairInDb) {
      await addPairInDb.save();

      return res
        .status(200)
        .send({ status: true, message: "successful", data: addPairInDb });
    } else {
      return res
        .status(404)
        .json({ status: false, message: "Admin not found!" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getAllPairs = async (req, res) => {
  try {
    const { uniqueCoinId } = req.params;

    const getAvgData = await currencyPairs.find({ uniqueCoinId });

    if (getAvgData.length === 0) {
      return res
        .status(404)
        .json({ message: "Data not found for the given uniqueCoinId." });
    }

    return res.status(200).send({ message: "sucessful", data: getAvgData });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getAllExchangesCrypto = async (req, res) => {
  try {
    const { uniqueExchangeId } = req.params;

    const getData = await currencyPairs.find({ uniqueExchangeId });

    return res.status(200).send({ message: "successful", data: getData });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const UpdateCurrency = async (req, res) => {
  try {
    const { uniqueCoinId } = req.params;
    const updateFields = req.body;

    let existingAsset = await currencyModel.findOne({ uniqueCoinId });

    if (!existingAsset) {
      return res.status(404).json({ status: false, message: "Not Found!" });
    } else {
      Object.entries(updateFields).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          existingAsset[key] = value;
        }
      });
    }

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

const UpdateExchangePair = async (req, res) => {
  try {
    const { uniqueCoinId } = req.params;

    const { uniqueExchangeId } = req.params;

    const updateFields = req.body;

    let existingAsset = await currencyPairs.find({
      uniqueCoinId,
      uniqueExchangeId,
    });

    if (existingAsset.length === 0) {
      return res.status(404).json({ status: false, message: "Not Found!" });
    } else {
      Object.entries(updateFields).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          existingAsset[key] = value;
        }
      });
    }

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
  addNewPair,
  getAllPairs,
  UpdateCurrency,
  getAllExchangesCrypto,
  UpdateExchangePair,
};
